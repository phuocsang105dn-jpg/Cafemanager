import React from 'react';
import { useCafe } from '../context/CafeContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCafe();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg text-[14px] text-white transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            toast.type === 'error'
              ? 'bg-[#ba1a1a]'
              : toast.type === 'info'
              ? 'bg-[#5d2111]'
              : 'bg-[#311908]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span className="font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/80 hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
