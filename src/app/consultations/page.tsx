'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  UserCheck,
  Stethoscope,
  Pill,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  Send,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Consultation } from '@/types';

export default function ConsultationsPage() {
  const { consultations, addConsultation, reports, addMedicine, appointments } = useApp();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'records' | 'prepare'>('records');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Consultation Form State
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultDate, setConsultDate] = useState(new Date().toISOString().split('T')[0]);
  const [symptomsInput, setSymptomsInput] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescribedMeds, setPrescribedMeds] = useState('');
  const [attachedReport, setAttachedReport] = useState('');

  // Pre-consultation prep state
  const [prepSymptoms, setPrepSymptoms] = useState<string[]>(['Morning fatigue', 'Elevated fasting sugar']);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [selectedDoctorForPrep, setSelectedDoctorForPrep] = useState('Dr. Rajesh Sharma');
  const [prepSaved, setPrepSaved] = useState(false);

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymptomText.trim()) {
      setPrepSymptoms([...prepSymptoms, newSymptomText.trim()]);
      setNewSymptomText('');
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setPrepSymptoms(prepSymptoms.filter((_, i) => i !== index));
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;

    const parsedMeds = prescribedMeds
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const parts = line.split('-');
        return {
          name: parts[0]?.trim() || line.trim(),
          dosage: parts[1]?.trim() || '1 tablet daily',
          duration: parts[2]?.trim() || '14 days',
        };
      });

    await addConsultation({
      doctorName: doctorName.trim(),
      specialty: specialty.trim() || 'General Medicine',
      date: consultDate,
      symptoms: symptomsInput ? symptomsInput.split(',').map((s) => s.trim()) : [],
      doctorNotes: doctorNotes.trim(),
      diagnosisSuggestion: diagnosis.trim() || undefined,
      prescribedMedicines: parsedMeds,
      attachedReportNames: attachedReport ? [attachedReport] : [],
    });

    setShowAddModal(false);
    setDoctorName('');
    setSpecialty('');
    setDoctorNotes('');
    setDiagnosis('');
    setPrescribedMeds('');
  };

  const handleAddPrescribedToSchedule = (med: { name: string; dosage: string; duration: string }) => {
    addMedicine({
      name: med.name,
      strength: 'Standard Dose',
      form: 'Tablet',
      dosageInstruction: med.dosage,
      dosageInstructionHi: med.dosage,
      frequency: 'Once daily',
      timeSlot: 'Morning',
      scheduledTime: '09:00 AM',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Upcoming',
      description: 'Prescribed during clinical consultation.',
      descriptionHi: 'डॉक्टर परामर्श के दौरान सुझाई गई दवा।',
      commonUses: ['Clinical treatment as advised by doctor'],
      commonUsesHi: ['डॉक्टर के परामर्श अनुसार उपचार हेतु'],
      precautions: ['Follow prescribed dosage and timing.'],
      precautionsHi: ['निर्धारित खुराक व समय का पालन करें।'],
      sideEffects: ['Mild nausea or drowsiness may occur.'],
      sideEffectsHi: ['हल्की मिचली या आलस्य हो सकता है।'],
      whenToSeekHelp: 'Contact your physician if any allergic rash or severe discomfort occurs.',
      whenToSeekHelpHi: 'यदि कोई एलर्जी या असामान्य लक्षण दिखे तो तुरंत डॉक्टर से संपर्क करें।',
    });
    alert(
      language === 'hi'
        ? `${med.name} को आपकी दवा अनुसूची में जोड़ दिया गया है!`
        : `${med.name} added to your daily medication schedule!`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 rounded-3xl p-6 lg:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
                  <ClipboardList className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'परामर्श इतिहास व प्रिस्क्रिप्शन' : 'Clinical Records & Notes'}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
                  {language === 'hi' ? 'डॉक्टर परामर्श व स्वास्थ्य नोट्स' : 'Doctor Consultations & Care Notes'}
                </h1>
                <p className="text-blue-100 max-w-xl text-sm lg:text-base">
                  {language === 'hi'
                    ? 'डॉक्टर की सलाह, दी गई दवाइयों के निर्देश और अगली मुलाकात की तैयारी को एक ही सुरक्षित स्थान पर रखें।'
                    : 'Access physician insights, digital prescriptions, and prepare symptom briefings for your next appointment.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-5 py-3 bg-white text-blue-900 font-semibold rounded-xl shadow hover:bg-blue-50 transition-all flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'hi' ? 'परामर्श रिकॉर्ड जोड़ें' : 'Log Past Consultation'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              {language === 'hi' ? 'परामर्श सारांश' : 'Consultation Records'}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'records' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {consultations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('prepare')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === 'prepare'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {language === 'hi' ? 'अगली मुलाकात की तैयारी' : 'Pre-Visit Preparation'}
            </button>
          </div>

          {/* TAB 1: CONSULTATION RECORDS */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              {consultations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
                  <ClipboardList className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {language === 'hi' ? 'कोई परामर्श रिकॉर्ड नहीं है' : 'No consultation records yet'}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    {language === 'hi'
                      ? 'अपने डॉक्टर के साथ हुई पिछली मुलाकातों की दवाइयां व निर्देश दर्ज करें।'
                      : 'Log past doctor recommendations and prescription details to keep track of your clinical journey.'}
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
                  >
                    {language === 'hi' ? 'रिकॉर्ड जोड़ें' : 'Log Consultation'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {consultations.map((con) => (
                    <div
                      key={con.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                            <Stethoscope className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{con.doctorName}</h3>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                              {con.specialty}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {con.date}
                          </span>
                        </div>
                      </div>

                      {/* Diagnosis & Symptoms */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-100">
                        {con.diagnosisSuggestion && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                              {language === 'hi' ? 'निदान / डॉक्टर का निष्कर्ष' : 'Clinical Diagnosis / Assessment'}
                            </h4>
                            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-amber-900 font-medium text-sm">
                              {con.diagnosisSuggestion}
                            </div>
                          </div>
                        )}

                        {con.symptoms && con.symptoms.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                              {language === 'hi' ? 'चर्चा किए गए लक्षण' : 'Discussed Symptoms'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {con.symptoms.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Doctor's Notes */}
                      <div className="py-6 border-b border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                          {language === 'hi' ? 'चिकित्सक के नोट्स व निर्देश' : "Physician's Clinical Notes"}
                        </h4>
                        <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {language === 'hi' && con.doctorNotesHi ? con.doctorNotesHi : con.doctorNotes}
                        </p>
                      </div>

                      {/* Prescribed Medicines */}
                      {con.prescribedMedicines && con.prescribedMedicines.length > 0 && (
                        <div className="pt-6">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <Pill className="w-4 h-4 text-emerald-600" />
                            {language === 'hi' ? 'सुझाई गई दवाएं (Prescriptions)' : 'Prescribed Medications'}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {con.prescribedMedicines.map((med, idx) => (
                              <div
                                key={idx}
                                className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-bold text-sm text-emerald-950">{med.name}</p>
                                  <p className="text-xs text-emerald-800">
                                    {med.dosage} • {med.duration}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleAddPrescribedToSchedule(med)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
                                  title="Add this medicine to daily schedule"
                                >
                                  {language === 'hi' ? '+ शेड्यूल में जोड़ें' : '+ Add to Schedule'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attached Reports */}
                      {con.attachedReportNames && con.attachedReportNames.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>
                            {language === 'hi' ? 'संबद्ध रिपोर्ट:' : 'Referenced Document:'}{' '}
                            <strong>{con.attachedReportNames.join(', ')}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRE-VISIT PREPARATION BUILDER */}
          {activeTab === 'prepare' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {language === 'hi'
                        ? 'डॉक्टर से परामर्श की तैयारी'
                        : 'Doctor Visit Preparation Toolkit'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {language === 'hi'
                        ? 'अपने लक्षण व सवाल तैयार रखें ताकि परामर्श में कोई महत्वपूर्ण बिंदु न छूटे।'
                        : 'Organize your current symptoms, questions, and reports before stepping into the clinic.'}
                    </p>
                  </div>
                </div>

                {prepSaved && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'hi'
                        ? 'आपकी परामर्श तैयारी सफलतापूर्वक सहेज ली गई है!'
                        : 'Your visit brief is saved and will be available during your consultation.'}
                    </span>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Select Doctor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                      {language === 'hi' ? 'परामर्श हेतु डॉक्टर' : 'Doctor / Specialist'}
                    </label>
                    <select
                      value={selectedDoctorForPrep}
                      onChange={(e) => setSelectedDoctorForPrep(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                    >
                      <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Cardiologist)</option>
                      <option value="Dr. Ananya Verma">Dr. Ananya Verma (Endocrinologist)</option>
                      <option value="Dr. Vikram Mehta">Dr. Vikram Mehta (Internal Medicine)</option>
                      <option value="Dr. Priya Nair">Dr. Priya Nair (Pulmonologist)</option>
                    </select>
                  </div>

                  {/* Add Symptoms */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                      {language === 'hi' ? 'अपने वर्तमान लक्षण जोड़ें' : 'Your Symptoms & Duration'}
                    </label>

                    <form onSubmit={handleAddSymptom} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder={
                          language === 'hi'
                            ? 'उदा. सीढ़ियां चढ़ते समय सांस फूलना...'
                            : 'e.g. Mild shortness of breath on 2nd flight of stairs...'
                        }
                        value={newSymptomText}
                        onChange={(e) => setNewSymptomText(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        {language === 'hi' ? 'जोड़ें' : 'Add'}
                      </button>
                    </form>

                    <div className="space-y-2">
                      {prepSymptoms.map((symptom, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-sm"
                        >
                          <span className="text-slate-800 font-medium">• {symptom}</span>
                          <button
                            onClick={() => handleRemoveSymptom(idx)}
                            className="text-slate-400 hover:text-red-600 text-xs font-semibold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Generated Questions from Recent Reports */}
                  {reports[0]?.doctorQuestions && reports[0].doctorQuestions.length > 0 && (
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        {language === 'hi'
                          ? 'आपकी हालिया रिपोर्ट से अनुशंसित सवाल'
                          : 'AI-Generated Questions from Your Latest Report'}
                      </div>
                      <div className="space-y-2">
                        {reports[0].doctorQuestions.map((q) => (
                          <div key={q.id} className="text-xs text-indigo-950 flex items-start gap-2">
                            <span className="font-bold text-indigo-600">Q:</span>
                            <span>{language === 'hi' && q.questionHi ? q.questionHi : q.question}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setPrepSaved(true);
                      setTimeout(() => setPrepSaved(false), 3000);
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow"
                  >
                    {language === 'hi' ? 'तैयारी सारांश सहेजें' : 'Save Pre-Consultation Summary'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADD CONSULTATION RECORD MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative my-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {language === 'hi' ? 'पिछला परामर्श रिकॉर्ड जोड़ें' : 'Log Doctor Consultation'}
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  {language === 'hi'
                    ? 'डॉक्टर का नाम, तारीख, निष्कर्ष और सुझाई गई दवाएं दर्ज करें।'
                    : 'Record clinical observations and medicines prescribed during your visit.'}
                </p>

                <form onSubmit={handleSaveConsultation} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                        {language === 'hi' ? 'डॉक्टर का नाम' : 'Doctor Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Sharma"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                        {language === 'hi' ? 'विशेषज्ञता' : 'Specialty'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cardiologist"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                        {language === 'hi' ? 'परामर्श तारीख' : 'Date of Consultation'}
                      </label>
                      <input
                        type="date"
                        value={consultDate}
                        onChange={(e) => setConsultDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                        {language === 'hi' ? 'निदान निष्कर्ष' : 'Diagnosis Suggestion'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Borderline Dyslipidemia"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {language === 'hi' ? 'लक्षण (अल्पविराम द्वारा अलग करें)' : 'Symptoms Discussed (Comma separated)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chest tightness, Fatigue, High blood sugar"
                      value={symptomsInput}
                      onChange={(e) => setSymptomsInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {language === 'hi' ? 'संलग्न रिपोर्ट का नाम' : 'Attached Report Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CBC_Blood_Test_Report.pdf"
                      value={attachedReport}
                      onChange={(e) => setAttachedReport(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {language === 'hi' ? 'डॉक्टर के निर्देश / सलाह' : "Doctor's Advice / Notes"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Prescribed lipid management, repeat testing in 2 months..."
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {language === 'hi'
                        ? 'दी गई दवाएं (एक प्रति पंक्ति: नाम - खुराक - अवधि)'
                        : 'Prescribed Medicines (One per line: Name - Dosage - Duration)'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`Vitamin D3 60K - 1 capsule weekly - 8 weeks\nPantoprazole 40 - 1 tablet morning - 14 days`}
                      value={prescribedMeds}
                      onChange={(e) => setPrescribedMeds(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-xs"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition"
                    >
                      {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow transition"
                    >
                      {language === 'hi' ? 'सहेजें' : 'Save Record'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Medical Disclaimer */}
          <div className="mt-12">
            <DisclaimerBanner />
          </div>
        </main>
      </div>
    </div>
  );
}
