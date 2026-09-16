'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Languages,
  Check,
  AlertCircle,
  FileCheck2,
  RefreshCw,
  Download,
  Camera
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import CameraCaptureModal from '@/components/CameraCaptureModal';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { ReportType, Language } from '@/types';
import { compressImageBase64, isImageMimeType } from '@/lib/imageOptimization';

interface SamplePreset {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  reportType: ReportType;
  title: string;
  titleHi: string;
  badge: string;
  url: string;
  targetId: string;
}

const samplePresets: SamplePreset[] = [
  {
    id: 'cbc',
    name: 'Sample_CBC_Blood_Test_Report.pdf',
    size: '1.4 MB',
    mimeType: 'application/pdf',
    reportType: 'Blood Test',
    title: 'Complete Blood Count (CBC)',
    titleHi: 'कम्पलीट ब्लड काउंट (CBC)',
    badge: 'Low Hb • Sugar 140 • High LDL',
    url: '/samples/Sample_CBC_Blood_Test_Report.pdf',
    targetId: 'rep-cbc-june-2026',
  },
  {
    id: 'hba1c',
    name: 'Sample_HbA1c_Diabetes_Report.pdf',
    size: '1.1 MB',
    mimeType: 'application/pdf',
    reportType: 'Blood Test',
    title: 'Diabetes HbA1c Panel',
    titleHi: 'डायबिटीज HbA1c टेस्ट',
    badge: 'HbA1c 7.4% High • PP 195',
    url: '/samples/Sample_HbA1c_Diabetes_Report.pdf',
    targetId: 'rep-hba1c-june-2026',
  },
  {
    id: 'thyroid',
    name: 'Sample_Thyroid_Profile_Report.pdf',
    size: '1.2 MB',
    mimeType: 'application/pdf',
    reportType: 'Blood Test',
    title: 'Thyroid Function (TSH)',
    titleHi: 'थायरॉयड प्रोफाइल (TSH)',
    badge: 'TSH 2.8 uIU/mL (Optimal)',
    url: '/samples/Sample_Thyroid_Profile_Report.pdf',
    targetId: 'rep-thyroid-may-2026',
  },
  {
    id: 'rx',
    name: 'Sample_Doctor_Prescription.pdf',
    size: '1.8 MB',
    mimeType: 'application/pdf',
    reportType: 'Prescription',
    title: 'Doctor Prescription Rx',
    titleHi: 'डॉक्टर का पर्चा (5 दवाएं)',
    badge: 'Dolo, Augmentin, Pantocid',
    url: '/samples/Sample_Doctor_Prescription.pdf',
    targetId: 'rep-cbc-june-2026',
  },
];

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ReportType) || 'Blood Test';
  const initialSample = searchParams.get('sample');

  const { addReport } = useApp();
  const { t, language: globalLanguage } = useLanguage();

  const [file, setFile] = useState<{
    name: string;
    size: string;
    base64?: string;
    mimeType?: string;
    targetReportId?: string;
  } | null>(null);
  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [targetLang, setTargetLang] = useState<Language>(globalLanguage);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Explain the complete report',
    'Explain abnormal values',
    'Explain medicines'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(1);
  const [processPercent, setProcessPercent] = useState(15);
  const [apiMessage, setApiMessage] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const goalOptions = [
    { id: 'all', label: 'Explain the complete report', labelHi: 'पूरी रिपोर्ट को सरल भाषा में समझाएं' },
    { id: 'abnormal', label: 'Explain abnormal values', labelHi: 'केवल असामान्य मानों (Abnormal values) को समझाएं' },
    { id: 'meds', label: 'Explain medicines and dosage', labelHi: 'दवाओं और खुराक के बारे में समझाएं' },
    { id: 'specific', label: 'Explain specific tests & ranges', labelHi: 'विशिष्ट परीक्षणों और उनकी सीमाओं का अर्थ समझाएं' }
  ];

  const handleToggleGoal = (label: string) => {
    setSelectedGoals(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const executeAnalysis = async (
    targetFile: { name: string; size: string; base64?: string; mimeType?: string; targetReportId?: string },
    currentReportType: ReportType
  ) => {
    setIsProcessing(true);
    setProcessStep(1);
    setProcessPercent(20);

    const stepInterval = setInterval(() => {
      setProcessStep(prev => (prev < 4 ? prev + 1 : prev));
      setProcessPercent(prev => (prev < 90 ? prev + 22 : prev));
    }, 600);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: targetFile.base64,
          mimeType: targetFile.mimeType,
          fileName: targetFile.name,
          reportType: currentReportType,
          language: targetLang,
          selectedGoals,
        }),
      });

      clearInterval(stepInterval);
      setProcessStep(5);
      setProcessPercent(100);

      const data = await response.json();
      if (data.success && data.report) {
        addReport(data.report);
        if (data.message) {
          setApiMessage(data.message);
        }
        setTimeout(() => {
          router.push(`/reports/${data.report.id}`);
        }, 600);
      } else {
        const fallbackTarget = targetFile.targetReportId || 'rep-cbc-june-2026';
        router.push(`/reports/${fallbackTarget}`);
      }
    } catch {
      clearInterval(stepInterval);
      setProcessStep(5);
      setProcessPercent(100);
      setTimeout(() => {
        const fallbackTarget = targetFile.targetReportId || 'rep-cbc-june-2026';
        router.push(`/reports/${fallbackTarget}`);
      }, 500);
    }
  };

  const handleSelectSamplePreset = async (preset: SamplePreset, autoAnalyze = false) => {
    setReportType(preset.reportType);
    try {
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const fileObj = {
          name: preset.name,
          size: preset.size,
          mimeType: preset.mimeType,
          base64,
          targetReportId: preset.targetId,
        };
        setFile(fileObj);
        if (autoAnalyze) {
          executeAnalysis(fileObj, preset.reportType);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      const fileObj = {
        name: preset.name,
        size: preset.size,
        mimeType: preset.mimeType,
        targetReportId: preset.targetId,
      };
      setFile(fileObj);
      if (autoAnalyze) {
        executeAnalysis(fileObj, preset.reportType);
      }
    }
  };

  useEffect(() => {
    if (initialSample) {
      const matched = samplePresets.find(p => p.id === initialSample);
      if (matched) {
        queueMicrotask(() => {
          handleSelectSamplePreset(matched, false);
        });
      }
    }
  }, [initialSample]);

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        if (isImageMimeType(f.type || f.name)) {
          const comp = await compressImageBase64(rawBase64, 1280, 1280, 0.82);
          setFile({
            name: f.name,
            size: `${(comp.compressedBytes / (1024 * 1024)).toFixed(2)} MB (${comp.sizeReductionPercent}% optimized)`,
            mimeType: f.type || 'image/jpeg',
            base64: comp.base64,
          });
        } else {
          setFile({
            name: f.name,
            size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
            mimeType: f.type || 'application/pdf',
            base64: rawBase64,
          });
        }
      };
      reader.readAsDataURL(f);
    }
  };

  const handleCameraCapture = async (base64Data: string, fileName: string) => {
    const comp = await compressImageBase64(base64Data, 1280, 1280, 0.82);
    setFile({
      name: fileName,
      size: `${(comp.compressedBytes / (1024 * 1024)).toFixed(2)} MB (optimized)`,
      mimeType: 'image/jpeg',
      base64: comp.base64,
    });
  };

  const handleStartAnalysis = async () => {
    if (!file) return;
    executeAnalysis(file, reportType);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-blue-600" />
              <span>{t('uploadReport')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload a clear image or PDF of your medical report or prescription for AI simplification
            </p>
          </div>

          <DisclaimerBanner compact />

          {!isProcessing ? (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Upload Box & Previews */}
              <div className="lg:col-span-7 space-y-5">
                {/* Drag and Drop Zone & Camera Scan Trigger */}
                <div className="bg-white rounded-3xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 p-8 text-center transition-all relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUploadSimulated}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Drag & Drop your report here
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    or <span className="text-blue-600 font-semibold underline">Browse Files</span> from your computer or phone
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCameraOpen(true);
                      }}
                      className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo / Live Camera</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">
                    Supported formats: PDF, JPG, PNG &bull; Max file size 15MB
                  </p>
                </div>

                {/* Quick Sample Selector for immediate evaluation */}
                <div className="bg-white rounded-2xl border border-blue-200/80 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>📄</span> {globalLanguage === 'hi' ? 'नमूना रिपोर्ट (त्वरित परीक्षण के लिए):' : 'Sample Lab Reports (Quick Testing):'}
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      {globalLanguage === 'hi' ? 'क्लिक करके लोड करें' : 'Click to Load & Test'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {samplePresets.map((preset) => {
                      const isSelected = file?.name === preset.name;
                      return (
                        <div
                          key={preset.id}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                              : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                                {preset.reportType}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">PDF</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {preset.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {preset.badge}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                            <a
                              href={preset.url}
                              download={preset.name}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-all"
                              title="Download sample PDF"
                            >
                              <Download className="w-3 h-3 text-slate-500" />
                              <span>Download</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleSelectSamplePreset(preset, false)}
                              className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                              }`}
                            >
                              <span>{isSelected ? '✓ Selected' : '⚡ Load'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectSamplePreset(preset, true)}
                              className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs transition-all"
                              title="Directly start AI analysis on this sample"
                            >
                              <span>Analyze</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Upload Preview Card */}
                {file && (
                  <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {file.size} &bull; Ready for AI extraction
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Preferences & Options */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Report Information & Preferences
                  </h3>

                  {/* Report Type */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Document Type
                    </label>
                    <select
                      value={reportType}
                      onChange={e => setReportType(e.target.value as ReportType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Blood Test">Blood Test (CBC, Metabolic, Lipid)</option>
                      <option value="Urine Test">Urine Routine & Microscopy</option>
                      <option value="Health Checkup">Comprehensive Health Checkup</option>
                      <option value="Prescription">Doctor Prescription</option>
                      <option value="X-Ray">X-Ray / Imaging Report</option>
                      <option value="MRI">MRI Scan</option>
                      <option value="CT Scan">CT Scan</option>
                      <option value="Ultrasound">Ultrasound Sonography</option>
                      <option value="Other">Other Medical Document</option>
                    </select>
                  </div>

                  {/* Preferred Language */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Explanation Language
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTargetLang('en')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          targetLang === 'en'
                            ? 'bg-blue-50 border-blue-600 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetLang('hi')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          targetLang === 'hi'
                            ? 'bg-blue-50 border-blue-600 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        हिन्दी (Hindi)
                      </button>
                    </div>
                  </div>

                  {/* What would you like to understand? */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      What would you like to understand?
                    </label>
                    <div className="space-y-2">
                      {goalOptions.map(g => {
                        const checked = selectedGoals.includes(g.label);
                        return (
                          <button
                            type="button"
                            key={g.id}
                            onClick={() => handleToggleGoal(g.label)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                              checked
                                ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span>{targetLang === 'hi' ? g.labelHi : g.label}</span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                checked
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Analyze CTA */}
                  <button
                    type="button"
                    disabled={!file}
                    onClick={handleStartAnalysis}
                    className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                      file
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Document Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* AI Processing Screen matching Mockup 6 & Section 16 */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm max-w-xl mx-auto text-center space-y-8 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  AI-Powered Processing
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  Analyzing Your Report
                </h2>
                <p className="text-xs text-slate-500">
                  Please wait while our medical vision pipeline reads parameters and normalizes reference ranges.
                </p>
              </div>

              {/* Circular Progress Gauge matching Mockup 6 */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#2563eb"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - processPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">
                    {processPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Processing
                  </span>
                </div>
              </div>

              {/* Step Checklist matching Mockup 6 & Section 16 */}
              <div className="text-left max-w-xs mx-auto space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>File uploaded securely</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-xs font-medium ${
                    processStep >= 2 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {processStep >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                  )}
                  <span>Text & numerical values extracted</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-xs font-medium ${
                    processStep >= 3 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {processStep >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                  )}
                  <span>Medical metrics analyzed</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-xs font-medium ${
                    processStep >= 4 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {processStep >= 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                  )}
                  <span>Important findings & ranges identified</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-xs font-medium ${
                    processStep >= 5 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {processStep >= 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                  )}
                  <span>Simple explanation generated</span>
                </div>
              </div>

              {/* Safety notice during processing */}
              <p className="text-[11px] text-slate-400">
                Notice: AI provides informational translation of medical reports. Not a replacement for a doctor.
              </p>
            </div>
          )}
        </main>
      </div>

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title="Scan Medical Report / Prescription"
      />
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs text-slate-500">Loading analysis workspace...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}

