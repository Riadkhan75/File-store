import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AdminAccount: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div id="admin-account-section" className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-amber-400"></i>
          <span>Admin Account & Documentation</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Authentication credentials, security role status, and operational guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Session Info */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400 text-xl font-bold">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Administrator</h3>
              <p className="text-xs text-neutral-400 truncate">{user?.email || 'Logged In'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Role Verification:</span>
              <span
                className={`font-bold ${
                  isAdmin ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isAdmin ? 'Master Administrator (Active)' : 'Standard User'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">Authentication Method:</span>
              <span className="text-white font-mono">Firebase Auth</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">User UID:</span>
              <span className="text-neutral-300 font-mono text-[11px] truncate max-w-[180px]">
                {user?.uid || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">Database Security:</span>
              <span className="text-emerald-400 font-semibold">
                Protected via firestore.rules
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-300 hover:text-red-100 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Terminate Admin Session</span>
          </button>
        </div>

        {/* Security & Access Documentation */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-key text-amber-400"></i>
            <span>How to Access Your Admin Portal</span>
          </h3>

          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Hidden Route
              </p>
              <p className="font-mono text-xs text-white">/adminriad</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                This route is intentionally hidden from the public homepage to keep your dashboard private.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Sole Master Admin Email
              </p>
              <p className="font-mono text-xs text-white">banglag215@gmail.com</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Sole master admin hard-coded in Firestore Security Rules. Grants full administrative control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
