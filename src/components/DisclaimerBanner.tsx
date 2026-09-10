'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>{t('disclaimerTitle')}:</strong> {t('disclaimerText')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-blue-50 to-emerald-50 border border-amber-200/80 rounded-2xl p-4 shadow-sm text-slate-800 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
        aria-label="Dismiss disclaimer"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-1 text-sm pr-6">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <span>{t('disclaimerTitle')}</span>
            <span className="text-[11px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Non-Diagnostic Assistant
            </span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {t('disclaimerText')}
          </p>
          <p className="text-rose-700 text-xs font-medium pt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {t('emergencyCallout')}
          </p>
        </div>
      </div>
    </div>
  );
}
