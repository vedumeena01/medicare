'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Pill,
  Sparkles,
  Plus,
  X,
  ArrowRight,
  RefreshCw,
  Utensils,
  HelpCircle,
  Stethoscope,
  Copy,
  Check,
  FileText,
  Clock,
  AlertOctagon,
  ChevronRight,
  Info
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { DrugInteractionAnalysisResult, DrugInteractionSeverity } from '@/types';

export default function DrugInteractionsPage() {
  const { medicines, user } = useApp();
  const { t, language } = useLanguage();

  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [newDrugInput, setNewDrugInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DrugInteractionAnalysisResult | null>(null);
  const [copiedQuestionId, setCopiedQuestionId] = useState<number | null>(null);

  // Initialize with user active medicines & allergies on load
  useEffect(() => {
    if (medicines && medicines.length > 0 && selectedDrugs.length === 0) {
      const activeNames = medicines.slice(0, 4).map(m => `${m.name} ${m.strength}`.trim());
      setSelectedDrugs(activeNames);
    }
    if (user?.allergies && user.allergies.length > 0 && allergies.length === 0) {
      setAllergies(user.allergies);
    } else if (allergies.length === 0) {
      setAllergies(['Penicillin (Mild)']);
    }
  }, [medicines, user]);

  const handleAddDrug = (drugName: string) => {
    const trimmed = drugName.trim();
    if (trimmed && !selectedDrugs.includes(trimmed)) {
      setSelectedDrugs(prev => [...prev, trimmed]);
      setNewDrugInput('');
    }
  };

  const handleRemoveDrug = (drugName: string) => {
    setSelectedDrugs(prev => prev.filter(d => d !== drugName));
  };

  const handleAddAllergy = (allergyName: string) => {
    const trimmed = allergyName.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies(prev => [...prev, trimmed]);
      setNewAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergyName: string) => {
    setAllergies(prev => prev.filter(a => a !== allergyName));
  };

  const handleLoadPreset = (presetType: 'current' | 'duplicate_paracetamol' | 'allergy_clash' | 'blood_thinner') => {
    switch (presetType) {
      case 'current':
        setSelectedDrugs(['Dolo 650', 'Augmentin 625', 'Pantoprazole 40', 'Vitamin D3 60K']);
        setAllergies(['Penicillin (Mild)']);
        break;
      case 'duplicate_paracetamol':
        setSelectedDrugs(['Dolo 650 (Paracetamol)', 'Combiflam (Ibuprofen + Paracetamol)', 'Crocin Advance']);
        setAllergies([]);
        break;
      case 'allergy_clash':
        setSelectedDrugs(['Augmentin 625 (Amoxicillin)', 'Pantoprazole 40']);
        setAllergies(['Penicillin (Severe)']);
        break;
      case 'blood_thinner':
        setSelectedDrugs(['Warfarin 5mg', 'Aspirin 75mg', 'Combiflam (Ibuprofen)']);
        setAllergies([]);
        break;
    }
    setAnalysisResult(null);
  };

  const runInteractionCheck = async () => {
    if (selectedDrugs.length === 0) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugs: selectedDrugs,
          allergies,
          conditions: ['Mild Anemia', 'Fasting Blood Sugar 140 mg/dL'],
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setAnalysisResult(data.result);
      }
    } catch (err) {
      console.error('Error running interaction check:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityBadge = (severity: DrugInteractionSeverity) => {
    switch (severity) {
      case 'severe':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertOctagon className="w-3.5 h-3.5" />
            {language === 'hi' ? 'गंभीर जोखिम (Severe)' : 'Severe Contraindication'}
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            {language === 'hi' ? 'मध्यम जोखिम (Moderate)' : 'Moderate Caution'}
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5" />
            {language === 'hi' ? 'समय अंतराल आवश्यक (Timing Rule)' : 'Administration Spacing'}
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सुरक्षित संयोजन (Safe)' : 'Safe Synergy'}
          </span>
        );
    }
  };

  const copyDoctorQuestion = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedQuestionId(idx);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 p-6 lg:p-8 text-white shadow-xl shadow-teal-900/10 mb-6">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-teal-100 text-xs font-semibold mb-3 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>Google Gemini Pharmacological Safety AI</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">
                {language === 'hi'
                  ? 'AI दवा टकराव व एलर्जी विश्लेषक'
                  : 'AI Drug-Drug Interaction & Allergy Checker'}
              </h1>
              <p className="text-teal-100/90 text-sm lg:text-base leading-relaxed">
                {language === 'hi'
                  ? 'अपनी सभी दवाओं को एक साथ जांचें। जानें कि क्या दो दवाएं एक साथ लेना सुरक्षित है, भोजन के साथ क्या नियम हैं, और एलर्जी का क्या खतरा हो सकता है।'
                  : 'Screen your active prescriptions for drug-drug conflicts, food and beverage contraindications, and cross-reactivity with personal allergies in seconds.'}
              </p>
            </div>

            {/* Background Decorative Circles */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-40 h-40 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />
          </div>

          <DisclaimerBanner />

          {/* Preset Clinical Scenarios */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'त्वरित टेस्ट सिनेरियो (1-क्लिक डेमो)' : '⚡ Quick Test Scenarios (1-Click Presets)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'विभिन्न नैदानिक स्थितियों की जांच के लिए तुरंत लोड करें' : 'Simulate different clinical safety situations with pre-built combos'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleLoadPreset('current')}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/60 dark:hover:bg-teal-900/40 text-left transition-all group"
              >
                <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-teal-900 dark:text-teal-300 group-hover:text-teal-700">
                    {language === 'hi' ? 'मेरी वर्तमान दवाएं' : 'My Current Regimen'}
                  </div>
                  <div className="text-[11px] text-teal-700/80 dark:text-teal-400/80 mt-0.5">
                    Dolo, Augmentin, Pantoprazole, D3
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset('duplicate_paracetamol')}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 text-left transition-all group"
              >
                <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-900 dark:text-rose-300 group-hover:text-rose-700">
                    {language === 'hi' ? 'पैरासिटामोल ओवरडोज' : 'Duplicate Toxicity'}
                  </div>
                  <div className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">
                    Dolo 650 + Combiflam (Liver alert)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset('allergy_clash')}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 text-left transition-all group"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 group-hover:text-amber-700">
                    {language === 'hi' ? 'पेनिसिलिन एलर्जी टकराव' : 'Allergy Contraindication'}
                  </div>
                  <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                    Augmentin + Penicillin Allergy
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset('blood_thinner')}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 text-left transition-all group"
              >
                <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-300 group-hover:text-purple-700">
                    {language === 'hi' ? 'ब्लड थिनर + पेनकिलर' : 'Blood Thinner + NSAID'}
                  </div>
                  <div className="text-[11px] text-purple-700/80 dark:text-purple-400/80 mt-0.5">
                    Warfarin + Aspirin + Ibuprofen
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Input Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Medications Column */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    {language === 'hi' ? 'चयनित दवाएं (कम से कम 2 जोड़ें)' : 'Active Medications to Screen'}
                  </label>
                  <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                    {selectedDrugs.length} {language === 'hi' ? 'दवाएं' : 'medicines'}
                  </span>
                </div>

                {/* Drug Input Bar */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newDrugInput}
                    onChange={e => setNewDrugInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDrug(newDrugInput);
                      }
                    }}
                    placeholder={
                      language === 'hi'
                        ? 'दवा का नाम लिखें (जैसे: Paracetamol, Aspirin, Metformin)'
                        : 'Type medication name (e.g., Paracetamol, Metformin, Thyroxine)...'
                    }
                    className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDrug(newDrugInput)}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'hi' ? 'जोड़ें' : 'Add'}
                  </button>
                </div>

                {/* Selected Drug Chips */}
                <div className="flex flex-wrap gap-2 min-h-[50px] p-3 bg-slate-50/60 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 mb-4">
                  {selectedDrugs.length === 0 ? (
                    <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2 py-1">
                      <Info className="w-3.5 h-3.5" />
                      {language === 'hi'
                        ? 'कोई दवा नहीं चुनी गई। ऊपर दवा का नाम लिखें या प्रीसेट चुनें।'
                        : 'No medications selected. Add names above or click a preset.'}
                    </div>
                  ) : (
                    selectedDrugs.map(drug => (
                      <span
                        key={drug}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm"
                      >
                        <Pill className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                        {drug}
                        <button
                          type="button"
                          onClick={() => handleRemoveDrug(drug)}
                          className="hover:text-rose-500 transition-colors ml-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={selectedDrugs.length === 0 || isAnalyzing}
                onClick={runInteractionCheck}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  selectedDrugs.length === 0 || isAnalyzing
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-600/20 active:scale-[0.99]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>
                      {language === 'hi'
                        ? 'AI सुरक्षा विश्लेषण चल रहा है...'
                        : 'Cross-Analyzing Medications with Gemini AI...'}
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {language === 'hi'
                        ? `${selectedDrugs.length} दवाओं के आपसी टकराव की जांच करें`
                        : `Run AI Interaction Check (${selectedDrugs.length} Drugs)`}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Allergies & Patient Profile Context */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    {language === 'hi' ? 'ज्ञात एलर्जी (Patient Allergies)' : 'Known Patient Allergies'}
                  </label>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {language === 'hi'
                    ? 'AI जांचेगा कि कोई दवा आपकी ज्ञात एलर्जी से प्रतिक्रिया तो नहीं करती।'
                    : 'Cross-matched against penicillin, sulfa, NSAIDs, etc.'}
                </p>

                {/* Allergy Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAllergyInput}
                    onChange={e => setNewAllergyInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAllergy(newAllergyInput);
                      }
                    }}
                    placeholder={language === 'hi' ? 'एलर्जी जोड़ें (जैसे Penicillin)' : 'Add allergy (e.g. Penicillin)...'}
                    className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAllergy(newAllergyInput)}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Allergy Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map(a => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      {a}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(a)}
                        className="hover:text-rose-900 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div>• Patient: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.name || 'Meenaritu953'}</span> (28 yrs, B+)</div>
                <div>• Clinical Vitals: <span className="font-semibold text-slate-700 dark:text-slate-300">Hb 10.8 g/dL, Fasting Sugar 140 mg/dL</span></div>
              </div>
            </div>
          </div>

          {/* Analysis Results View */}
          {analysisResult && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              {/* Top Overall Safety Score Card */}
              <div
                className={`rounded-3xl p-6 lg:p-8 border shadow-lg ${
                  analysisResult.overallRisk === 'High Risk'
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                    : analysisResult.overallRisk === 'Moderate Risk'
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3.5 rounded-2xl shrink-0 ${
                        analysisResult.overallRisk === 'High Risk'
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : analysisResult.overallRisk === 'Moderate Risk'
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      }`}
                    >
                      {analysisResult.overallRisk === 'High Risk' ? (
                        <AlertOctagon className="w-8 h-8" />
                      ) : analysisResult.overallRisk === 'Moderate Risk' ? (
                        <AlertTriangle className="w-8 h-8" />
                      ) : (
                        <ShieldCheck className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl lg:text-2xl font-black">
                          {language === 'hi' ? analysisResult.overallRiskHi : analysisResult.overallRisk}
                        </h2>
                        {analysisResult.isLiveAI && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                            Live Gemini
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                        {language === 'hi' ? analysisResult.summaryHi : analysisResult.summary}
                      </p>
                    </div>
                  </div>

                  {/* Safety Index Gauge */}
                  <div className="flex items-center gap-4 self-start md:self-auto bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {language === 'hi' ? 'सुरक्षा स्कोर' : 'Safety Score'}
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {analysisResult.overallScore}
                        <span className="text-xs font-medium text-slate-400">/100</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 relative flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            analysisResult.overallScore >= 80
                              ? 'text-emerald-500'
                              : analysisResult.overallScore >= 50
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }
                          strokeDasharray={`${analysisResult.overallScore}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold">{analysisResult.overallScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allergy Warning Box (if any alerts) */}
              {analysisResult.allergyAlerts && analysisResult.allergyAlerts.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-800 rounded-2xl p-6 shadow-md">
                  <div className="flex items-start gap-3.5">
                    <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-extrabold text-rose-950 dark:text-rose-200 mb-1">
                        {language === 'hi'
                          ? '⚠️ गंभीर एलर्जी चेतावनी (Patient Allergy Alert)'
                          : '⚠️ Severe Allergy Cross-Reaction Warning'}
                      </h3>
                      {analysisResult.allergyAlerts.map((alert, idx) => (
                        <div key={idx} className="mt-2 text-sm text-rose-900 dark:text-rose-300 leading-relaxed">
                          <p className="font-semibold">
                            {alert.drug} ⇄ {alert.matchedAllergy}
                          </p>
                          <p className="mt-0.5">{language === 'hi' ? alert.warningHi || alert.warning : alert.warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Drug-to-Drug Interaction Cards */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {language === 'hi' ? 'दवाओं के आपसी टकराव का विश्लेषण' : 'Pairwise Drug Interaction Analysis'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'hi'
                        ? 'विस्तृत फार्माकोलॉजिकल तंत्र और क्या लक्षण देखें'
                        : 'Clinical mechanism, action plan, and symptoms to monitor'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysisResult.interactions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {item.drug1}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">⇄</span>
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {item.drug2}
                          </span>
                        </div>
                        <div>{getSeverityBadge(item.severity)}</div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        {language === 'hi' ? item.titleHi || item.title : item.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {language === 'hi' ? 'कारण (Mechanism): ' : 'Mechanism: '}
                        </span>
                        {language === 'hi' ? item.mechanismHi || item.mechanism : item.mechanism}
                      </p>

                      <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 mb-3">
                        <div className="text-xs font-semibold text-teal-900 dark:text-teal-300 flex items-start gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                          <span>
                            {language === 'hi'
                              ? item.recommendationHi || item.recommendation
                              : item.recommendation}
                          </span>
                        </div>
                      </div>

                      {item.symptomsToWatch && item.symptomsToWatch.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {language === 'hi' ? 'सावधानी के लक्षण: ' : 'Watch for: '}
                          </span>
                          {(language === 'hi' && item.symptomsToWatchHi ? item.symptomsToWatchHi : item.symptomsToWatch).map(
                            (sym, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                              >
                                {sym}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Food & Beverage Timing Matrix */}
              {analysisResult.foodInteractions && analysisResult.foodInteractions.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      {language === 'hi'
                        ? 'भोजन व पेय पदार्थों के साथ नियम'
                        : 'Food & Beverage Contraindications & Timing'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'hi'
                        ? 'दवा के सर्वोत्तम प्रभाव के लिए खानपान के नियम'
                        : 'How dietary intake and beverages affect medicine absorption and metabolism'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.foodInteractions.map((food, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {food.drug}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
                              {language === 'hi' ? food.foodOrBeverageHi || food.foodOrBeverage : food.foodOrBeverage}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                            {language === 'hi' ? food.effectHi || food.effect : food.effect}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>
                            {language === 'hi' ? food.recommendationHi || food.recommendation : food.recommendation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions to Ask Doctor */}
              {analysisResult.questionsForDoctor && analysisResult.questionsForDoctor.length > 0 && (
                <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {language === 'hi' ? 'डॉक्टर या फार्मासिस्ट से पूछने योग्य सवाल' : 'Questions to Ask Your Doctor or Pharmacist'}
                      </h3>
                      <p className="text-xs text-teal-200/80">
                        {language === 'hi'
                          ? 'अपने अगले चेकअप में इन सवालों को पूछें'
                          : 'Bring these tailored clinical questions to your next appointment'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {(language === 'hi' && analysisResult.questionsForDoctorHi
                      ? analysisResult.questionsForDoctorHi
                      : analysisResult.questionsForDoctor
                    ).map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <span className="text-xs lg:text-sm font-medium text-slate-200 pr-3">{q}</span>
                        <button
                          type="button"
                          onClick={() => copyDoctorQuestion(q, idx)}
                          className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                        >
                          {copiedQuestionId === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{language === 'hi' ? 'कॉपी किया' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'कॉपी' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Doctor Appointment Navigation */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-teal-200/70">
                      {language === 'hi'
                        ? 'क्या आप विशेषज्ञ डॉक्टर से परामर्श लेना चाहते हैं?'
                        : 'Need clarification on drug conflicts from a verified specialist?'}
                    </span>
                    <Link
                      href="/appointments"
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'डॉक्टर अपॉइंटमेंट बुक करें' : 'Book Specialist Consultation'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
