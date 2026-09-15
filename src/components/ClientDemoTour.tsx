'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Layers,
  FileText,
  Camera,
  ShieldAlert,
  Clock,
  Calendar,
  Bot,
  UserCheck,
  Zap,
  Info,
  ExternalLink,
  Volume2,
  Share2,
  Users,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ClientDemoTour() {
  const { loadDemoData, resetToCleanState, triggerDemoReminder, reports, medicines } = useApp();
  const { language } = useLanguage();

  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<'diabetic' | 'caregiver' | 'surgical' | 'wellness'>('diabetic');
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleReloadDemo = async () => {
    setActionStatus(language === 'hi' ? 'डेमो डेटा लोड हो रहा है...' : 'Loading demo dataset...');
    await loadDemoData();
    setTimeout(() => {
      setActionStatus(language === 'hi' ? '✅ 4 रिपोर्ट्स, 5 दवाएं व अपॉइंटमेंट्स लोड हो गए!' : '✅ 4 clinical reports, 5 medicines & appointments loaded!');
      setTimeout(() => setActionStatus(null), 3500);
    }, 400);
  };

  const handleResetClean = async () => {
    if (confirm(language === 'hi' ? 'क्या आप नए उपयोगकर्ता अनुभव का परीक्षण करने के लिए डेटा साफ़ करना चाहते हैं?' : 'Reset to fresh empty state to test initial user onboarding?')) {
      setActionStatus(language === 'hi' ? 'डेटा साफ़ किया जा रहा है...' : 'Resetting data to clean slate...');
      await resetToCleanState();
      setTimeout(() => {
        setActionStatus(language === 'hi' ? '✅ डेटा साफ़ हो गया। नया डैशबोर्ड सक्रिय है।' : '✅ System reset to clean state. Ready for fresh uploads.');
        setTimeout(() => setActionStatus(null), 3500);
      }, 400);
    }
  };

  const handleTestAlarm = () => {
    triggerDemoReminder();
    setActionStatus(language === 'hi' ? '🔔 दवा रिमाइंडर अलार्म स्क्रीन पर सक्रिय!' : '🔔 Medicine reminder alarm triggered!');
    setTimeout(() => setActionStatus(null), 3500);
  };

  const personas = {
    diabetic: {
      title: language === 'hi' ? 'केस 1: डायबिटीज़ व FHIR वॉल्ट' : 'Case 1: Diabetes & FHIR Vault',
      subtitle: language === 'hi' ? 'उच्च शुगर (140 mg/dL) व HL7 R4 वॉल्ट निर्यात' : 'Glucose (140 mg/dL) & HL7 FHIR R4 Export',
      patient: language === 'hi' ? 'वेदप्रकाश (उम्र 58, टाइप-2 डायबिटीज़)' : 'Vedprakash (Age 58, Type-2 Diabetes)',
      recommendedPath: [
        { name: language === 'hi' ? 'सीबीसी व शुगर रिपोर्ट विश्लेषण' : 'CBC & Sugar Lab Breakdown', href: '/reports/rep-cbc-june-2026', icon: FileText, tag: 'Lab OCR' },
        { name: language === 'hi' ? 'HL7 FHIR R4 व CSV वॉल्ट डाउनलोड' : 'Export HL7 FHIR R4 Vault', href: '/settings', icon: Download, tag: 'Interoperability' },
      ],
    },
    caregiver: {
      title: language === 'hi' ? 'केस 2: केयरगिवर व डिपेंडेंट स्विच' : 'Case 2: Caregiver & Dependent Context',
      subtitle: language === 'hi' ? 'बुजुर्ग माता-पिता (सल्फा/एस्पिरिन एलर्जी) प्रबंधन' : 'Elderly Dependent Switching & ICE Sync',
      patient: language === 'hi' ? 'रमेश (पिता, उम्र 64, सल्फा एलर्जी)' : 'Ramesh (Father, Age 64, Sulfa Allergy)',
      recommendedPath: [
        { name: language === 'hi' ? 'डिपेंडेंट प्रोफाइल व फैमिली सेंटर' : 'Dependent Family Command Center', href: '/family', icon: Users, tag: 'Caregiver Hub' },
        { name: language === 'hi' ? 'ऑफ़लाइन इमरजेंसी कार्ड व वॉलपेपर' : 'Offline ICE Card & Wallpaper', href: '/emergency', icon: AlertTriangle, tag: 'Paramedic ICE' },
      ],
    },
    surgical: {
      title: language === 'hi' ? 'केस 3: दवा अनुपालन व व्हाट्सएप' : 'Case 3: Rx Adherence & WhatsApp',
      subtitle: language === 'hi' ? 'Augmentin + Dolo 650 व व्हाट्सएप रिमाइंडर' : 'Antibiotic Schedule & WhatsApp Alerts',
      patient: language === 'hi' ? 'प्रिया शर्मा (उम्र 34, ऑर्थोपेडिक रिकवरी)' : 'Priya Sharma (Age 34, Post-Op Recovery)',
      recommendedPath: [
        { name: language === 'hi' ? 'व्हाट्सएप व एसएमएस दवा रिमाइंडर' : 'WhatsApp & SMS Dose Reminders', href: '/schedules', icon: Share2, tag: 'Multi-Channel' },
        { name: language === 'hi' ? 'मल्टी-चैनल अलर्ट लॉग व सिम्युलेटर' : 'Multi-Channel Alert History', href: '/notifications', icon: Clock, tag: 'Audit Trail' },
      ],
    },
    wellness: {
      title: language === 'hi' ? 'केस 4: एआर स्कैनर व एलर्जी जांच' : 'Case 4: Live AR Scanner & Safety',
      subtitle: language === 'hi' ? 'कैमरा स्कैनर व दवा टकराव सुरक्षा' : 'Live Camera OCR & Drug Clash Screening',
      patient: language === 'hi' ? 'सुनीता मेहता (उम्र 46, वार्षिक स्वास्थ्य जांच)' : 'Sunita Mehta (Age 46, Annual Wellness)',
      recommendedPath: [
        { name: language === 'hi' ? 'लाइव एआर दवा कैमरा स्कैनर' : 'Live AR Camera Drug Scanner', href: '/medicines/scanner', icon: Camera, tag: 'Live AR' },
        { name: language === 'hi' ? 'दवा टकराव व एलर्जी जांच' : 'Drug-Drug Conflict & Allergy Check', href: '/medicines/interactions', icon: ShieldAlert, tag: 'Clinical Safety' },
      ],
    },
  };

  const activePersonaData = personas[selectedPersona];

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-500/30 shadow-xl relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  {language === 'hi' ? 'क्लाइंट डेमो सैंडबॉक्स' : 'Client Demo & Evaluator Sandbox'}
                </span>
                <span className="text-xs text-indigo-300/80 font-medium hidden sm:inline">
                  Guided 2-Minute Review Path
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                {language === 'hi' ? 'इंटरैक्टिव मूल्यांकनकर्ता टूर व क्लिनिकल केस चयन' : 'Interactive Client Tour & Clinical Persona Selector'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>{isExpanded ? (language === 'hi' ? 'छोटा करें' : 'Minimize') : (language === 'hi' ? 'विस्तार करें' : 'Expand')}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Action Status Toast */}
        {actionStatus && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionStatus}</span>
          </div>
        )}

        {isExpanded && (
          <>
            {/* Quick Sandbox Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Demo sandbox controls">
              <button
                type="button"
                onClick={handleReloadDemo}
                aria-label="Load complete demo pack with 4 reports, 5 medicines and appointments"
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
              >
                <Sparkles className="w-4 h-4 text-blue-200" aria-hidden="true" />
                <span>{language === 'hi' ? '⚡ डेमो डेटा पुनः लोड करें (4 रिपोर्ट्स)' : '⚡ Load Complete Demo Pack'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestAlarm}
                aria-label="Trigger interactive medication reminder alert sound and modal"
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-indigo-100 border border-white/15 font-bold text-xs transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
              >
                <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>{language === 'hi' ? '🔔 दवा अलार्म सिमुलेटर जांचें' : '🔔 Trigger Medication Dose Alert'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetClean}
                aria-label="Reset and wipe data to test clean slate onboarding"
                className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" aria-hidden="true" />
                <span>{language === 'hi' ? '🧹 नया उपयोगकर्ता सैंडबॉक्स (Wipe)' : '🧹 Wipe to Clean Slate'}</span>
              </button>
            </div>

            {/* Persona Selector Tabs */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {language === 'hi' ? 'परीक्षण के लिए केस चुनें:' : 'Select Evaluation Persona Case:'}
                </span>
                <span className="text-[11px] text-indigo-400/80">
                  {reports.length} Reports &bull; {medicines.length} Medicines Loaded
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {(Object.keys(personas) as Array<keyof typeof personas>).map((key) => {
                  const p = personas[key];
                  const isSelected = selectedPersona === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPersona(key)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-indigo-600/40 border-indigo-400 shadow-md ring-1 ring-indigo-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-white">{p.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-300" />}
                      </div>
                      <p className="text-[11px] text-indigo-200/80 line-clamp-1">{p.patient}</p>
                    </button>
                  );
                })}
              </div>

              {/* Recommended Flow for Selected Persona */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold uppercase text-indigo-400 tracking-wider">
                      {language === 'hi' ? 'अनुशंसित समीक्षा पथ' : 'Recommended 2-Click Walkthrough'}
                    </span>
                    <p className="text-xs text-white font-bold">{activePersonaData.subtitle}</p>
                  </div>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-md font-semibold border border-indigo-400/30">
                    {activePersonaData.patient}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {activePersonaData.recommendedPath.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        className="p-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-between text-white font-bold text-xs transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-white/10 text-indigo-200">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-white group-hover:text-indigo-200 transition-colors">
                              {item.name}
                            </span>
                            <span className="block text-[10px] text-indigo-300/80 font-normal">
                              Tag: {item.tag}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
