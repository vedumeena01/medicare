'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Bell,
  Languages,
  Shield,
  Trash2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import LanguageSelector from '@/components/LanguageSelector';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import GeminiKeyManager from '@/components/GeminiKeyManager';
import { downloadFhirBundle, downloadClinicalCsv } from '@/lib/fhirExport';

export default function SettingsPage() {
  const router = useRouter();
  const { user, reports, medicines, resetToCleanState, activeProfile } = useApp();
  const { t, language } = useLanguage();

  const [notificationPrefs, setNotificationPrefs] = useState({
    medicineReminders: true,
    reportCompleted: true,
    browserAlerts: true,
    emailAlerts: false,
    inAppAlerts: true
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medicare_notif_prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
          setNotificationPrefs(parsed);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [dataExported, setDataExported] = useState(false);

  const toggleNotif = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('medicare_notif_prefs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleExportData = () => {
    const data = {
      user,
      reportsCount: reports.length,
      reports,
      medicines,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare_data_export_${user?.name || 'patient'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDataExported(true);
    setTimeout(() => setDataExported(false), 3000);
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
              <Settings className="w-6 h-6 text-blue-600" />
              <span>{t('navSettings')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage application preferences, language, notifications, privacy, and data ownership
            </p>
          </div>

          <DisclaimerBanner compact />

          <div className="space-y-6">
            {/* Live AI Configuration */}
            <GeminiKeyManager />

            {/* Section 1: Language Preference */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-600" />
                <span>Language & Translation System</span>
              </h2>
              <p className="text-xs text-slate-500">
                Choose your primary language for medical summaries and navigation
              </p>
              <div className="pt-1">
                <LanguageSelector />
              </div>
            </div>

            {/* Section 2: Notifications Preferences (Section 32) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Notification Preferences</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Control which reminders and alerts you receive
                </p>
              </div>

              <div className="divide-y divide-slate-100 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Medicine Dose Reminders</h4>
                    <p className="text-[11px] text-slate-500">
                      Receive alerts at prescribed times (Morning, Afternoon, Evening, Night)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.medicineReminders}
                    onChange={() => toggleNotif('medicineReminders')}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Report Analysis Ready</h4>
                    <p className="text-[11px] text-slate-500">
                      Notify when AI processing completes on an uploaded medical document
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.reportCompleted}
                    onChange={() => toggleNotif('reportCompleted')}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Browser & Mobile Push</h4>
                    <p className="text-[11px] text-slate-500">
                      Display push banner alerts on device lockscreen
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.browserAlerts}
                    onChange={() => toggleNotif('browserAlerts')}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Email Summaries</h4>
                    <p className="text-[11px] text-slate-500">
                      Receive occasional weekly health digest summaries
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.emailAlerts}
                    onChange={() => toggleNotif('emailAlerts')}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Privacy & Data Controls (Section 36 & 50) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Privacy & Data Management</span>
                </h2>
                <p className="text-xs text-slate-500">
                  You own 100% of your personal medical records and can export or wipe them anytime
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                {/* Standard HL7 FHIR R4 Vault Export */}
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>HL7 FHIR R4 Clinical Vault</span>
                    </h4>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">
                      HL7 FHIR Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Export longitudinal EHR bundle (Patient, Observations, MedicationStatements, AllergyIntolerances) compatible with Epic, Cerner, Practo, and hospital systems.
                  </p>
                  <div className="text-[10px] font-bold text-slate-500 bg-white/70 p-2 rounded-xl border border-blue-100">
                    Scope: <span className="text-blue-900">{activeProfile.name} ({activeProfile.relationship})</span> &bull; {reports.length} Reports &bull; {medicines.length} Medicines
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={() => downloadFhirBundle({ profile: activeProfile, reports, medicines, user })}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export FHIR JSON (.json)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadClinicalCsv({ profile: activeProfile, reports, medicines, user })}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Export Excel / CSV (.csv)</span>
                    </button>
                  </div>
                </div>

                {/* Storage & Privacy Status Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">Health Data Storage</h4>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Encrypted
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      All laboratory values, drug prescriptions, and clinical audit records are stored locally with zero third-party telemetry.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
                    <span>Active Profile:</span>
                    <span className="font-bold text-slate-900">{activeProfile.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Danger Zone (Section 35 & 36) */}
            <div className="bg-rose-50/50 rounded-3xl border border-rose-200 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Danger Zone</span>
              </h2>
              <p className="text-xs text-rose-800 leading-relaxed">
                Permanently erase your account, all uploaded blood reports, prescription photos, and medicine history. This action cannot be undone.
              </p>

              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account Permanently</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Permanent Account Deletion</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your MediExplain AI account and all stored health data?
              <br />
              <strong className="text-rose-600">This action cannot be undone.</strong>
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await resetToCleanState();
                  router.push('/');
                }}
                className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
