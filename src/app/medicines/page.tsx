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
  Upload
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import CameraCaptureModal from '@/components/CameraCaptureModal';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Medicine } from '@/types';

export default function MedicinesPage() {
  const { medicines, addMedicine, deleteMedicine } = useApp();
  const { t, language } = useLanguage();

  const [scanMode, setScanMode] = useState<'strip' | 'prescription'>('strip');
  const [selectedScanSample, setSelectedScanSample] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedResult, setExtractedResult] = useState<Partial<Medicine> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const executeScanApi = async (base64Data?: string, mimeType?: string) => {
    setIsScanning(true);
    setExtractedResult(null);

    try {
      const response = await fetch('/api/scan-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          mimeType: mimeType || 'image/jpeg',
          language,
        }),
      });

      const data = await response.json();
      if (data.success && data.medicine) {
        setExtractedResult(data.medicine);
        if (data.message) setScanMessage(data.message);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSimulateScan = (type: 'blister' | 'prescription') => {
    setSelectedScanSample(type);
    executeScanApi('/9j/4AAQSkZJRgABAQEASABIAAD...', 'image/jpeg');
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        executeScanApi(base64, file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (base64Data: string) => {
    executeScanApi(base64Data, 'image/jpeg');
  };

  const handleSaveToSchedule = () => {
    if (!extractedResult || !extractedResult.name) return;
    addMedicine(extractedResult as Omit<Medicine, 'id' | 'userId'>);
    setExtractedResult(null);
    setSelectedScanSample(null);
  };

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

          {/* Scanner & Prescription Reader Interface (Mockup 12 & 15) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>AI Medicine & Prescription Scanner</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Select a capture method or test with sample medical imagery
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setScanMode('strip')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    scanMode === 'strip' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Medicine Strip / Box
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode('prescription')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    scanMode === 'prescription' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Doctor Prescription
                </button>
              </div>
            </div>

            {/* Hidden Real File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleCustomImageUpload}
              className="hidden"
            />

            {/* Camera / Upload Zone */}
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-3">
                {scanMode === 'strip' ? (
                  /* Blister strip photo preview matching Mockup 12 */
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 bg-slate-50 text-center space-y-3">
                    <div className="w-16 h-10 mx-auto rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400">
                      <Pill className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Upload or photograph tablet strip
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ensure medicine name and strength are clearly legible
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Live Camera Snapshot</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateScan('blister')}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>Sample Strip</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Prescription photo preview matching Mockup 15 */
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 bg-slate-50 text-center space-y-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 shadow-xs max-w-xs mx-auto">
                      <p className="font-bold text-blue-900">Rx: Tab Amlodipine 5mg</p>
                      <p className="text-slate-500">1-0-1 After Food</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Upload Handwritten Doctor Slip
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Extract medicine name, timing, and meal instructions
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Live Camera Snapshot</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload Prescription</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateScan('prescription')}
                        className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Sample Rx</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Scan Results Preview */}
              <div className="lg:col-span-6">
                {isScanning ? (
                  <div className="p-8 rounded-2xl border border-blue-200 bg-blue-50/40 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto"></div>
                    <h4 className="text-xs font-bold text-blue-900">
                      Reading packaging text with OCR...
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Matching pharmaceutical database for indications & precautions
                    </p>
                  </div>
                ) : extractedResult ? (
                  <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-950">
                          Medicine Detected
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        Confidence {Math.round((extractedResult.confidenceScore || 0.95) * 100)}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900">
                        {extractedResult.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Strength: {extractedResult.strength} &bull; Form: {extractedResult.form}
                      </p>
                      <p className="text-xs text-blue-700 font-semibold bg-white p-2 rounded-xl border border-emerald-100">
                        Prescribed Timing: {extractedResult.dosageInstruction}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveToSchedule}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Medicine Schedule</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtractedResult(null)}
                        className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 text-center text-slate-400 space-y-1">
                    <Sparkles className="w-7 h-7 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">No scan in progress</p>
                    <p className="text-[11px]">
                      Click one of the sample test buttons or upload an image to identify drugs
                    </p>
                  </div>
                )}
              </div>
            </div>
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

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title={scanMode === 'strip' ? 'Capture Medicine Strip Photo' : 'Capture Prescription Photo'}
      />
    </div>
  );
}
