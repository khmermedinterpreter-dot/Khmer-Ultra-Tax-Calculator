import React, { useState } from 'react';
import { Shield, Eye, EyeOff, X, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ChangePasswordModalProps {
    onClose: () => void;
}

// Pure JavaScript SHA-256 implementation fallback for non-secure HTTP contexts
const sha256Fallback = (str: string): string => {
    str = unescape(encodeURIComponent(str));
    const chrsz = 8;
    const hexcase = 0;

    const safe_add = (x: number, y: number): number => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    const S = (X: number, n: number): number => {
        return (X >>> n) | (X << (32 - n));
    };

    const R = (X: number, n: number): number => {
        return X >>> n;
    };

    const Ch = (x: number, y: number, z: number): number => {
        return (x & y) ^ (~x & z);
    };

    const Maj = (x: number, y: number, z: number): number => {
        return (x & y) ^ (x & z) ^ (y & z);
    };

    const Sigma0256 = (x: number): number => {
        return S(x, 2) ^ S(x, 13) ^ S(x, 22);
    };

    const Sigma1256 = (x: number): number => {
        return S(x, 6) ^ S(x, 11) ^ S(x, 25);
    };

    const gamma0256 = (x: number): number => {
        return S(x, 7) ^ S(x, 18) ^ R(x, 3);
    };

    const gamma1256 = (x: number): number => {
        return S(x, 17) ^ S(x, 19) ^ R(x, 10);
    };

    const core_sha256 = (m: number[], l: number): number[] => {
        const K = [
            0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
            0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
            0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
            0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
            0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
            0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
        ];
        const HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
        const W = new Array(64);
        let a, b, c, d, e, f, g, h, i, j;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[i + j];
                else W[j] = safe_add(safe_add(safe_add(gamma1256(W[j - 2]), W[j - 7]), gamma0256(W[j - 15])), W[j - 16]);

                const T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                const T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    };

    const str2binb = (inputStr: string): number[] => {
        const bin = [];
        const mask = (1 << chrsz) - 1;
        for (let i = 0; i < inputStr.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (inputStr.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        }
        return bin;
    };

    const binb2hex = (binarray: number[]): string => {
        const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        let outStr = "";
        for (let i = 0; i < binarray.length * 4; i++) {
            outStr += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return outStr;
    };

    return binb2hex(core_sha256(str2binb(str), str.length * chrsz));
};

const hashPassword = async (password: string): Promise<string> => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch {
            // fallback
        }
    }
    return sha256Fallback(password);
};

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

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
            
            // Fetch current password hash
            const envPassword = import.meta.env.VITE_APP_PASSWORD || 'admin123';
            const customHash = localStorage.getItem('utc_custom_password_hash');
            const targetHash = customHash || await hashPassword(envPassword);

            if (enteredCurrentHash !== targetHash) {
                setError('លេខកូដសម្ងាត់ចាស់មិនត្រឹមត្រូវទេ! / Current password is incorrect!');
                setLoading(false);
                return;
            }

            // Save new password hash
            const hashedNew = await hashPassword(newPassword);
            localStorage.setItem('utc_custom_password_hash', hashedNew);
            
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
        if (!window.confirm('តើអ្នកប្រាកដជាចង់កំណត់លេខកូដសម្ងាត់ឡើងវិញទៅជាលំនាំដើម (admin123) ដែរឬទេ? \nAre you sure you want to revert your password to default?')) {
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            localStorage.removeItem('utc_custom_password_hash');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess('បានកំណត់ទៅលេខកូដសម្ងាត់លំនាំដើម (admin123) ជោគជ័យ! / Reverted to default password (admin123) successfully!');
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
                        <span className="font-bold text-white text-base font-sans tracking-wide">កែប្រែលេខកូដសម្ងាត់ / Change Password</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-all"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
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
