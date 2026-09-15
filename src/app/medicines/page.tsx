'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Pill,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Search,
  Eye,
  Trash2,
  FileCheck2,
  Upload,
  Maximize2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import LiveCameraScanner from '@/components/LiveCameraScanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Medicine } from '@/types';

export default function MedicinesPage() {
  const { medicines, addMedicine, deleteMedicine } = useApp();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = medicines.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-600" />
                <span>{t('navMedicines')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Scan medicine blister strips, boxes, or prescriptions to identify drug information and set reminders
              </p>
            </div>

            <Link
              href="/schedules"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <span>{t('medicineSchedule')} &rarr;</span>
            </Link>
          </div>

          <DisclaimerBanner compact />

          {/* AI Drug Interaction Banner */}
          <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0">
                <ShieldAlert className="w-6 h-6 text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {language === 'hi' ? 'AI दवा टकराव व सुरक्षा विश्लेषक' : 'AI Drug-Drug Interaction & Safety Checker'}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-teal-100">
                    New
                  </span>
                </div>
                <p className="text-xs text-teal-100/90 mt-0.5 max-w-xl">
                  {language === 'hi'
                    ? 'क्या आपकी वर्तमान दवाएं (Dolo, Augmentin, Pantoprazole) एक साथ लेना सुरक्षित है? एलर्जी और भोजन के नियमों की जांच करें।'
                    : 'Cross-analyze your active prescriptions for drug-drug clashes, food/dairy timing rules, and allergy cross-reactions.'}
                </p>
              </div>
            </div>
            <Link
              href="/medicines/interactions"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'hi' ? 'दवाओं का टकराव जांचें' : 'Check Drug Interactions'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Live AR Camera Scanner Engine */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span>{t('liveScannerTitle')}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {t('liveScannerSubtitle')}
                </p>
              </div>

              <Link
                href="/medicines/scanner"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all self-start sm:self-auto"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Fullscreen Scanner</span>
              </Link>
            </div>

            <LiveCameraScanner />
          </div>

          {/* Active Medicines List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span>My Prescribed Medicines ({medicines.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed drug knowledge, precautions, and schedules
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search medicines..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">{t('noMedicinesAdded')}</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {t('addMedicinePrompt')}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMedicines.map(med => (
                  <div
                    key={med.id}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                          <span className="text-xs text-slate-500">
                            {med.strength} &bull; {med.form}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                          {med.frequency}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {language === 'hi' && med.descriptionHi ? med.descriptionHi : med.description}
                      </p>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                        <strong>Timing:</strong> {med.scheduledTime} ({med.timeSlot})
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <Link
                        href={`/medicines/${med.id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('medicineDetails')}</span>
                      </Link>

                      <button
                        onClick={() => deleteMedicine(med.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
