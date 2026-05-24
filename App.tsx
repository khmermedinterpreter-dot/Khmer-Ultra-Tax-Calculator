import React, { useState } from 'react';
import { LookupSection } from './components/LookupSection';
import { Calculator } from './components/Calculator';
import { Results } from './components/Results';
import { CalculationInputs, CalculationResult } from './types';
import { calculateTax, exportToExcel } from './utils';
import { Calculator as CalcIcon, TrendingUp, Key } from 'lucide-react';
import { LockScreen } from './components/LockScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';

const App: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(() => {
        // Fast sync bypass if session token is in sessionStorage
        return !!sessionStorage.getItem('utc_session_token');
    });

    // Initial State
    const initialInputs: CalculationInputs = {
        ownerName: '',
        phone: '',
        pin: '',
        landSize: 0,
        marketPrice: 0,
        basePrice: 0,
        floors: [],
        exportYears: 5,
        skipPenalty: false,
        yearStart: 2019,
        yearEnd: new Date().getFullYear(),
        monthEnd: new Date().getMonth() + 1,
        dayEnd: new Date().getDate(),
    };

    const [inputs, setInputs] = useState<CalculationInputs>(initialInputs);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Handlers
    const handleSelectPrice = (market: number, base: number) => {
        setInputs(prev => ({
            ...prev,
            marketPrice: market,
            basePrice: base
        }));
        
        // Smooth scroll to calculator
        document.getElementById('calc-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCalculate = () => {
        const res = calculateTax(inputs);
        setResult(res);
        // Wait for render then scroll
        setTimeout(() => {
             document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleReset = () => {
        setInputs(initialInputs);
        setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExport = () => {
        if (!result) {
            alert("Please calculate first before exporting.");
            return;
        }
        exportToExcel(inputs);
    };

    if (!isUnlocked) {
        return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12 print:bg-white print:p-0">
             {/* Decorative Header Background */}
            <div className="h-64 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 absolute top-0 left-0 right-0 z-0 print:hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 space-y-8 print:w-full print:max-w-none print:p-0 print:space-y-4">
                {/* Floating Top Right Security Button */}
                <div className="absolute top-0 right-4 z-20 print:hidden">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all shadow-md backdrop-blur-sm"
                        title="Change Password"
                    >
                        <Key size={13} />
                        <span>លេខកូដសុវត្ថិភាព / Security</span>
                    </button>
                </div>
                
                {/* Header */}
                <header className="text-center mb-8 print:mb-6">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4 shadow-xl print:hidden">
                        <CalcIcon size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight print:text-slate-900 print:text-3xl">ULTRA TAX CALCULATOR</h1>
                    <p className="text-blue-200 font-medium text-lg print:text-slate-500 print:text-base">ប្រព័ន្ធគណនាពន្ធអចលនទ្រព្យ (Market & Base Value)</p>
                </header>

                {/* Main Content wrapper for hiding on print */}
                <main className="space-y-8 print:hidden">
                    <LookupSection onSelectPrice={handleSelectPrice} />
                    <Calculator 
                        inputs={inputs} 
                        setInputs={setInputs} 
                        onCalculate={handleCalculate}
                        onReset={handleReset}
                        onExport={handleExport}
                    />
                </main>

                {result && (
                    <Results result={result} inputs={inputs} />
                )}
            </div>
            
            <footer className="relative z-10 mt-16 text-center text-slate-400 text-sm print:hidden">
                <p className="flex items-center justify-center gap-2">
                    <TrendingUp size={16} /> 
                    <span>© {new Date().getFullYear()} Ultra Tax Calculator. All rights reserved.</span>
                </p>
            </footer>
            
            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </div>
    );
};

export default App;
