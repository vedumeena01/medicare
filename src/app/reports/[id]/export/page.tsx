'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { HeartPulse, Printer, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportExportPdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getReport, user } = useApp();
  const { language } = useLanguage();

  const report = getReport(id);

  if (!report) {
    return <div className="p-8 text-center text-sm">Report not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      {/* Print Controls Floating Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/reports/${report.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official A4-like Printable Paper Document matching Mockup 18 */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 shadow-lg rounded-xl p-8 sm:p-12 text-slate-900 space-y-6 print:shadow-none print:border-none print:m-0 print:p-4">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                MediExplain AI &bull; Health Summary
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                AI-Assisted Educational Medical Report Extraction
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p className="font-bold text-slate-900">Document ID: #{report.id.toUpperCase()}</p>
            <p suppressHydrationWarning>Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Patient & Report Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
            <span className="font-bold text-slate-800">{user?.name || 'Vedprakash'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
            <span className="font-bold text-slate-800">{user?.age || 28} Yrs / {user?.gender || 'Male'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Report Type</span>
            <span className="font-bold text-slate-800">{report.reportType}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Report Date</span>
            <span className="font-bold text-slate-800">{report.uploadedAt}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Plain-Language Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Important Findings (Abnormal) */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Out-of-Range Lab Observations
          </h2>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100">
              <tr className="border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-2">Test Name</th>
                <th className="p-2">Observed</th>
                <th className="p-2">Lab Reference</th>
                <th className="p-2">Status</th>
                <th className="p-2">Possible Clinical Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.findings.map(f => (
                <tr key={f.test}>
                  <td className="p-2 font-bold">{f.test}</td>
                  <td className="p-2 font-black">{f.value} {f.unit}</td>
                  <td className="p-2">{f.referenceRange} {f.unit}</td>
                  <td className="p-2 uppercase font-bold text-[10px]">{f.status}</td>
                  <td className="p-2 text-slate-600">{f.possibleMeaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Normal Values Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Parameters Within Standard Reference Range
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {report.normalValues.map(n => (
              <div key={n.test} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold block truncate">{n.test}</span>
                <span className="text-slate-600">{n.value} {n.unit} (Ref: {n.referenceRange})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Questions for Doctor */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            4. Suggested Discussion Questions for Physician
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
            {report.doctorQuestions.map(q => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="pt-4 border-t-2 border-slate-200 space-y-2 text-[10px] text-slate-500 leading-snug">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>MANDATORY MEDICAL DISCLAIMER:</span>
          </div>
          <p>
            This document is an AI-generated summary intended solely for personal educational reference. It does NOT constitute medical diagnosis, clinical judgment, or therapeutic instruction. Always present original laboratory reports to a licensed physician before changing any diet, supplement, or prescribed pharmaceutical regimen.
          </p>
        </div>
      </div>
    </div>
  );
}
