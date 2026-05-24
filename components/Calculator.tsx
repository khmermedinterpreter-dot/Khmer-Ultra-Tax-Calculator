import React from 'react';
import { CalculationInputs } from '../types';
import { Calculator as CalculatorIcon, RotateCcw, FileSpreadsheet, Printer } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

interface CalculatorProps {
    inputs: CalculationInputs;
    setInputs: React.Dispatch<React.SetStateAction<CalculationInputs>>;
    onCalculate: () => void;
    onReset: () => void;
    onExport: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ inputs, setInputs, onCalculate, onReset, onExport }) => {
    
    const handleInputChange = <K extends keyof CalculationInputs>(field: K, value: CalculationInputs[K]) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleFloorCountChange = (count: number) => {
        const newFloors = [];
        for (let i = 0; i < count; i++) {
            const defaultCost = i === 0 ? 250 : (i === 1 ? 200 : 150);
            newFloors.push({ 
                id: `floor-${i}`, 
                size: inputs.floors[i]?.size || 0, 
                cost: inputs.floors[i]?.cost || defaultCost 
            });
        }
        setInputs(prev => ({ ...prev, floors: newFloors }));
    };

    const handleFloorDetailChange = (index: number, field: 'size' | 'cost', val: number) => {
        const newFloors = [...inputs.floors];
        newFloors[index] = { ...newFloors[index], [field]: val };
        setInputs(prev => ({ ...prev, floors: newFloors }));
    };

    const handlePrint = () => {
        const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;
        if (isTauri) {
            invoke('print_window').catch(err => {
                console.error("Tauri native print failed, falling back to window.print():", err);
                window.print();
            });
        } else {
            window.print();
        }
    };

    // Forced light theme styles for inputs to prevent "black on black" issues
    const inputClass = "w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm placeholder-slate-400 font-medium";
    const labelClass = "block text-sm font-bold text-slate-700 mb-2";

    return (
        <div id="calc-section" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm text-sm font-bold">2</div>
                    គណនាពន្ធ (Calculation)
                </h3>
            </div>

            <div className="p-6 bg-slate-50/50">
                {/* Info & Land Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">ព័ត៌មានម្ចាស់ & ទ្រព្យ (Property Info)</h4>
                    </div>

                    <div>
                        <label className={labelClass}>ឈ្មោះម្ចាស់ (Owner)</label>
                        <input 
                            type="text" 
                            className={inputClass}
                            placeholder="ឈ្មោះម្ចាស់កម្មសិទ្ធិ"
                            value={inputs.ownerName}
                            onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>លេខទូរស័ព្ទ (Phone)</label>
                        <input 
                            type="text" 
                            className={inputClass}
                            placeholder="012 xxx xxx"
                            value={inputs.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>PIN / លេខកូដទ្រព្យ</label>
                        <input 
                            type="text" 
                            className={inputClass}
                            placeholder="លេខកូដសម្គាល់អចលនទ្រព្យ"
                            value={inputs.pin}
                            onChange={(e) => handleInputChange('pin', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>ទំហំដី (m²)</label>
                        <input 
                            type="number" 
                            min="0"
                            className={inputClass}
                            placeholder="0.00"
                            value={inputs.landSize || ''}
                            onChange={(e) => handleInputChange('landSize', parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                {/* Price Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-blue-700 mb-2">តម្លៃទីផ្សារ ($/m² - Market)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold">$</span>
                            <input 
                                type="number" 
                                min="0"
                                className={`w-full pl-8 pr-4 py-3 bg-white text-blue-900 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold shadow-sm placeholder-blue-300`}
                                placeholder="0.00"
                                value={inputs.marketPrice || ''}
                                onChange={(e) => handleInputChange('marketPrice', parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-green-700 mb-2">តម្លៃពន្ធមូលដ្ឋាន ($/m² - Base)</label>
                        <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-bold">$</span>
                            <input 
                                type="number" 
                                min="0"
                                className={`w-full pl-8 pr-4 py-3 bg-white text-green-900 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-bold shadow-sm placeholder-green-300`}
                                placeholder="0.00"
                                value={inputs.basePrice || ''}
                                onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Building Floors Section */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
                     <div className="flex justify-between items-center mb-4">
                        <label className="text-slate-800 font-bold flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                             ចំនួនជាន់ (Floors)
                        </label>
                        <div className="w-32">
                            <input 
                                type="number" 
                                min="0" 
                                max="50"
                                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-center font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                value={inputs.floors.length}
                                onChange={(e) => handleFloorCountChange(parseInt(e.target.value) || 0)}
                            />
                        </div>
                     </div>

                     {inputs.floors.length > 0 && (
                         <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <div className="grid grid-cols-12 bg-slate-100 p-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                                <div className="col-span-4 pl-2">ជាន់ (Floor)</div>
                                <div className="col-span-4">ទំហំ (Size m²)</div>
                                <div className="col-span-4">តម្លៃ (Cost $/m²)</div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 bg-white">
                                {inputs.floors.map((floor, idx) => (
                                    <div key={floor.id} className="grid grid-cols-12 p-3 gap-3 items-center hover:bg-slate-50 transition-colors">
                                        <div className="col-span-4 pl-2 font-bold text-slate-700 text-sm">
                                            {idx === 0 ? 'ផ្ទាល់ដី (E0)' : `ជាន់ទី ${idx}`}
                                        </div>
                                        <div className="col-span-4">
                                            <input 
                                                type="number" 
                                                className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                                                value={floor.size || ''}
                                                onChange={(e) => handleFloorDetailChange(idx, 'size', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input 
                                                type="number" 
                                                className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                                                value={floor.cost || ''}
                                                onChange={(e) => handleFloorDetailChange(idx, 'cost', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                     )}
                </div>

                {/* Configuration & Buttons */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Simulation Settings */}
                        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                             <h5 className="text-cyan-800 font-bold text-sm mb-3 flex items-center gap-2">
                                <RotateCcw size={14}/>
                                ការកំណត់កាលបរិច្ឆេទ (Date Settings)
                             </h5>
                             <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-cyan-600 uppercase block mb-1">Year Start</label>
                                    <input type="number" className="w-full p-2 bg-white border border-cyan-200 text-cyan-900 rounded-lg text-center font-medium outline-none focus:border-cyan-500" value={inputs.yearStart} onChange={(e) => handleInputChange('yearStart', parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-cyan-600 uppercase block mb-1">Pay Year</label>
                                    <input type="number" className="w-full p-2 bg-white border border-cyan-200 text-cyan-900 rounded-lg text-center font-medium outline-none focus:border-cyan-500" value={inputs.yearEnd} onChange={(e) => handleInputChange('yearEnd', parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-cyan-600 uppercase block mb-1">Month</label>
                                    <input type="number" className="w-full p-2 bg-white border border-cyan-200 text-cyan-900 rounded-lg text-center font-medium outline-none focus:border-cyan-500" value={inputs.monthEnd} onChange={(e) => handleInputChange('monthEnd', parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-cyan-600 uppercase block mb-1">Day</label>
                                    <input type="number" className="w-full p-2 bg-white border border-cyan-200 text-cyan-900 rounded-lg text-center font-medium outline-none focus:border-cyan-500" value={inputs.dayEnd} onChange={(e) => handleInputChange('dayEnd', parseInt(e.target.value))} />
                                </div>
                             </div>
                        </div>

                         <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => handleInputChange('skipPenalty', !inputs.skipPenalty)}>
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="skip_penalty"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-blue-600 checked:bg-blue-600 hover:shadow-md bg-white"
                                    checked={inputs.skipPenalty}
                                    onChange={(e) => handleInputChange('skipPenalty', e.target.checked)}
                                />
                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                            <label htmlFor="skip_penalty" className="font-bold text-slate-700 select-none cursor-pointer text-sm">
                                មិនគណនាការប្រាក់/ពិន័យ (Skip Penalty)
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 justify-end print:hidden">
                        <div className="flex gap-3">
                             <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Export Years</label>
                                <input 
                                    type="number" 
                                    min="1" max="20"
                                    className="w-full p-3 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    value={inputs.exportYears}
                                    onChange={(e) => handleInputChange('exportYears', parseInt(e.target.value))}
                                />
                             </div>
                             <button onClick={onReset} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all">
                                <RotateCcw size={18} /> <span className="text-sm">សម្អាត</span>
                            </button>
                        </div>

                        <button onClick={onCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                            <CalculatorIcon size={20} /> គណនា (Calculate)
                        </button>
                        
                        <div className="flex gap-3">
                             <button onClick={onExport} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-sm">
                                <FileSpreadsheet size={18} /> Export Excel
                            </button>
                            <button onClick={handlePrint} className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-sm">
                                <Printer size={18} /> Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};