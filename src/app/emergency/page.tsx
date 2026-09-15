'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, ShieldAlert, PhoneCall } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import EmergencyMedicalCard from '@/components/EmergencyMedicalCard';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function EmergencyMedicalPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 overflow-x-hidden">
          {/* Top Back Nav & Quick Ambulance Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}</span>
            </Link>

            <div className="flex items-center gap-2">
              <a
                href="tel:112"
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Emergency Ambulance (112)</span>
              </a>
            </div>
          </div>

          <DisclaimerBanner compact />

          {/* Emergency Medical ID Card Component */}
          <EmergencyMedicalCard standalone={true} />
        </main>
      </div>
    </div>
  );
}
