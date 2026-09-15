'use client';

import React from 'react';
import { RiskAnalysisItem } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, Activity, ShieldAlert, CheckCircle } from 'lucide-react';

export default function HealthRiskCard({ items }: { items: RiskAnalysisItem[] }) {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{t('healthRiskAnalysis')}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {t('healthRiskSubtitle')}
          </p>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
          {t('informationalOnly')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(item => {
          const isHigh = item.riskPercentage > 70;
          const isModerate = item.riskPercentage > 40 && item.riskPercentage <= 70;
          const strokeColor = isHigh ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
          const bgBadge = isHigh
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : isModerate
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200';

          const circumference = 2 * Math.PI * 34;
          const strokeDashoffset = circumference - (item.riskPercentage / 100) * circumference;

          return (
            <div
              key={item.name}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-2 hover:bg-slate-50 transition-colors"
            >
              {/* Circular Meter */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={strokeColor}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-slate-800">
                    {item.riskPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-800">
                  {language === 'hi' && item.nameHi ? item.nameHi : item.name}
                </h4>
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 mt-1 rounded-full border ${bgBadge}`}
                >
                  {language === 'hi' && item.riskLevelHi ? item.riskLevelHi : item.riskLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          {t('riskCardDisclaimer')}
        </span>
      </div>
    </div>
  );
}
