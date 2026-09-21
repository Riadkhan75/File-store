import React, { useState } from 'react';
import { useAuth, isAuthorizedAdminEmail, ADMIN_EMAILS } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter both admin email and password.');
      return;
    }
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError(`Access denied: "${cleanEmail}" is not in the authorized administrator list.`);
      return;
    }
    setSubmitting(true);
    try {
      await loginWithEmail(cleanEmail, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed or was closed.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-4 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-neutral-900/95 border border-amber-400/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 text-2xl mb-3 shadow-inner">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Authorized Administrator Access
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-red-400 shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <button
            type="button"
            id="admin-google-signin-btn"
            onClick={handleGoogleAuth}
            disabled={googleSubmitting || submitting}
            className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-60 mb-5"
          >
            <i className="fa-brands fa-google text-amber-400 text-sm"></i>
            <span>{googleSubmitting ? 'Signing in with Google...' : 'Continue with Google (One-Click)'}</span>
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
              Or Sign In with Email
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Admin Email
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('banglag215@gmail.com');
                      setPassword('205090');
                    }}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer font-mono"
                  >
                    Quick Fill
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <i className="fa-solid fa-envelope text-xs"></i>
                </div>
                <input
                  id="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="banglag215@gmail.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-neutral-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Password / Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <i className="fa-solid fa-lock text-xs"></i>
                </div>
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-neutral-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              id="admin-signin-submit-btn"
              type="submit"
              disabled={submitting || googleSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {submitting ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          {/* Pre-configured Sole Admin Notice */}
          <div className="mt-5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 text-center">
            <span className="text-amber-400 font-semibold">Authorized Administrators:</span>
            <div className="font-mono text-neutral-300 text-xs mt-1 space-y-0.5">
              {ADMIN_EMAILS.map((ae) => (
                <div key={ae}>{ae}</div>
              ))}
            </div>
          </div>

          {/* Return link */}
          <div className="mt-6 text-center">
            <button
              id="back-to-store-btn"
              onClick={onBackToHome}
              className="text-xs text-neutral-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>Back to Public Store</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
