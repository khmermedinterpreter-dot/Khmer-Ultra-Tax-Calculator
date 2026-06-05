import React, { useState } from 'react';
import { LookupSection } from './components/LookupSection';
import { Calculator } from './components/Calculator';
import { Results } from './components/Results';
import { CalculationInputs, CalculationResult } from './types';
import { calculateTax, exportToExcel } from './utils';
import { Calculator as CalcIcon, TrendingUp, Key, LogOut, Users } from 'lucide-react';
import { LockScreen } from './components/LockScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { AdminPanel } from './components/AdminPanel';
import { getAccounts, getDisplayName, clearSession } from './authUtils';

const App: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

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
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Force re-render when display name changes

    // Look up the current user's account info
    const currentAccount = currentUser ? getAccounts().find(a => a.username === currentUser) : null;

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

    const handleExport = async () => {
        if (!result) {
            alert("Please calculate first before exporting.");
            return;
        }
        try {
            await exportToExcel(inputs);
            alert("Export completed successfully.");
        } catch (e) {
            console.error(e);
            alert("Export failed: " + e);
        }
    };

    const handleUnlock = (username: string) => {
        setCurrentUser(username);
        setIsUnlocked(true);
    };

    const handleLogout = () => {
        if (currentUser) {
            clearSession(currentUser);
        }
        setCurrentUser(null);
        setIsUnlocked(false);
        // Reset calculator state on logout
        setInputs(initialInputs);
        setResult(null);
    };

    if (!isUnlocked) {
        return <LockScreen onUnlock={handleUnlock} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12 print:bg-white print:p-0">
             {/* Decorative Header Background */}
            <div className="h-64 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 absolute top-0 left-0 right-0 z-0 print:hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 space-y-8 print:w-full print:max-w-none print:p-0 print:space-y-4">
                {/* Floating Top Right Action Buttons */}
                <div className="absolute top-0 right-4 z-20 print:hidden flex items-center gap-2">
                    {/* Logged-in user indicator */}
                    {currentAccount && (
                        <div key={refreshKey} className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl backdrop-blur-sm">
                            <span className="text-sm">{currentAccount.avatar}</span>
                            <span className="font-sans">{currentUser ? getDisplayName(currentUser) : ''}</span>
                            <span className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-full ${
                                currentAccount.role === 'admin'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-slate-500/20 text-slate-400'
                            }`}>
                                {currentAccount.role}
                            </span>
                        </div>
                    )}
                    {/* Security / Change Password button */}
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all shadow-md backdrop-blur-sm"
                        title="Account Settings"
                    >
                        <Key size={13} />
                        <span>សុវត្ថិភាព / Settings</span>
                    </button>
                    {/* Admin Panel button — admin only */}
                    {currentAccount?.role === 'admin' && (
                        <button
                            onClick={() => setShowAdminPanel(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 border border-amber-500/20 text-xs font-semibold rounded-xl transition-all shadow-md backdrop-blur-sm"
                            title="Manage Accounts"
                        >
                            <Users size={13} />
                            <span>គ្រប់គ្រង / Manage</span>
                        </button>
                    )}
                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-300 border border-red-500/20 text-xs font-semibold rounded-xl transition-all shadow-md backdrop-blur-sm"
                        title="Logout"
                    >
                        <LogOut size={13} />
                        <span>ចាកចេញ / Logout</span>
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
            
            {showPasswordModal && currentUser && (
                <ChangePasswordModal 
                    onClose={(nameChanged) => {
                        setShowPasswordModal(false);
                        if (nameChanged) setRefreshKey(k => k + 1);
                    }} 
                    currentUser={currentUser}
                />
            )}

            {showAdminPanel && (
                <AdminPanel
                    onClose={(changed) => {
                        setShowAdminPanel(false);
                        if (changed) setRefreshKey(k => k + 1);
                    }}
                />
            )}
        </div>
    );
};

export default App;
