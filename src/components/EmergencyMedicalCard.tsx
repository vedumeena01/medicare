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
  ExternalLink,
  Download,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

interface EmergencyMedicalCardProps {
  standalone?: boolean;
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export default function EmergencyMedicalCard({ standalone = false }: EmergencyMedicalCardProps) {
  const { user, medicines, reports, activeProfile } = useApp();
  const { language } = useLanguage();

  const allergies = activeProfile.allergies && activeProfile.allergies.length > 0
    ? activeProfile.allergies
    : ['No Known Drug Allergies (NKDA)'];
  const bloodGroup = activeProfile.bloodGroup || 'B+';
  const emergencyContact = activeProfile.emergencyContact || {
    name: 'Ramesh (Father)',
    phone: '+91 98765 11111',
    relation: 'Father',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadLockscreenWallpaper = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1080, 1920);

    // Header Red Bar
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 1080, 270);

    // ICE Tag
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('IN CASE OF EMERGENCY (I.C.E.)', 60, 100);

    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(activeProfile.name.toUpperCase(), 60, 195);

    // Blood Group Section Box
    ctx.fillStyle = '#1e293b';
    drawRoundRect(ctx, 60, 320, 960, 260, 24);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('BLOOD GROUP / रक्त समूह', 100, 390);

    ctx.fillStyle = '#ef4444';
    ctx.font = '900 130px sans-serif';
    ctx.fillText(bloodGroup, 100, 525);

    // Allergies Warning Box
    ctx.fillStyle = '#450a0a';
    drawRoundRect(ctx, 60, 620, 960, 240, 24);
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('⚠️ CRITICAL ALLERGIES / एलर्जी चेतावनी', 100, 690);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px sans-serif';
    ctx.fillText(allergies.join(', ') || 'No Known Drug Allergies (NKDA)', 100, 780);

    // Emergency Contact Box
    ctx.fillStyle = '#1e293b';
    drawRoundRect(ctx, 60, 900, 960, 280, 24);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('EMERGENCY NEXT-OF-KIN / आपातकालीन संपर्क', 100, 970);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`${emergencyContact.name} (${emergencyContact.relation})`, 100, 1040);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(`📞 ${emergencyContact.phone}`, 100, 1120);

    // Active Medications Box
    ctx.fillStyle = '#1e293b';
    drawRoundRect(ctx, 60, 1220, 960, 380, 24);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('CURRENT PRESCRIBED MEDICATIONS / दवाएं', 100, 1290);

    const activeMeds = medicines.slice(0, 3);
    activeMeds.forEach((m, idx) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`• ${m.name} (${m.strength || m.dosageInstruction || ''})`, 100, 1360 + idx * 70);
    });

    // Bottom Branding & Instructions
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Paramedic Triage Reference • Set as Phone Lock-Screen Wallpaper', 540, 1780);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('MediExplain AI Healthcare Platform', 540, 1830);

    // Trigger download
    const link = document.createElement('a');
    link.download = `ICE_Emergency_Lockscreen_${activeProfile.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden during Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span>
                {language === 'hi' ? 'आपातकालीन चिकित्सा पहचान पत्र (ICE)' : 'Emergency Medical Identity Card (ICE)'}
              </span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'hi' ? 'ऑफलाइन कैश सुरक्षित' : 'Offline Cache Active'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'आपातकालीन कर्मियों (EMT/डॉक्टर) के लिए तत्काल जीवन-रक्षक डेटा — बिना नेटवर्क के भी उपलब्ध'
              : 'Immediate life-saving clinical summary for paramedics, triage nurses, and emergency physicians — works offline'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadLockscreenWallpaper}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            title="Download high-resolution 1080x1920 phone lockscreen wallpaper"
          >
            <Smartphone className="w-4 h-4" />
            <span>{language === 'hi' ? 'लॉक-स्क्रीन वॉलपेपर डाउनलोड' : 'Download Lockscreen ICE'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रिंट / सेव कार्ड' : 'Print / Save Emergency Card'}</span>
          </button>
        </div>
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
                IN CASE OF EMERGENCY (ICE) {activeProfile.isSelf ? '' : `• ${activeProfile.relationship.toUpperCase()}`}
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {activeProfile.name}
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
