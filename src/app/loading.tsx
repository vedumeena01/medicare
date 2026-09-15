import React from 'react';
import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 animate-pulse">
          <Activity className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-blue-400/20 animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
      </div>

      <div className="space-y-1.5 text-center">
        <p className="text-sm font-bold text-slate-800">
          Loading Health Command Center...
        </p>
        <p className="text-xs text-slate-400">
          Synchronizing clinical records and biometric markers
        </p>
      </div>

      {/* Skeleton Cards Preview */}
      <div className="max-w-md w-full space-y-3 pt-4 opacity-40 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-14 bg-slate-200 rounded-2xl" />
          <div className="h-14 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
