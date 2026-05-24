import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LockScreenProps {
    onUnlock: () => void;
}

// Pure JavaScript SHA-256 implementation fallback for non-secure HTTP contexts
const sha256Fallback = (str: string): string => {
    // Convert string to UTF-8 byte representation to match crypto.subtle.digest exactly for multi-byte/Unicode characters
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

// SHA-256 helper with secure-context check
const hashPassword = async (password: string): Promise<string> => {
    // Check if window.crypto and window.crypto.subtle are available (HTTPS or localhost)
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch {
            // Fall back to pure JS hashing if subtle digest fails unexpectedly
        }
    }
    
    // Seamless fallback to pure JS implementation in non-secure HTTP contexts
    return sha256Fallback(password);
};

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get the configured password from environment or default to 'admin123'
    const envPassword = import.meta.env.VITE_APP_PASSWORD || 'admin123';

    // Auto-login on mount if "Remember this device" was checked before
    useEffect(() => {
        const verifySavedSession = async () => {
            const savedHash = localStorage.getItem('utc_session_token');
            const customHash = localStorage.getItem('utc_custom_password_hash');
            const targetHash = customHash || await hashPassword(envPassword);
            
            if (savedHash === targetHash) {
                onUnlock();
            }
        };
        verifySavedSession();
    }, [envPassword, onUnlock]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const enteredHash = await hashPassword(password);
            const customHash = localStorage.getItem('utc_custom_password_hash');
            const targetHash = customHash || await hashPassword(envPassword);

            if (enteredHash === targetHash) {
                // Store session token if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('utc_session_token', targetHash);
                } else {
                    // Otherwise store in sessionStorage for the duration of the browser tab session
                    sessionStorage.setItem('utc_session_token', targetHash);
                }
                
                // Unlock application
                onUnlock();
            } else {
                // Handle failure
                setError('កូដសម្ងាត់មិនត្រឹមត្រូវទេ! សូមព្យាយាមម្តងទៀត។');
                setIsShaking(true);
                setPassword('');
                setTimeout(() => setIsShaking(false), 500); // Reset shake state after animation completes
            }
        } catch {
            setError('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់កូដសម្ងាត់។');
        } finally {
            setLoading(false);
        }
    };

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
            `}</style>

            {/* Glowing Decorative Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[100px] pointer-events-none animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full filter blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '-3s' }}></div>

            {/* Main Lock Card Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 transition-transform duration-300 ${isShaking ? 'animate-shake border-red-500/50 shadow-red-500/10' : ''}`}>
                    
                    {/* Header with Pulsing Lock Icon */}
                    <div className="flex flex-col items-center text-center mb-8">
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

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert Box */}
                        {error && (
                            <div className="flex items-start gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

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
