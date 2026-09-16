'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, Pill, HelpCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function GlobalSearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, reports, medicines } = useApp();
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedReports = reports.filter(r =>
    r.fileName.toLowerCase().includes(trimmed) ||
    r.reportType.toLowerCase().includes(trimmed) ||
    r.findings.some(f => f.test.toLowerCase().includes(trimmed) || (f.testHi && f.testHi.includes(trimmed)))
  );

  const matchedMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(trimmed) ||
    m.description.toLowerCase().includes(trimmed) ||
    m.commonUses.some(u => u.toLowerCase().includes(trimmed))
  );

  const handleSelectReport = (id: string) => {
    setIsSearchOpen(false);
    router.push(`/reports/${id}`);
  };

  const handleSelectMedicine = (id: string) => {
    setIsSearchOpen(false);
    router.push(`/medicines/${id}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Medical Records Search"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label="Search reports, medicines, and medical tests"
            className="flex-1 bg-transparent text-sm focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {trimmed === '' ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Type anything to search (e.g. &quot;Blood&quot;, &quot;Hemoglobin&quot;, &quot;Dolo&quot;, &quot;Sugar&quot;)</p>
            </div>
          ) : (
            <>
              {/* Reports Results */}
              {matchedReports.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Medical Reports ({matchedReports.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedReports.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleSelectReport(r.id)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-200 flex items-center justify-between group transition-all"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                            {r.fileName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {r.reportType} • {r.uploadedAt} • {r.findings.length} findings
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicines Results */}
              {matchedMedicines.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Medicines ({matchedMedicines.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedMedicines.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMedicine(m.id)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 flex items-center justify-between group transition-all"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600">
                            {m.name} ({m.strength})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {m.frequency} • {language === 'hi' && m.dosageInstructionHi ? m.dosageInstructionHi : m.dosageInstruction}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedReports.length === 0 && matchedMedicines.length === 0 && (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">No records found for &quot;{query}&quot;</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
