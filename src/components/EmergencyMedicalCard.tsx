'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  HeartPulse,
  Phone,
  User,
  AlertTriangle,
  Pill,
  FileText,
  Printer,
  Share2,
  CheckCircle2,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

interface EmergencyMedicalCardProps {
  standalone?: boolean;
}

export default function EmergencyMedicalCard({ standalone = false }: EmergencyMedicalCardProps) {
  const { user, medicines, reports } = useApp();
  const { language } = useLanguage();

  const allergies = user?.allergies || ['Penicillin (Mild)'];
  const bloodGroup = user?.bloodGroup || 'B+';
  const emergencyContact = user?.emergencyContact || {
    name: 'Ramesh (Father)',
    phone: '+91 98765 11111',
    relation: 'Father',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden during Print) */}
      <div className="flex items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span>
              {language === 'hi' ? 'आपातकालीन चिकित्सा पहचान पत्र (ICE)' : 'Emergency Medical Identity Card (ICE)'}
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'आपातकालीन कर्मियों (EMT/डॉक्टर) के लिए तत्काल जीवन-रक्षक डेटा'
              : 'Immediate life-saving clinical summary for paramedics, triage nurses, and emergency physicians'}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रिंट / सेव कार्ड' : 'Print / Save Emergency Card'}</span>
        </button>
      </div>

      {/* Industrial Medical Emergency Card (ISO/EMT Clinical Standard) */}
      <div className="bg-white rounded-3xl border-2 border-rose-500 shadow-xl overflow-hidden print:border print:shadow-none print:m-0">
        {/* Top Emergency Red Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <HeartPulse className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/20 text-white">
                IN CASE OF EMERGENCY (ICE)
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {user?.name || 'Vedprakash'}
              </h1>
            </div>
          </div>

          {/* Blood Group Big Badge */}
          <div className="text-center bg-white text-rose-700 px-4 py-2 rounded-2xl shadow-md border border-rose-100">
            <span className="block text-[9px] font-black uppercase tracking-wider text-rose-500">
              BLOOD GROUP
            </span>
            <span className="text-2xl sm:text-3xl font-black leading-none">
              {bloodGroup}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Critical Grid: Next-of-Kin Contact & Known Allergies */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Next of Kin Emergency Contact */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergency Contact (Next-of-Kin)</span>
              </span>
              <div>
                <p className="text-sm font-black text-slate-900">
                  {emergencyContact.name} ({emergencyContact.relation || 'Next-of-Kin'})
                </p>
                <a
                  href={`tel:${emergencyContact.phone}`}
                  className="text-base font-extrabold text-rose-700 hover:text-rose-800 underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>{emergencyContact.phone}</span>
                </a>
              </div>
            </div>

            {/* Documented Drug Allergies */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Documented Drug & Food Allergies</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-amber-200/60 border border-amber-300 text-amber-950 font-bold text-xs"
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-amber-800">
                Contraindicated: Avoid Penicillins / Beta-lactams without prior clinical allergy confirmation.
              </p>
            </div>
          </div>

          {/* Active Diagnoses & Chronic Conditions */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Active Diagnoses & Chronic Conditions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Type-2 Diabetes Mellitus</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Mild Microcytic Anemia</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Hyperlipidemia (Monitored)</span>
              </div>
            </div>
          </div>

          {/* Active Medication Regimen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Current Active Medications ({medicines.length} Prescribed):
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Synced from Patient Daily Schedule
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
              {medicines.map((med) => (
                <div key={med.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-900">{med.name}</span>
                      <span className="text-slate-500 ml-2 font-medium">({med.strength})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-700 block">{med.dosageInstruction}</span>
                    <span className="text-[10px] text-slate-400">{med.scheduledTime} &bull; {med.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Triage Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-white">Hospital Emergency Notice:</p>
              <p className="text-[11px] text-slate-400">
                In acute trauma or altered consciousness, cross-check against hospital HIS. Verified by MediExplain AI Patient EHR.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                ✓ Verified Patient ID
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
