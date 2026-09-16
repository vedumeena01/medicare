'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Languages,
  FileCheck,
  Pill,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does MediExplain AI provide a medical diagnosis?",
      qHi: "क्या MediExplain AI कोई मेडिकल डायग्नोसिस (रोग निदान) देता है?",
      a: "No. MediExplain AI is an educational and informational tool designed to simplify complex laboratory jargon into accessible language. It never makes a medical diagnosis or prescribes medications. All AI observations should always be reviewed with your doctor.",
      aHi: "नहीं। MediExplain AI केवल एक शैक्षिक और सूचनात्मक सहायक है जो कठिन मेडिकल रिपोर्ट को आसान भाषा में समझाता है। यह कोई चिकित्सीय निदान या इलाज नहीं देता है। किसी भी बदलाव के लिए अपने डॉक्टर से अवश्य परामर्श लें।"
    },
    {
      q: "Which languages are supported?",
      qHi: "कौन सी भाषाएं समर्थित हैं?",
      a: "MediExplain AI natively supports English and natural Hindi, allowing you to seamlessly translate complex medical terms and explanations into easy everyday vocabulary.",
      aHi: "MediExplain AI अंग्रेजी और स्वाभाविक हिंदी का समर्थन करता है, जिससे आप कठिन मेडिकल शब्दों को अपनी पसंदीदा भाषा में समझ सकते हैं।"
    },
    {
      q: "Is my personal health data kept safe and private?",
      qHi: "क्या मेरा मेडिकल डेटा सुरक्षित और गोपनीय है?",
      a: "Yes. Your privacy is paramount. Uploaded reports and extracted records are protected with user-specific permissions, encrypted transmission, and you have full control to permanently delete any document at any moment.",
      aHi: "हाँ। आपकी गोपनीयता सर्वोच्च प्राथमिकता है। आपका डेटा एन्क्रिप्टेड रहता है और आप जब चाहें अपनी किसी भी रिपोर्ट को स्थायी रूप से हटा सकते हैं।"
    },
    {
      q: "What types of documents can I upload?",
      qHi: "मैं किस प्रकार के दस्तावेज़ अपलोड कर सकता हूँ?",
      a: "You can upload Blood Tests (such as Complete Blood Count, Lipid Profiles, Liver/Kidney tests), Urine tests, Thyroid panels, Prescriptions, and Medicine strip/packaging photos in JPG, PNG, or PDF formats.",
      aHi: "आप ब्लड टेस्ट (जैसे सीबीसी, लिपिड प्रोफाइल, थायरॉयड), पेशाब की जांच रिपोर्ट, डॉक्टर का पर्चा और दवाइयों के रैपर की फोटो (JPG, PNG, PDF) अपलोड कर सकते हैं।"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Medical Report Simplifier</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {language === 'hi' ? (
                  <>
                    अपनी सेहत को समझें। <br />
                    <span className="text-blue-600">AI की मदद से, आसानी से।</span>
                  </>
                ) : (
                  <>
                    Understand Your Health. <br />
                    <span className="text-blue-600">Better. With AI.</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('supportingText')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started (Create Account)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/analyze"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm transition-all"
                >
                  <span>{t('analyzeMyReport')}</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-slate-600 hover:text-blue-600 font-semibold text-sm transition-all"
                >
                  <span>Explore Dashboard &rarr;</span>
                </Link>
              </div>

              {/* Credibility Stats Bar */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-slate-900">50K+</div>
                  <div className="text-xs font-medium text-slate-500">Reports Analyzed</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">15K+</div>
                  <div className="text-xs font-medium text-slate-500">Happy Users</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">98%</div>
                  <div className="text-xs font-medium text-slate-500">Extraction Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-600">24/7</div>
                  <div className="text-xs font-medium text-slate-500">AI Assistant</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Interactive Report Card Simulation matching Mockup 1 */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-5 space-y-4">
                {/* Floating Doctor / Health Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">AI Health Report</h3>
                      <p className="text-xs text-slate-400">Complete Blood Count (CBC)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Health Score 84/100
                  </span>
                </div>

                {/* Simulated findings */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-rose-900">Hemoglobin (Hb)</span>
                      <span className="text-rose-700 font-extrabold">10.8 g/dL (Low)</span>
                    </div>
                    <p className="text-[11px] text-rose-800 leading-snug">
                      Below standard reference range (12.0–16.0). May cause mild fatigue.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-900">Fasting Sugar</span>
                      <span className="text-amber-700 font-extrabold">140 mg/dL (High)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Above normal (70–110). Discuss early glycemic control with doctor.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-900">Platelet Count</span>
                      <span className="text-emerald-700 font-extrabold">2.5 Lakhs (Normal)</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-snug">
                      Proper blood clotting capacity within optimal range.
                    </p>
                  </div>
                </div>

                {/* Simulated Action */}
                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-blue-500" />
                    English + हिन्दी supported
                  </span>
                  <Link
                    href="/reports/rep-cbc-june-2026"
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Inspect Full View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 w-full">
        <DisclaimerBanner />
      </section>

      {/* How It Works Section (4 Steps matching Section 6) */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              How MediExplain AI Works
            </h2>
            <p className="text-sm text-slate-600">
              From uploading your report to receiving a clear, understandable medical breakdown in seconds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Upload Your Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a quick photo or upload a PDF of your lab test, blood report, or doctor&apos;s prescription.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">AI Reads & Extracts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our vision model normalizes test names, observed values, and prints exact laboratory reference ranges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Choose English or Hindi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toggle between simple English or natural Hindi translations crafted for everyday non-technical readers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">Get Clear Explanations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review abnormal findings, medical dictionary terms, and questions to ask during your doctor visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (6 Cards matching Section 5) */}
      <section id="features" className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Engineered for Complete Health Clarity
            </h2>
            <p className="text-sm text-slate-600">
              A healthcare-first platform designed to empower patients and families.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Medical Report Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload blood tests, complete metabolic panels, thyroid, lipid profiles, and health checkups with immediate digitization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Simple Explanations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Translates intimidating terms like &quot;Erythrocytes&quot; or &quot;Plateletcrit&quot; into plain, friendly explanations anyone can understand.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hindi + English</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Native bilingual support featuring natural conversational Hindi alongside English for family members of all generations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Important Findings Priority</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly highlights out-of-range abnormal indicators at the very top of your dashboard while keeping normal values organized.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Medicine Information & Scanner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Snap photos of medicine blister strips or prescriptions to learn their primary purpose, precautions, and side effects.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Medicine Schedule & Reminders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set morning, afternoon, and evening dose reminders with interactive calendar tracking and one-tap status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Safety Section matching Section 7 */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Health Information Matters
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              We treat medical information with the highest privacy and safety standards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Secure Authentication</h4>
              <p className="text-[11px] text-slate-500">Only authorized users can access personal medical records.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Protected Uploads</h4>
              <p className="text-[11px] text-slate-500">No public URLs. Files are stored securely and isolated per account.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">User-Controlled History</h4>
              <p className="text-[11px] text-slate-500">Delete any report or analysis instantly and permanently.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Clear AI Limitations</h4>
              <p className="text-[11px] text-slate-500">Explicit confidence metrics and continuous encouragement to see a doctor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers to help you navigate your medical reports with confidence.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{language === 'hi' ? item.qHi : item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {language === 'hi' ? item.aHi : item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-base">MediExplain AI</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link href="/analyze" className="hover:text-blue-600">Upload Report</Link>
              <Link href="/medicines" className="hover:text-blue-600">Medicines</Link>
              <Link href="/settings" className="hover:text-blue-600">Privacy & Terms</Link>
            </div>
          </div>
          <div className="text-center sm:text-left text-[11px] text-slate-400 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-2">
            <span>© 2026 MediExplain AI (MediCare AI). Educational Medical Simplification Tool.</span>
            <span>Always consult a certified healthcare professional for medical diagnoses.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
