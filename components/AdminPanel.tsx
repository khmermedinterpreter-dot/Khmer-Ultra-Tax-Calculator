import React, { useState } from 'react';
import {
    Users, X, Pencil, Check, RotateCcw, AlertCircle, CheckCircle, KeyRound,
    Eye, EyeOff,
} from 'lucide-react';
import {
    getAccounts,
    getDisplayName,
    setDisplayName,
    clearDisplayName,
    hashPassword,
    setStoredPasswordHash,
    clearStoredPasswordHash,
    setSession,
    UserAccount,
} from '../authUtils';

interface AdminPanelProps {
    onClose: (changed?: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const accounts = getAccounts();

    // Per-account editing state
    const [editingName, setEditingName] = useState<string | null>(null);
    const [nameValue, setNameValue] = useState('');
    const [resetPwdUser, setResetPwdUser] = useState<string | null>(null);
    const [newPwdValue, setNewPwdValue] = useState('');
    const [showNewPwd, setShowNewPwd] = useState(false);

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [changed, setChanged] = useState(false);
    const [loading, setLoading] = useState(false);

    // Force re-render for display names
    const [, setRefresh] = useState(0);

    const clearMessages = () => {
        setSuccess('');
        setError('');
    };

    // ── Name Editing ──

    const startEditName = (account: UserAccount) => {
        clearMessages();
        setEditingName(account.username);
        setNameValue(getDisplayName(account.username));
        setResetPwdUser(null);
    };

    const saveName = (username: string) => {
        if (!nameValue.trim()) return;
        setDisplayName(username, nameValue.trim());
        setEditingName(null);
        setChanged(true);
        setRefresh(n => n + 1);
        setSuccess(`ឈ្មោះ "${username}" ត្រូវបានផ្លាស់ប្តូរជា "${nameValue.trim()}" / Name updated!`);
    };

    const resetName = (account: UserAccount) => {
        clearMessages();
        clearDisplayName(account.username);
        setChanged(true);
        setRefresh(n => n + 1);
        setSuccess(`ឈ្មោះ "${account.username}" បានកំណត់ទៅលំនាំដើមវិញ / Name reverted to default!`);
    };

    // ── Password Reset ──

    const startResetPwd = (account: UserAccount) => {
        clearMessages();
        setResetPwdUser(account.username);
        setNewPwdValue('');
        setShowNewPwd(false);
        setEditingName(null);
    };

    const saveNewPwd = async (username: string) => {
        if (!newPwdValue || newPwdValue.length < 4) {
            setError('លេខកូដសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៤ តួអក្សរ / Password must be at least 4 characters.');
            return;
        }
        setLoading(true);
        try {
            const hash = await hashPassword(newPwdValue);
            setStoredPasswordHash(username, hash);
            // Also update the session for this user if they have one
            setSession(username, hash, true);
            setResetPwdUser(null);
            setNewPwdValue('');
            setChanged(true);
            setSuccess(`លេខកូដសម្ងាត់ "${username}" ត្រូវបានកំណត់ថ្មី / Password for "${username}" has been set!`);
        } catch {
            setError('មានបញ្ហាក្នុងការកំណត់លេខកូដសម្ងាត់ / Failed to set password.');
        } finally {
            setLoading(false);
        }
    };

    const revertPwdToDefault = (account: UserAccount) => {
        clearMessages();
        clearStoredPasswordHash(account.username);
        setResetPwdUser(null);
        setChanged(true);
        setSuccess(`លេខកូដសម្ងាត់ "${account.username}" បានកំណត់ទៅ "${account.defaultPassword}" / Password reverted to default!`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4">
            <style>{`
                @keyframes adminSlideIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .admin-slide-in { animation: adminSlideIn 0.3s ease-out forwards; }
            `}</style>

            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden relative admin-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-amber-500/15 rounded-lg">
                            <Users className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="font-bold text-white text-base font-sans tracking-wide">គ្រប់គ្រងគណនី / Manage Accounts</span>
                    </div>
                    <button
                        onClick={() => onClose(changed)}
                        className="text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Status Alerts */}
                    {error && (
                        <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-start gap-2.5 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Account Cards */}
                    {accounts.map((account) => {
                        const isEditingThisName = editingName === account.username;
                        const isResettingPwd = resetPwdUser === account.username;
                        const currentDisplayName = getDisplayName(account.username);

                        return (
                            <div
                                key={account.username}
                                className="bg-slate-950/40 border border-white/[0.06] rounded-2xl overflow-hidden"
                            >
                                {/* Account Header Row */}
                                <div className="flex items-center gap-3 px-4 py-3.5">
                                    <span className="text-2xl">{account.avatar}</span>
                                    <div className="flex-1 min-w-0">
                                        {isEditingThisName ? (
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="text"
                                                    value={nameValue}
                                                    onChange={(e) => setNameValue(e.target.value)}
                                                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-blue-500/30 rounded-lg text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveName(account.username);
                                                        if (e.key === 'Escape') setEditingName(null);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => saveName(account.username)}
                                                    className="p-1.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 rounded-lg transition-all active:scale-95"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-semibold text-white font-sans truncate">{currentDisplayName}</p>
                                                <p className="text-[10px] text-slate-500 font-sans">{account.username}</p>
                                            </>
                                        )}
                                    </div>
                                    <span className={`text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded-full ${
                                        account.role === 'admin'
                                            ? 'bg-amber-500/15 text-amber-400/80'
                                            : 'bg-slate-500/15 text-slate-500'
                                    }`}>
                                        {account.role}
                                    </span>
                                </div>

                                {/* Inline Password Reset */}
                                {isResettingPwd && (
                                    <div className="px-4 pb-3 space-y-2">
                                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                            លេខកូដសម្ងាត់ថ្មី / New Password for {account.username}
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                            <div className="relative flex-1">
                                                <input
                                                    type={showNewPwd ? 'text' : 'password'}
                                                    value={newPwdValue}
                                                    onChange={(e) => setNewPwdValue(e.target.value)}
                                                    placeholder="Min 4 characters..."
                                                    className="w-full px-3 py-2 bg-slate-900 border border-amber-500/20 rounded-lg text-white text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveNewPwd(account.username);
                                                        if (e.key === 'Escape') setResetPwdUser(null);
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPwd(!showNewPwd)}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                >
                                                    {showNewPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => saveNewPwd(account.username)}
                                                disabled={loading || !newPwdValue || newPwdValue.length < 4}
                                                className="px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-40"
                                            >
                                                {loading ? '...' : 'Set'}
                                            </button>
                                            <button
                                                onClick={() => setResetPwdUser(null)}
                                                className="px-2 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-all text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5 px-4 pb-3.5">
                                    {!isEditingThisName && (
                                        <button
                                            onClick={() => startEditName(account)}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] font-semibold rounded-lg transition-all active:scale-95 border border-white/[0.06]"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            <span>កែឈ្មោះ / Edit Name</span>
                                        </button>
                                    )}
                                    {!isEditingThisName && (
                                        <button
                                            onClick={() => resetName(account)}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 text-[11px] font-semibold rounded-lg transition-all active:scale-95 border border-white/[0.06]"
                                            title="Reset name to default"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                        </button>
                                    )}
                                    <div className="flex-1" />
                                    {!isResettingPwd ? (
                                        <>
                                            <button
                                                onClick={() => startResetPwd(account)}
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-semibold rounded-lg transition-all active:scale-95 border border-amber-500/15"
                                            >
                                                <KeyRound className="w-3 h-3" />
                                                <span>កែកូដ / Set Password</span>
                                            </button>
                                            <button
                                                onClick={() => revertPwdToDefault(account)}
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/15 text-red-400 text-[11px] font-semibold rounded-lg transition-all active:scale-95 border border-red-500/15"
                                                title={`Reset to default: ${account.defaultPassword}`}
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                <span>Default</span>
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}

                    {/* Info Note */}
                    <div className="text-center text-[10px] text-slate-500 pt-2">
                        ⚠️ ការផ្លាស់ប្តូរមានប្រសិទ្ធភាពភ្លាមៗ / Changes take effect immediately
                    </div>
                </div>
            </div>
        </div>
    );
};
