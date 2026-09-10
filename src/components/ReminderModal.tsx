'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Bell, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';

export default function ReminderModal() {
  const { activeReminder, dismissReminder, updateMedicineStatus } = useApp();
  const { language, t } = useLanguage();

  if (!activeReminder) return null;

  const handleTake = () => {
    updateMedicineStatus(activeReminder.id, 'Taken');
    dismissReminder();
  };

  const handleSkip = () => {
    updateMedicineStatus(activeReminder.id, 'Skipped');
    dismissReminder();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      {/* Smartphone frame styling matching Mockup 14 */}
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700/60 relative overflow-hidden">
        {/* Dynamic Island / Notch */}
        <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4"></div>

        {/* Smartphone Screen Inner */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-950 rounded-[2rem] p-5 space-y-5 border border-slate-700/50">
          <div className="text-center space-y-1">
            <span className="text-4xl font-extralight tracking-tight text-white">
              {activeReminder.scheduledTime}
            </span>
            <p className="text-xs text-slate-400 font-medium">
              Today &bull; Scheduled Dose
            </p>
          </div>

          {/* Interactive Push Notification Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-blue-500 flex items-center justify-center text-white text-[10px]">
                  +
                </div>
                <span>MediCare AI</span>
              </div>
              <span className="text-[10px] text-slate-400">now</span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Time to take {activeReminder.name}
                <span className="text-xs">💊</span>
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'hi' && activeReminder.dosageInstructionHi
                  ? activeReminder.dosageInstructionHi
                  : activeReminder.dosageInstruction}
              </p>
            </div>
          </div>

          {/* Safety note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              If you have already taken this dose, or have questions about missed doses, check your physician&apos;s recommendations.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleTake}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('takeNow')}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={dismissReminder}
                className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Snooze</span>
              </button>
              <button
                onClick={handleSkip}
                className="py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('skipDose')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom home bar indicator */}
        <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-3"></div>
      </div>
    </div>
  );
}
