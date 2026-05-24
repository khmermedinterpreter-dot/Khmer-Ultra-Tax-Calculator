import React from 'react';
import QRCode from 'react-qr-code';
import { CalculationResult, CalculationInputs } from '../types';

interface ResultsProps {
    result: CalculationResult;
    inputs: CalculationInputs;
}

export const Results: React.FC<ResultsProps> = ({ result, inputs }) => {
    
    const totals = result.yearlyDetails.reduce((acc, row) => {
        acc.yearlyTax += row.yearlyTax;
        acc.fine += row.fine;
        acc.interest += row.interest;
        return acc;
    }, { yearlyTax: 0, fine: 0, interest: 0 });

    // Serialize all the inputs into a JSON string for data portability
    const qrCodeValue = JSON.stringify(inputs);

    return (
        <div id="output-section" className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in print:shadow-none print:border-none print:mt-0">
            {/* Header / Timestamp */}
            <div className="bg-slate-900 text-white p-4 text-center print:hidden">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Calculation Timestamp</p>
                <p className="font-mono text-sm">{result.timestamp}</p>
            </div>

            <div className="p-8 print:p-2">
                {/* Owner Info & Timestamp - only on print */}
                <div className="hidden print:flex justify-between items-start border-b border-slate-300 mb-4 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Tax Report For: {inputs.ownerName || 'N/A'}</h2>
                        <p className="text-sm text-slate-600">PIN: {inputs.pin || 'N/A'} | Phone: {inputs.phone || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-semibold">Generated On:</p>
                        <p className="font-mono text-sm text-slate-700">{result.timestamp}</p>
                    </div>
                </div>

                {/* QR Code & Main Summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-10 items-center justify-center print:mb-6 print:gap-4 print:flex-row">
                    <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm print:p-1 print:border-slate-300">
                        <QRCode 
                            value={qrCodeValue} 
                            size={120}
                            className="w-full h-auto print:max-w-[100px]"
                        />
                         <p className="text-center text-[10px] text-slate-400 mt-2 font-mono print:hidden">SCAN FOR DETAILS</p>
                    </div>
                    
                    <div className="flex-1 w-full max-w-md print:max-w-none">
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 print:bg-white print:p-0 print:border-none">
                             <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-4 print:pb-2 print:mb-2">
                                <span className="text-slate-500 font-bold text-sm print:text-xs">តម្លៃអចលនទ្រព្យសរុប</span>
                                <span className="text-xl font-bold text-slate-800 font-mono print:text-lg">${result.totalValSale.toLocaleString()}</span>
                             </div>
                             <div className="space-y-3 print:space-y-1">
                                <div className="flex justify-between items-center text-sm print:text-xs">
                                    <span className="text-slate-500">តម្លៃដី (Land)</span>
                                    <span className="font-bold text-slate-700">${result.landValSale.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm print:text-xs">
                                    <span className="text-slate-500">តម្លៃសំណង់ (Building)</span>
                                    <span className="font-bold text-slate-700">${result.buildVal.toLocaleString()}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Tax Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 print:grid-cols-2 print:gap-4 print:mb-6">
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-slate-700 text-sm print:py-2 print:px-3 print:text-xs">
                            ព័ត៌មានលម្អិតពន្ធ (Tax Breakdown)
                        </div>
                        <div className="p-4 space-y-4 print:p-3 print:space-y-2">
                             <div className="flex justify-between items-center print:text-xs">
                                <span className="text-slate-600 text-sm print:text-xs">ពន្ធប្រថាប់ត្រា (Transfer Tax 4%)</span>
                                <span className="font-bold text-blue-600 font-mono">${result.saleTax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center print:text-xs">
                                <span className="text-slate-600 text-sm print:text-xs">ពន្ធប្រចាំឆ្នាំ (Yearly Tax)</span>
                                <span className="font-bold text-slate-800 font-mono">${result.yearlyTax.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/year</span></span>
                            </div>
                             <div className="flex justify-between items-center print:text-xs">
                                <span className="text-slate-600 text-sm print:text-xs">សេវាសាធារណៈ (Public Service)</span>
                                <span className="font-bold text-slate-800 font-mono">${result.taxSvc.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="bg-red-50 rounded-xl border-2 border-red-100 p-6 text-center transform hover:scale-105 transition-transform duration-300 print:p-4 print:transform-none">
                            <h3 className="text-red-800 font-bold text-lg mb-2 print:text-base print:mb-1">សរុបពន្ធត្រូវបង់ (Grand Total)</h3>
                            <div className="text-4xl font-extrabold text-red-600 font-mono tracking-tight print:text-3xl">
                                ${result.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-red-400 text-xs mt-2 print:hidden">រួមបញ្ចូលប្រាក់ពិន័យ និងការប្រាក់ (Included Penalty & Interest)</p>
                        </div>
                    </div>
                </div>

                {/* Yearly Details Table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm print:border-slate-300 print:shadow-none">
                    <table className="w-full text-sm text-left print:text-xs">
                        <thead className="bg-slate-50 text-slate-900 print:bg-slate-100">
                            <tr>
                                <th className="p-4 font-bold border-b border-slate-200 text-center print:p-2">ល.រ</th>
                                <th className="p-4 font-bold border-b border-slate-200 print:p-2">ឆ្នាំ (Year)</th>
                                <th className="p-4 font-bold border-b border-slate-200 text-center print:p-2">ខែយឺត (Late)</th>
                                <th className="p-4 font-bold border-b border-slate-200 text-right print:p-2">ពន្ធ (Base)</th>
                                <th className="p-4 font-bold border-b border-slate-200 text-right text-red-600 print:p-2">ពិន័យ (10%)</th>
                                <th className="p-4 font-bold border-b border-slate-200 text-right text-red-600 print:p-2">ការប្រាក់ (1.5%)</th>
                                <th className="p-4 font-bold border-b border-slate-200 text-right print:p-2">សរុប (Total)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {result.yearlyDetails.map((row, index) => (
                                <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-700 text-center print:p-2">{index + 1}</td>
                                    <td className="p-4 font-medium text-slate-900 print:p-2">{row.year}</td>
                                    <td className="p-4 text-center font-mono text-xs text-amber-600 print:p-2">
                                        {row.monthsLate > 0 ? `${row.monthsLate}ខែ (${row.daysLate} ថ្ងៃ)` : '-'}
                                    </td>
                                    <td className="p-4 text-right text-slate-600 font-mono print:p-2">${row.yearlyTax.toFixed(2)}</td>
                                    <td className="p-4 text-right text-red-500 font-mono print:p-2">${row.fine.toFixed(2)}</td>
                                    <td className="p-4 text-right text-red-500 font-mono print:p-2">${row.interest.toFixed(2)}</td>
                                    <td className="p-4 text-right font-bold text-slate-900 font-mono bg-slate-50/50 print:p-2 print:bg-slate-100">${row.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            {result.yearlyDetails.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400 italic print:p-4">
                                        មិនមានទិន្នន័យពន្ធដែលត្រូវបង់សម្រាប់ឆ្នាំដែលបានជ្រើសរើស។
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {result.yearlyDetails.length > 0 && (
                            <tfoot className="bg-slate-100">
                                <tr className="font-bold text-slate-900">
                                    <td className="p-4 border-t-2 border-slate-200 text-right print:p-2" colSpan={3}>សរុបរួម (Totals)</td>
                                    <td className="p-4 border-t-2 border-slate-200 text-right font-mono print:p-2">${totals.yearlyTax.toFixed(2)}</td>
                                    <td className="p-4 border-t-2 border-slate-200 text-right font-mono text-red-600 print:p-2">${totals.fine.toFixed(2)}</td>
                                    <td className="p-4 border-t-2 border-slate-200 text-right font-mono text-red-600 print:p-2">${totals.interest.toFixed(2)}</td>
                                    <td className="p-4 border-t-2 border-slate-200 text-right font-mono bg-slate-200 print:p-2">${result.totalPaid.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};