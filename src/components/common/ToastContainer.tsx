import React from 'react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-neutral-900/95 border-amber-400/50 text-white shadow-amber-500/10'
                : isError
                ? 'bg-red-950/95 border-red-500/50 text-red-100 shadow-red-500/10'
                : isWarning
                ? 'bg-amber-950/95 border-amber-500/50 text-amber-100'
                : 'bg-neutral-900/95 border-neutral-700 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  isSuccess
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : isError
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-neutral-800 text-neutral-300'
                }`}
              >
                {isSuccess && <i className="fa-solid fa-check"></i>}
                {isError && <i className="fa-solid fa-triangle-exclamation"></i>}
                {isWarning && <i className="fa-solid fa-circle-exclamation"></i>}
                {toast.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
              </span>
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};
