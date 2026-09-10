'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Trash2,
  Bookmark,
  Printer,
  Sparkles,
  HelpCircle,
  Activity,
  Heart,
  Calendar,
  Languages,
  ArrowLeft,
  Check,
  ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import HealthRiskCard from '@/components/HealthRiskCard';
import HealthTrendChart from '@/components/HealthTrendChart';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getReport, deleteReport } = useApp();
  const { language, t } = useLanguage();

  const report = getReport(id);

  const [normalValuesOpen, setNormalValuesOpen] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="p-12 text-center space-y-4">
          <p className="text-sm text-slate-500">Medical report not found.</p>
          <Link href="/reports" className="text-blue-600 font-bold text-xs">
            &larr; Back to Reports History
          </Link>
        </div>
      </div>
    );
  }

  const toggleQuestionCheck = (qId: string) => {
    setCheckedQuestions(prev =>
      prev.includes(qId) ? prev.filter(item => item !== qId) : [...prev, qId]
    );
  };

  const handleDelete = () => {
    deleteReport(report.id);
    router.push('/reports');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 overflow-x-hidden">
          {/* Top Back Nav & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <Link
                href="/reports"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Reports</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{report.fileName}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{report.reportType}</span>
                <span>&bull;</span>
                <span>Uploaded: {report.uploadedAt}</span>
                <span>&bull;</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {report.status}
                </span>
              </div>
            </div>

            {/* Action Buttons: Download PDF, Share, Save */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/reports/${report.id}/export`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('exportPdf')}</span>
              </Link>
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('share')}</span>
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSaved
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Analysis Saved' : t('saveAnalysis')}</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                title="Delete Report"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prominent Mandatory Safety Warning Banner (Section 17 & 56) */}
          <DisclaimerBanner />

          {/* Section 18: Overall Summary Card */}
          <div className="bg-white rounded-3xl border border-blue-200/70 p-6 sm:p-7 shadow-xs space-y-3 bg-gradient-to-br from-blue-50/40 via-white to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {t('simpleSummaryTitle')}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                AI Simplification
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {language === 'hi' && report.summaryHi ? report.summaryHi : report.summary}
            </p>
          </div>

          {/* Section 19: Important Findings (Abnormal Values) matching Mockup 7 & 8 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{t('importantFindingsTitle')}</span>
              </h2>
              <span className="text-xs text-slate-500">
                {report.findings.length} key parameters identified
              </span>
            </div>

            <div className="space-y-3">
              {report.findings.map(item => {
                const isHigh = item.status === 'high';
                const isLow = item.status === 'low';
                const statusBadgeBg = isHigh
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : isLow
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                return (
                  <div
                    key={item.test}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 hover:border-blue-300 transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {language === 'hi' && item.testHi ? item.testHi : item.test}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Observed Value:{' '}
                          <span className="font-extrabold text-slate-900">
                            {item.value} {item.unit}
                          </span>{' '}
                          &bull; Standard Lab Range: {item.referenceRange} {item.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadgeBg}`}
                        >
                          {isHigh
                            ? t('statusHigh')
                            : isLow
                            ? t('statusLow')
                            : t('statusNormal')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-md">
                          Confidence {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Explanations in Plain Language */}
                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="font-bold text-slate-700 block">
                          What this measure means:
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {language === 'hi' && item.explanationHi
                            ? item.explanationHi
                            : item.explanation}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                        <span className="font-bold text-blue-950 block">
                          Possible meaning & context:
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {language === 'hi' && item.possibleMeaningHi
                            ? item.possibleMeaningHi
                            : item.possibleMeaning}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 20: Normal Values (Collapsible section to avoid walls of numbers) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => setNormalValuesOpen(!normalValuesOpen)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t('normalValuesTitle')} ({report.normalValues.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">{t('normalValuesSubtitle')}</p>
                </div>
              </div>
              {normalValuesOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {normalValuesOpen && (
              <div className="border-t border-slate-100 p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                      <th className="pb-2">Test Parameter</th>
                      <th className="pb-2">Observed Value</th>
                      <th className="pb-2">Reference Range</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.normalValues.map(item => (
                      <tr key={item.test} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-medium text-slate-800">
                          {language === 'hi' && item.testHi ? item.testHi : item.test}
                        </td>
                        <td className="py-2.5 font-bold text-slate-900">
                          {item.value} {item.unit}
                        </td>
                        <td className="py-2.5 text-slate-500">
                          {item.referenceRange} {item.unit}
                        </td>
                        <td className="py-2.5">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Normal
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 21: Medical Terms Explanation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>{t('medicalTermsTitle')}</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              {report.medicalTerms.map(term => (
                <div
                  key={term.term}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                >
                  <h4 className="text-xs font-bold text-blue-900">
                    {language === 'hi' && term.termHi ? term.termHi : term.term}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {language === 'hi' && term.simpleMeaningHi
                      ? term.simpleMeaningHi
                      : term.simpleMeaning}
                  </p>
                  <div className="pt-1 text-[10px] text-slate-400">
                    <strong>Why measured:</strong>{' '}
                    {language === 'hi' && term.whyMeasuredHi
                      ? term.whyMeasuredHi
                      : term.whyMeasured}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 22: Questions for Your Doctor */}
          <div className="bg-white rounded-2xl border border-indigo-200/80 p-5 shadow-xs space-y-3 bg-indigo-50/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>{t('doctorQuestionsTitle')}</span>
              </h3>
              <span className="text-[11px] text-indigo-600 font-medium">
                Check questions you wish to take to your appointment
              </span>
            </div>

            <div className="space-y-2">
              {report.doctorQuestions.map(q => {
                const isChecked = checkedQuestions.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggleQuestionCheck(q.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{language === 'hi' && q.questionHi ? q.questionHi : q.question}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 23: Recommendations / General Suggestions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{t('generalSuggestionsTitle')}</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {report.suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                >
                  <h4 className="text-xs font-bold text-slate-800">
                    {language === 'hi' && sug.titleHi ? sug.titleHi : sug.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {language === 'hi' && sug.descriptionHi ? sug.descriptionHi : sug.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 24: Report Comparison (Mockup 7 & Section 24) */}
          {report.comparison && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>{t('reportComparisonTitle')}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {report.comparison.previousDate} &rarr; {report.comparison.currentDate}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                      <th className="pb-2">Test</th>
                      <th className="pb-2">Old Value ({report.comparison.previousDate})</th>
                      <th className="pb-2">New Value ({report.comparison.currentDate})</th>
                      <th className="pb-2">Reference</th>
                      <th className="pb-2">Change Insight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.comparison.comparisons.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-bold text-slate-800">{c.test}</td>
                        <td className="py-2.5 text-slate-600">{c.oldValue}</td>
                        <td className="py-2.5 font-extrabold text-slate-900">{c.newValue}</td>
                        <td className="py-2.5 text-slate-500">{c.referenceRange}</td>
                        <td className="py-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                              c.change === 'improved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {language === 'hi' && c.changeTextHi ? c.changeTextHi : c.changeText}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Longitudinal Trend Chart (Hb, Sugar, Cholesterol over time) */}
          <HealthTrendChart />

          {/* Health Risk Analysis Card Component */}
          {report.riskAnalysis && <HealthRiskCard items={report.riskAnalysis} />}
        </main>
      </div>

      {/* Share Modal with Privacy Verification (Section 25 & 50) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Share Medical Analysis Securely</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <strong>Privacy Confirmation:</strong>
              <p>
                Medical information is sensitive. Only share this analysis link or document with trusted persons or healthcare professionals.
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Secure Summary Link</label>
              <input
                type="text"
                readOnly
                value={`https://medicare.ai/reports/${report.id}?token=sec_98439`}
                className="w-full p-2 bg-slate-100 rounded-xl text-xs font-mono border border-slate-200 select-all"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareCopied(false);
                }}
                className="px-3.5 py-1.5 text-xs text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => setShareCopied(true)}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                {shareCopied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Section 25 & 36) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Permanently Delete Report</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>{report.fileName}</strong>?
              <br />
              <span className="text-rose-600 font-semibold">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
