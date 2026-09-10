'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  UploadCloud,
  Calendar,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { ReportType } from '@/types';

export default function ReportsHistoryPage() {
  const { reports, deleteReport } = useApp();
  const { t, language } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const reportTypes = ['All', 'Blood Test', 'Health Checkup', 'Prescription', 'Urine Test'];

  const filteredReports = reports
    .filter(r => {
      const matchesSearch =
        r.fileName.toLowerCase().includes(search.toLowerCase()) ||
        r.reportType.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'All' || r.reportType === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime() || 0;
      const dateB = new Date(b.uploadedAt).getTime() || 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

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
                <FileText className="w-6 h-6 text-blue-600" />
                <span>{t('navReports')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                View, search, and manage all your historical medical report analyses
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{t('uploadReport')}</span>
              </Link>
            </div>
          </div>

          <DisclaimerBanner compact />

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search reports by name..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {reportTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      selectedType === type
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 font-semibold ml-auto md:ml-0"
                title="Toggle Date Sort"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
              </button>
            </div>
          </div>

          {/* Reports Grid / Cards List matching Mockup 17 */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">{t('noReportsYet')}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t('uploadFirstReport')}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{language === 'hi' ? 'मेडिकल रिपोर्ट अपलोड करें' : 'Upload Medical Report'}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map(rep => (
                <div
                  key={rep.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900">{rep.fileName}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{rep.reportType}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {rep.uploadedAt}
                        </span>
                        <span>&bull;</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                        {language === 'hi' && rep.summaryHi ? rep.summaryHi : rep.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/reports/${rep.id}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewAnalysis')}</span>
                    </Link>

                    <Link
                      href={`/reports/${rep.id}/export`}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Export PDF Summary"
                    >
                      <Download className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => deleteReport(rep.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
