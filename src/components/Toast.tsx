import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border text-sm shadow-lg transition-all duration-200 ${
            toast.type === 'error'
              ? 'bg-zinc-900 border-red-500/30 text-red-200'
              : toast.type === 'success'
              ? 'bg-zinc-900 border-emerald-500/30 text-emerald-200'
              : 'bg-zinc-900 border-zinc-700 text-zinc-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>
          <button
            id={`btn-dismiss-toast-${toast.id}`}
            onClick={() => onDismiss(toast.id)}
            className="text-zinc-400 hover:text-zinc-100 p-0.5 rounded transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
