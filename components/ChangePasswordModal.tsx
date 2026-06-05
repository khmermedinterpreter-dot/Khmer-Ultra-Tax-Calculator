import React, { useState } from 'react';
import { Shield, Eye, EyeOff, X, AlertCircle, CheckCircle, RefreshCw, Pencil, Check } from 'lucide-react';
import {
    hashPassword,
    getStoredPasswordHash,
    setStoredPasswordHash,
    clearStoredPasswordHash,
    getAccounts,
    getDisplayName,
    setDisplayName,
    clearDisplayName,
    setSession,
} from '../authUtils';

interface ChangePasswordModalProps {
    onClose: (nameChanged?: boolean) => void;
    currentUser: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, currentUser }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Display name editing
    const [displayName, setDisplayNameState] = useState(() => getDisplayName(currentUser));
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameChanged, setNameChanged] = useState(false);

    // Look up the display info for the current user
    const account = getAccounts().find(a => a.username === currentUser);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('សូមបំពេញព័ត៌មានគ្រប់ប្រឡោះទិន្នន័យ។ / Please fill all password fields.');
            return;
        }

        if (newPassword.length < 4) {
            setError('លេខកូដសម្ងាត់ថ្មីត្រូវមានប្រវែងយ៉ាងតិច ៤ តួអក្សរ។ / New password must be at least 4 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('លេខកូដសម្ងាត់ថ្មីមិនដូចគ្នាទេ! / New passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            const enteredCurrentHash = await hashPassword(currentPassword);
            const targetHash = await getStoredPasswordHash(currentUser);

            if (enteredCurrentHash !== targetHash) {
                setError('លេខកូដសម្ងាត់ចាស់មិនត្រឹមត្រូវទេ! / Current password is incorrect!');
                setLoading(false);
                return;
            }

            // Save new password hash for this user
            const hashedNew = await hashPassword(newPassword);
            setStoredPasswordHash(currentUser, hashedNew);
            
            // Update session tokens so the user doesn't get locked out
            // Store in both localStorage and sessionStorage to cover all cases
            setSession(currentUser, hashedNew, true);
            
            // Clean inputs
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            setSuccess('លេខកូដសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ! / Password changed successfully!');
        } catch {
            setError('មានបញ្ហាក្នុងការរក្សាទុកលេខកូដសម្ងាត់។ / Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRevertToDefault = async () => {
        const defaultPwd = account?.defaultPassword || 'admin123';
        if (!window.confirm(`តើអ្នកប្រាកដជាចង់កំណត់លេខកូដសម្ងាត់ឡើងវិញទៅជាលំនាំដើម (${defaultPwd}) ដែរឬទេ? \nAre you sure you want to revert password for "${currentUser}" to default?`)) {
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            clearStoredPasswordHash(currentUser);
            clearDisplayName(currentUser);
            setDisplayNameState(account?.displayName || currentUser);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setNameChanged(true);
            setSuccess(`បានកំណត់ទៅលំនាំដើមជោគជ័យ! / Reverted to defaults (password: ${defaultPwd}) successfully!`);
        } catch {
            setError('មានបញ្ហាក្នុងការកំណត់ឡើងវិញ។ / Revert operation failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4 animate-fade-in">
            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden relative">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold text-white text-base font-sans tracking-wide">គណនី និង សុវត្ថិភាព / Account Settings</span>
                    </div>
                    <button 
                        onClick={() => onClose(nameChanged)}
                        className="text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-all"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {/* ── Display Name Section ── */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            ឈ្មោះបង្ហាញ / Display Name
                        </label>
                        <div className="flex items-center gap-2">
                            {isEditingName ? (
                                <>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayNameState(e.target.value)}
                                        placeholder="Enter display name..."
                                        className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-blue-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans text-sm"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (displayName.trim()) {
                                                    setDisplayName(currentUser, displayName.trim());
                                                    setIsEditingName(false);
                                                    setNameChanged(true);
                                                    setSuccess('ឈ្មោះបង្ហាញត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ! / Display name updated!');
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (displayName.trim()) {
                                                setDisplayName(currentUser, displayName.trim());
                                                setIsEditingName(false);
                                                setNameChanged(true);
                                                setSuccess('ឈ្មោះបង្ហាញត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ! / Display name updated!');
                                            }
                                        }}
                                        className="p-2.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20 rounded-xl transition-all active:scale-95"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl">
                                        <span className="text-lg">{account?.avatar}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate font-sans">{displayName}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{currentUser} • {account?.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingName(true)}
                                        className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-xl transition-all active:scale-95"
                                        title="Edit display name"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-sans">Password</span>
                        <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    {/* Status Alerts */}
                    {error && (
                        <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-start gap-2.5 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                លេខកូដសម្ងាត់បច្ចុប្បន្ន / Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    {showCurrent ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                លេខកូដសម្ងាត់ថ្មី / New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    {showNew ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                ផ្ទៀងផ្ទាត់លេខកូដថ្មី / Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                            className="w-full py-3.5 px-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការផ្លាស់ប្តូរ / Save Changes'}
                        </button>
                    </form>

                    {/* Separator */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-sans">Or Revert</span>
                        <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    {/* Revert Button */}
                    <button
                        type="button"
                        onClick={handleRevertToDefault}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                    >
                        <RefreshCw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                        <span>កំណត់ឡើងវិញជាលំនាំដើម / Revert to Default</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
