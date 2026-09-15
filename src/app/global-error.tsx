'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Catastrophic root layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/30">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white">
              Application Recovery Mode
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              MediExplain encountered a critical framework-level exception. You can recover immediately by reloading the system state.
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
