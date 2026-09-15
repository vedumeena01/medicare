'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, ArrowLeft, Pill, Sparkles, ShieldAlert, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import LiveCameraScanner from '@/components/LiveCameraScanner';
import { useLanguage } from '@/context/LanguageContext';

export default function DedicatedScannerPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 overflow-x-hidden">
          {/* Top Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <Link
                href="/medicines"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'दवाओं की सूची पर वापस जाएं' : 'Back to Medicines Hub'}</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-600" />
                <span>{t('liveScannerTitle')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                {t('liveScannerSubtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/medicines/interactions"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-teal-600" />
                <span>Interactions</span>
              </Link>

              <Link
                href="/schedules"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Schedule &rarr;</span>
              </Link>
            </div>
          </div>

          <DisclaimerBanner compact />

          {/* Live AR Camera Scanner Engine */}
          <LiveCameraScanner standalone={true} />
        </main>
      </div>
    </div>
  );
}
