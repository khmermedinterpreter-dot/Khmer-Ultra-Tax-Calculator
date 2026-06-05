import { CalculationInputs, CalculationResult, YearlyDetail } from './types';
import * as XLSX from 'xlsx';
import { invoke } from '@tauri-apps/api/core';

export const calculateTax = (inputs: CalculationInputs, simYearEnd?: number): CalculationResult => {
    const {
        landSize, marketPrice, basePrice, floors,
        yearStart, yearEnd, monthEnd, dayEnd, skipPenalty
    } = inputs;

    const targetYearEnd = simYearEnd ?? yearEnd;

    const landValSale = landSize * marketPrice;
    const landValYearly = landSize * basePrice;
    
    const buildVal = floors.reduce((acc, floor) => acc + (floor.size * floor.cost), 0);
    
    const totalValSale = landValSale + buildVal;
    const totalValYearly = landValYearly + buildVal;

    // Tax base is 80% of total property value minus 25,000 allowance
    const taxBase = ((80 / 100) * totalValYearly) - 25000;
    
    // Yearly Tax is 0.1% of tax base, minimum 0
    const rawYearlyTax = taxBase > 0 ? (taxBase * 0.001) : 0;
    // Round to 4 decimal places roughly equivalent to standard calc
    const yearlyTax = Math.round(rawYearlyTax * 10000) / 10000.0;
    
    // Transfer Tax (4%)
    const saleTax = Math.round((totalValSale * 0.04) * 10000) / 10000.0;
    
    // Public Service Fee (if tax > 1000, fee is 100, else 0? Logic from source: saleTax < 1000 ? 0 : 100)
    // Actually source says: let taxSvc = saleTax < 1000 ? 0 : 100;
    const taxSvc = saleTax < 1000 ? 0 : 100;

    let totalPaid = 0;
    const yearlyDetails: YearlyDetail[] = [];

    if (yearlyTax > 0) {
        const payDate = new Date(targetYearEnd, monthEnd - 1, dayEnd);
        
        for (let y = yearStart; y <= targetYearEnd; y++) {
            // Tax due date is September 30th (month index 8)
            const dueDate = new Date(y, 8, 30);
            let fine = 0;
            let interest = 0;
            let monthsLate = 0;
            let daysLate = 0;

            if (!skipPenalty && payDate > dueDate) {
                const timeDiff = payDate.getTime() - dueDate.getTime();
                // Approx months for interest calculation
                monthsLate = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
                // Exact days for display
                daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                fine = yearlyTax * 0.10; // 10% penalty
                interest = yearlyTax * 0.015 * monthsLate; // 1.5% per month
            }

            const subTotal = yearlyTax + fine + interest;
            totalPaid += subTotal;
            
            yearlyDetails.push({
                year: y,
                yearlyTax: yearlyTax,
                fine: fine,
                interest: interest,
                total: subTotal,
                monthsLate: monthsLate,
                daysLate: daysLate
            });
        }
    }

    const grandTotal = totalPaid + saleTax + taxSvc;

    return {
        landValSale,
        buildVal,
        totalValSale,
        saleTax,
        yearlyTax,
        taxSvc,
        totalPaid,
        grandTotal,
        yearlyDetails,
        timestamp: new Date().toLocaleString()
    };
};

export const exportToExcel = async (inputs: CalculationInputs): Promise<void> => {
    const wb = XLSX.utils.book_new();
    const yearlyTotals: { year: number; total: number }[] = [];

    // Limit export years to a reasonable maximum (10) to avoid huge files
    const maxExportYears = 10;
    const exportYears = Math.min(inputs.exportYears, maxExportYears);
    if (inputs.exportYears > maxExportYears) {
        alert(`Export years limited to ${maxExportYears} for performance reasons.`);
    }

    // Simulate future years
    for (let i = 0; i < exportYears; i++) {
        const simulatedYear = inputs.yearEnd + i;
        const result = calculateTax(inputs, simulatedYear);
        yearlyTotals.push({ year: simulatedYear, total: result.grandTotal });

        const detailData = [
            ["Year", "Base Tax", "Penalty (10%)", "Interest (1.5%)", "Total"],
            ...result.yearlyDetails.map(d => [
                d.year,
                d.yearlyTax.toFixed(2),
                d.fine.toFixed(2),
                d.interest.toFixed(2),
                d.total.toFixed(2)
            ]),
            ["", "", "", "Grand Total:", result.totalPaid.toFixed(2)]
        ];
        const sheet = XLSX.utils.aoa_to_sheet(detailData);
        // Ensure unique sheet name even if simulatedYear repeats (unlikely)
        const sheetName = `${simulatedYear}`;
        XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    }

    // Summary Sheet
    const summaryData = [
        ["Projection Summary"],
        ["Simulated Year", "Estimated Grand Total Tax"],
        ...yearlyTotals.map(d => [d.year, d.total.toFixed(2)])
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;
    if (isTauri) {
        try {
            const base64Data = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
            await invoke('save_excel_file', { base64_data: base64Data, filename: "Ultra_Tax_Report.xlsx" });
            console.log("File saved via Tauri");
        } catch (err) {
            console.error("Error saving file in Tauri:", err);
            if (err !== "User cancelled the save dialog") {
                alert("Failed to export Excel: " + err);
            }
        }
    } else {
        XLSX.writeFile(wb, "Ultra_Tax_Report.xlsx");
    }
};