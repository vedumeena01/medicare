'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  UploadCloud,
  FileText,
  Pill,
  CalendarCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Plus,
  Eye,
  ShieldCheck,
  Calendar,
  Stethoscope,
  Video,
  MapPin,
  Bot,
  Bell
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import HealthRiskCard from '@/components/HealthRiskCard';
import HealthTrendChart from '@/components/HealthTrendChart';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { user, reports, medicines, appointments, updateMedicineStatus, triggerDemoReminder } = useApp();
  const { t, language } = useLanguage();

  const primaryReport = reports[0];
  const pendingMedicines = medicines.filter(m => m.status === 'Upcoming');
  const takenMedicines = medicines.filter(m => m.status === 'Taken');
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 overflow-x-hidden">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>
                  {t('welcomeBack')}, {user?.name || 'Vedprakash'}
                </span>
                <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {t('dashboardSubtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>{language === 'hi' ? 'एआई सहायक से पूछें' : 'Ask AI Assistant'}</span>
              </Link>
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>{language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
              </Link>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('uploadReport')}</span>
              </Link>
            </div>
          </div>

          {/* Clean Patient Onboarding for New Users / Empty State */}
          {reports.length === 0 && (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    Get Started
                  </span>
                  <span className="text-xs font-semibold text-blue-100">Live Health Analytics Active</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  {language === 'hi' ? 'अपनी पहली मेडिकल रिपोर्ट अपलोड करें' : 'Upload Your First Medical Report'}
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  {language === 'hi'
                    ? 'अपनी ब्लड टेस्ट, लिपिड प्रोफाइल, या डॉक्टर का पर्चा अपलोड करें। हमारा एआई आपके टेस्ट परिणामों को तुरंत सरल हिंदी में समझाएगा और स्वास्थ्य ग्राफ तैयार करेगा।'
                    : 'Upload your lab test, blood work, or prescription PDF/image. MediExplain AI will instantly extract clinical parameters, evaluate organ risks, and explain everything in plain language.'}
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <Link
                  href="/analyze"
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white text-blue-900 font-black text-xs shadow-md hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{language === 'hi' ? 'रिपोर्ट अपलोड करें' : 'Upload Report Now'}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Medical Safety Disclaimer Alert */}
          <DisclaimerBanner compact />

          {/* Top Grid: Health Score & Risk Meters (Mockup 4) */}
          <div className="grid lg:grid-cols-12 gap-5">
            {/* Health Score Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('healthScore')}
                </span>
                {reports.length > 0 ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('goodStatus')}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                    Pending Data
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">
                  {reports.length > 0 ? (primaryReport?.overallScore || 84) : '--'}
                </span>
                <span className="text-base text-slate-400 font-semibold">/100</span>
              </div>

              {/* Mini sparkline indicator */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
                  style={{ width: reports.length > 0 ? `${primaryReport?.overallScore || 84}%` : '0%' }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {reports.length > 0
                  ? `Based on your latest ${primaryReport?.reportType || 'Complete Blood Count'} analysis.`
                  : 'Upload your first medical report to calculate your personalized Health Score.'}
              </p>
            </div>

            {/* Quick Statistics Bar */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900">{reports.length}</span>
                  <p className="text-[11px] font-medium text-slate-500">{t('totalReports')}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900">{reports.length}</span>
                  <p className="text-[11px] font-medium text-slate-500">{t('recentAnalyses')}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900">{medicines.length}</span>
                  <p className="text-[11px] font-medium text-slate-500">{t('activeMedicines')}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900">{pendingMedicines.length}</span>
                  <p className="text-[11px] font-medium text-slate-500">Upcoming Doses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Cards matching Mockup Screen 4 & Section 11 */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('quickActions')}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Medical Report */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Analyze Medical Report</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload blood tests, lab panels, or scans for simple plain-language breakdown.
                  </p>
                </div>
                <Link
                  href="/analyze?type=Blood%20Test"
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('uploadReport')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 2: Analyze Prescription */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-indigo-300 transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Analyze Prescription</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload handwritten or printed doctor prescriptions for clearer understanding.
                  </p>
                </div>
                <Link
                  href="/analyze?type=Prescription"
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('uploadPrescription')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 3: Medicine Information */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{t('scanYourMedicine')}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload medicine packaging or strip photos to identify uses and warnings.
                  </p>
                </div>
                <Link
                  href="/medicines"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('identifyMedicine')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 4: Medicine Schedule */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{t('medicineSchedule')}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Manage daily pill reminders, dosages, and track calendar intake history.
                  </p>
                </div>
                <Link
                  href="/schedules"
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('manageMedicines')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Health Risk Analysis Card Component */}
          {primaryReport?.riskAnalysis && primaryReport.riskAnalysis.length > 0 ? (
            <HealthRiskCard items={primaryReport.riskAnalysis} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {language === 'hi' ? 'स्वास्थ्य जोखिम विश्लेषण' : 'Health Risk Analysis'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi'
                      ? 'अपनी पहली जांच रिपोर्ट अपलोड करें जिससे हृदय, मधुमेह, गुर्दे व यकृत के जोखिम स्तर की गणना हो सके।'
                      : 'No diagnostic data yet. Upload a CBC or metabolic panel to calculate cardiovascular, diabetes, kidney, and liver risk levels.'}
                  </p>
                </div>
              </div>
              <Link
                href="/analyze"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0 transition flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{t('uploadReport')}</span>
              </Link>
            </div>
          )}

          {/* Interactive Trends & Today's Medicines 2-Column Split */}
          <div className="grid lg:grid-cols-12 gap-5">
            {/* Left: Health Trends */}
            <div className="lg:col-span-7">
              <HealthTrendChart />
            </div>

            {/* Right: Today's Medicines Schedule (Mockup 13) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <span>{t('todaysScheduleTitle')}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {medicines.length} {language === 'hi' ? 'दवाएं निर्धारित हैं' : 'medications configured'}
                  </p>
                </div>
                <Link
                  href="/schedules"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                {medicines.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 my-auto">
                    <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      {language === 'hi' ? 'कोई दवा निर्धारित नहीं है' : 'No medicines scheduled yet'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto">
                      {language === 'hi'
                        ? 'दवा अनुसूची में अपनी नियमित दवाएं जोड़ें या पर्चे को स्कैन करें।'
                        : 'Add daily medications or scan a prescription to receive automatic dosage reminders.'}
                    </p>
                    <Link
                      href="/medicines"
                      className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('addMedicine')}</span>
                    </Link>
                  </div>
                ) : (
                  medicines.slice(0, 4).map(med => {
                    const isTaken = med.status === 'Taken';
                    const isSkipped = med.status === 'Skipped';

                    return (
                      <div
                        key={med.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isTaken
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : isSkipped
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-slate-50/80 border-slate-200/80'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-xs font-bold ${
                                isTaken ? 'text-emerald-950 line-through' : 'text-slate-900'
                              }`}
                            >
                              {med.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {med.scheduledTime}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {language === 'hi' && med.dosageInstructionHi
                              ? med.dosageInstructionHi
                              : med.dosageInstruction}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isTaken ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Taken
                            </span>
                          ) : isSkipped ? (
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                              Skipped
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => updateMedicineStatus(med.id, 'Taken')}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                                title="Mark as Taken"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => updateMedicineStatus(med.id, 'Skipped')}
                                className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-semibold transition-colors"
                                title="Skip Dose"
                              >
                                Skip
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => triggerDemoReminder()}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Bell className="w-3 h-3" />
                  <span>{language === 'hi' ? 'दवा साउंड टेस्ट करें' : 'Test Dose Audio Chime'}</span>
                </button>
                <Link
                  href="/schedules"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600"
                >
                  Manage Timers &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Reports List (Mockup 4 & Section 13) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{t('recentReportsTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Quick access to all your recently analyzed diagnostic documents
                </p>
              </div>
              <Link
                href="/reports"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All ({reports.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {reports.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">
                  {language === 'hi' ? 'अभी तक कोई रिपोर्ट अपलोड नहीं है' : 'No Medical Reports Uploaded Yet'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'hi'
                    ? 'अपनी पहली रक्त जांच, सीबीसी या डॉक्टर का पर्चा अपलोड करें और एआई सरल भाषा विश्लेषण पाएं।'
                    : 'Upload your first blood test, health checkup, or prescription to unlock AI-powered plain language breakdowns.'}
                </p>
                <Link
                  href="/analyze"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पहली रिपोर्ट अपलोड करें' : 'Upload Your First Report'}</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map(rep => (
                  <div
                    key={rep.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rep.fileName}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                          <span>{rep.reportType}</span>
                          <span>&bull;</span>
                          <span>{rep.uploadedAt}</span>
                          <span>&bull;</span>
                          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.2 rounded-md">
                            {rep.findings.filter(f => f.status !== 'normal').length} items to review
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/reports/${rep.id}`}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('viewAnalysis')}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Doctor Appointments (Medicare Tree Section 6) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>{language === 'hi' ? 'आगामी डॉक्टर अपॉइंटमेंट्स' : 'Upcoming Doctor Appointments'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'अपनी जांच रिपोर्ट पर विशेषज्ञ राय हेतु निर्धारित परामर्श'
                    : 'Scheduled in-person and video consultations with verified physicians'}
                </p>
              </div>
              <Link
                href="/appointments"
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'सभी अपॉइंटमेंट्स' : 'View All'} ({upcomingAppointments.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-600">
                  {language === 'hi' ? 'कोई आगामी अपॉइंटमेंट निर्धारित नहीं है।' : 'No upcoming appointments scheduled.'}
                </p>
                <Link
                  href="/appointments"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                >
                  <span>{language === 'hi' ? 'डॉक्टर खोजें और स्लॉट बुक करें &rarr;' : 'Find a doctor & book slot &rarr;'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {upcomingAppointments.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-teal-100 bg-teal-50/40 hover:bg-teal-50/70 transition flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{apt.doctorName}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            apt.type === 'Video Call'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {apt.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-800 font-medium">{apt.doctorSpecialty}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-teal-600" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          {apt.timeSlot}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/appointments"
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                    >
                      {language === 'hi' ? 'विवरण' : 'Details'}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive AI Health Assistant Card */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                {language === 'hi' ? '24/7 एआई स्वास्थ्य सहायता' : 'Always Available Health Companion'}
              </span>
              <h3 className="text-xl font-bold">
                {language === 'hi' ? 'अपनी रिपोर्ट्स या लक्षणों पर कोई भी सवाल पूछें' : 'Have questions about your report or medications?'}
              </h3>
              <p className="text-xs text-purple-200 max-w-lg">
                {language === 'hi'
                  ? 'MediExplain AI आपकी जांच रिपोर्ट का विश्लेषण कर सरल भाषा में सुझाव और डॉक्टर से पूछने योग्य सवाल तैयार करता है।'
                  : 'Get plain-language explanations, verify safe dosages, and learn what questions to discuss at your next doctor visit.'}
              </p>
            </div>

            <Link
              href="/assistant"
              className="px-6 py-3 bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-2xl text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>{language === 'hi' ? 'चैट शुरू करें' : 'Start Health Conversation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
