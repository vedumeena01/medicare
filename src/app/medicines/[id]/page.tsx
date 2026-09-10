'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Pill,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Info,
  ShieldCheck,
  HelpCircle,
  Building,
  Bell
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function MedicineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { medicines, updateMedicineStatus, triggerDemoReminder } = useApp();
  const { language, t } = useLanguage();

  const medicine = medicines.find(m => m.id === id);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="p-12 text-center space-y-3">
          <p className="text-sm text-slate-500">Medicine record not found.</p>
          <Link href="/medicines" className="text-blue-600 font-bold text-xs">
            &larr; Back to Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 overflow-x-hidden">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <Link
                href="/medicines"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Medicines</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-600" />
                <span>{medicine.name}</span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {medicine.strength}
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                {medicine.form} &bull; Manufacturer: {medicine.manufacturer || 'Licensed Pharmaceutical Laboratory'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/schedules"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>View Schedule</span>
              </Link>
            </div>
          </div>

          <DisclaimerBanner />

          {/* Prescribed Schedule Card */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-blue-950">Your Prescribed Schedule:</span>
                <p className="text-slate-600 mt-0.5">
                  {language === 'hi' && medicine.dosageInstructionHi
                    ? medicine.dosageInstructionHi
                    : medicine.dosageInstruction}{' '}
                  &bull; {medicine.scheduledTime} ({medicine.timeSlot})
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerDemoReminder(medicine)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 text-xs shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'दवा अलार्म टेस्ट करें' : 'Test Dose Alarm'}</span>
            </button>
          </div>

          {/* Section 28 Content Blocks */}
          <div className="space-y-4">
            {/* What is this medicine? */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>{t('whatIsThisMedicine')}</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' && medicine.descriptionHi
                  ? medicine.descriptionHi
                  : medicine.description}
              </p>
            </div>

            {/* Common Uses */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('commonUses')}</span>
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {(language === 'hi' && medicine.commonUsesHi
                  ? medicine.commonUsesHi
                  : medicine.commonUses
                ).map((useItem, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{useItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Precautions */}
            <div className="bg-white rounded-2xl border border-amber-200/80 bg-amber-50/20 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{t('importantPrecautions')}</span>
              </h2>
              <ul className="space-y-2 text-xs text-slate-700">
                {(language === 'hi' && medicine.precautionsHi
                  ? medicine.precautionsHi
                  : medicine.precautions
                ).map((prec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{prec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible Side Effects */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>{t('possibleSideEffects')}</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Most individuals tolerate this medication with no severe adverse effects. Inform your doctor if you experience any of the following:
              </p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs text-slate-700">
                {(language === 'hi' && medicine.sideEffectsHi
                  ? medicine.sideEffectsHi
                  : medicine.sideEffects
                ).map((side, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {side}
                  </div>
                ))}
              </div>
            </div>

            {/* When to Seek Medical Help */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-xs space-y-2">
              <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t('whenToSeekMedicalHelp')}</span>
              </h2>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {language === 'hi' && medicine.whenToSeekHelpHi
                  ? medicine.whenToSeekHelpHi
                  : medicine.whenToSeekHelp}
              </p>
              <p className="text-[11px] text-rose-700 pt-1 font-semibold">
                Important Safety Instruction: Never stop or alter prescription medicines without the direct consultation and approval of your licensed physician.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
