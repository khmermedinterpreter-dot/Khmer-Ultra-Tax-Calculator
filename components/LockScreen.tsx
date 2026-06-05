import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import {
    UserAccount,
    getAccounts,
    getDisplayName,
    hashPassword,
    getStoredPasswordHash,
    setSession,
    findActiveSession,
} from '../authUtils';

interface LockScreenProps {
    onUnlock: (username: string) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
    const accounts = getAccounts();
    const [selectedAccount, setSelectedAccount] = useState<UserAccount>(accounts[0]);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoLoginChecked, setAutoLoginChecked] = useState(false);

    // Auto-login on mount if any user has a valid saved session
    useEffect(() => {
        const checkAutoLogin = async () => {
            const username = await findActiveSession();
            if (username) {
                onUnlock(username);
            }
            setAutoLoginChecked(true);
        };
        checkAutoLogin();
    }, [onUnlock]);

    const handleSelectAccount = (account: UserAccount) => {
        setSelectedAccount(account);
        setPassword('');
        setError('');
        setIsShaking(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const enteredHash = await hashPassword(password);
            const targetHash = await getStoredPasswordHash(selectedAccount.username);

            if (enteredHash === targetHash) {
                setSession(selectedAccount.username, targetHash, rememberMe);
                onUnlock(selectedAccount.username);
            } else {
                setError('កូដសម្ងាត់មិនត្រឹមត្រូវទេ! សូមព្យាយាមម្តងទៀត។');
                setIsShaking(true);
                setPassword('');
                setTimeout(() => setIsShaking(false), 500);
            }
        } catch {
            setError('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់កូដសម្ងាត់។');
        } finally {
            setLoading(false);
        }
    };

    // Don't render until auto-login check completes (prevents flash)
    if (!autoLoginChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Unlock className="w-10 h-10 animate-pulse text-blue-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden select-none font-hanuman">
            {/* Custom CSS for Animations injected dynamically */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                    20%, 40%, 60%, 80% { transform: translateX(6px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scaleIn 0.3s ease-out forwards;
                }
            `}</style>

            {/* Glowing Decorative Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[100px] pointer-events-none animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full filter blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '-3s' }}></div>

            {/* Main Lock Card Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 transition-transform duration-300 ${isShaking ? 'animate-shake border-red-500/50 shadow-red-500/10' : ''}`}>
                    
                    {/* Header with Lock Icon */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className={`p-4 rounded-2xl border transition-all duration-300 mb-4 shadow-xl ${
                            error ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-blue-400'
                        }`}>
                            {loading ? (
                                <Unlock className="w-10 h-10 animate-pulse text-green-400" />
                            ) : (
                                <Lock className="w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }} />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wider mb-2 font-sans">ULTRA TAX CALCULATOR</h1>
                        <p className="text-sm font-medium text-slate-400">ប្រព័ន្ធគណនាពន្ធអចលនទ្រព្យ (Market & Base Value)</p>
                        <p className="text-xs text-blue-400/80 mt-1 font-sans font-semibold uppercase tracking-widest">Secured Gateway</p>
                    </div>

                    {/* ── Account Picker ── */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                            ជ្រើសរើសគណនី / Select Account
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                            {accounts.map((account, idx) => {
                                const isSelected = selectedAccount.username === account.username;
                                return (
                                    <button
                                        key={account.username}
                                        type="button"
                                        onClick={() => handleSelectAccount(account)}
                                        className={`relative flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border transition-all duration-200 animate-scale-in group
                                            ${isSelected
                                                ? 'bg-blue-500/15 border-blue-500/40 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30'
                                                : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'
                                            }`}
                                        style={{ animationDelay: `${idx * 80}ms` }}
                                        disabled={loading}
                                    >
                                        {/* Avatar */}
                                        <span className={`text-2xl transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                                            {account.avatar}
                                        </span>
                                        {/* Display name */}
                                        <span className={`text-[11px] font-semibold font-sans tracking-wide transition-colors text-center leading-tight ${
                                            isSelected ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-300'
                                        }`}>
                                            {getDisplayName(account.username)}
                                        </span>
                                        {/* Role badge */}
                                        <span className={`text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded-full ${
                                            account.role === 'admin'
                                                ? 'bg-amber-500/15 text-amber-400/80'
                                                : 'bg-slate-500/15 text-slate-500'
                                        }`}>
                                            {account.role}
                                        </span>
                                        {/* Selection indicator dot */}
                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900 shadow-md"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {/* Error Alert Box */}
                        {error && (
                            <div className="flex items-start gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Selected account indicator */}
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                            <span className="text-lg">{selectedAccount.avatar}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate font-sans">{getDisplayName(selectedAccount.username)}</p>
                                <p className="text-[11px] text-slate-400 truncate">{selectedAccount.username} • {selectedAccount.role}</p>
                            </div>
                            <LogIn className="w-4 h-4 text-blue-400/60" />
                        </div>

                        {/* Password input */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                                លេខកូដសម្ងាត់ / Access Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full px-4 py-3.5 bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans text-lg tracking-widest text-center"
                                    required
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember device toggler */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4.5 h-4.5 rounded border-white/10 bg-slate-950/60 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-900 focus:outline-none"
                                />
                                <span>ចងចាំឧបករណ៍នេះ / Remember this device</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <span>{loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ចូលទៅកាន់ប្រព័ន្ធ / Unlock System'}</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Subtle Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-600 font-sans tracking-wide">
                © {new Date().getFullYear()} Ultra Tax Calculator. All rights reserved.
            </div>
        </div>
    );
};
