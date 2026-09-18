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
  Fingerprint,
  KeyRound,
  CheckCircle2,
  Link2,
  Unlink,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Lock,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import LanguageSelector from '@/components/LanguageSelector';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import GeminiKeyManager from '@/components/GeminiKeyManager';
import { downloadFhirBundle, downloadClinicalCsv } from '@/lib/fhirExport';
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  registerPasskey,
  verifyPasskey,
  isPasskeyRegistered,
  clearPasskeys,
  getStoredPasskeys,
} from '@/lib/webauthn';
import {
  generateSmartLaunchUrl,
  exchangeSmartAuthCode,
  getStoredSmartSession,
  clearSmartSession,
  isSmartConnected,
  SmartTokenResponse,
} from '@/lib/smartFhirAuth';

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

  const [hasPasskey, setHasPasskey] = useState(false);
  const [passkeyFeedback, setPasskeyFeedback] = useState<string | null>(null);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [platformBiometricsAvailable, setPlatformBiometricsAvailable] = useState(false);

  const [smartSession, setSmartSession] = useState<SmartTokenResponse | null>(null);
  const [showSmartModal, setShowSmartModal] = useState(false);
  const [smartLaunchDetails, setSmartLaunchDetails] = useState<{ authUrl: string; codeVerifier: string; state: string } | null>(null);
  const [isSmartLoading, setIsSmartLoading] = useState(false);

  useEffect(() => {
    setHasPasskey(isPasskeyRegistered());
    setSmartSession(getStoredSmartSession());
    isPlatformAuthenticatorAvailable().then((avail) => {
      setPlatformBiometricsAvailable(avail);
    });
  }, []);

  const handleRegisterPasskey = async () => {
    setIsPasskeyLoading(true);
    setPasskeyFeedback(null);
    try {
      const res = await registerPasskey({
        id: activeProfile.id,
        name: activeProfile.name,
        email: user?.email || `${activeProfile.name.toLowerCase()}@medicare.ai`,
      });
      if (res.success) {
        setHasPasskey(true);
        setPasskeyFeedback(
          res.isSimulated
            ? 'Passkey registered successfully! (Hardware-backed simulation active)'
            : 'Passkey registered successfully with platform biometrics!'
        );
      } else {
        setPasskeyFeedback(res.error || 'Failed to register passkey');
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleVerifyPasskey = async () => {
    setIsPasskeyLoading(true);
    setPasskeyFeedback(null);
    try {
      const res = await verifyPasskey();
      if (res.success) {
        setPasskeyFeedback('Biometric authentication verified! Touch ID / Face ID / Windows Hello confirmed.');
      } else {
        setPasskeyFeedback(res.error || 'Biometric verification failed');
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleClearPasskeys = () => {
    clearPasskeys();
    setHasPasskey(false);
    setPasskeyFeedback('Registered passkeys removed from this device.');
  };

  const handleInitiateSmartLaunch = async () => {
    setIsSmartLoading(true);
    try {
      const details = await generateSmartLaunchUrl({
        issuerUrl: 'https://launch.smarthealthit.org/v/r4/fhir',
        clientId: 'mediexplain-smart-client-app',
      });
      setSmartLaunchDetails(details);
      setShowSmartModal(true);
    } finally {
      setIsSmartLoading(false);
    }
  };

  const handleCompleteSmartExchange = async () => {
    setIsSmartLoading(true);
    try {
      const token = await exchangeSmartAuthCode('demo-smart-auth-code-12345');
      setSmartSession(token);
      setShowSmartModal(false);
    } finally {
      setIsSmartLoading(false);
    }
  };

  const handleDisconnectSmart = () => {
    clearSmartSession();
    setSmartSession(null);
  };

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

            {/* Section 3: WebAuthn & Passkey Biometrics */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    <span>Passkey & Biometric Authentication (WebAuthn / FIDO2)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Use Touch ID, Face ID, or Windows Hello for instant, passwordless access to your health vault and emergency card
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      hasPasskey
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {hasPasskey ? 'Passkey Enrolled (Active)' : 'No Passkey Configured'}
                  </span>
                </div>
              </div>

              {passkeyFeedback && (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{passkeyFeedback}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <KeyRound className="w-4 h-4 text-slate-600" />
                    <span>Device Biometrics Status</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {platformBiometricsAvailable
                      ? '✓ Native platform authenticator detected (Touch ID / Face ID / Windows Hello).'
                      : 'Hardware-backed WebAuthn simulation active for this browser session.'}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleRegisterPasskey}
                      disabled={isPasskeyLoading}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span>{hasPasskey ? 'Re-enroll / Update Passkey' : 'Register New Passkey'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Lock className="w-4 h-4 text-slate-600" />
                      <span>Biometric Vault Verification</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Test your biometric passkey to verify seamless unlock of your Emergency Medical ID and EHR records.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleVerifyPasskey}
                      disabled={isPasskeyLoading || !hasPasskey}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs transition shadow-xs flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Test Biometric Unlock</span>
                    </button>
                    {hasPasskey && (
                      <button
                        type="button"
                        onClick={handleClearPasskeys}
                        className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: SMART-on-FHIR Hospital EMR Gateway */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-indigo-600" />
                    <span>SMART-on-FHIR EMR Interoperability Gateway</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Connect directly to hospital electronic health record systems (Epic, Cerner, SmartHealthIT) via HL7 SMART App Launch
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      smartSession
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {smartSession ? 'EHR Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              {smartSession ? (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-950">Active FHIR Patient Context</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectSmart}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Disconnect EMR</span>
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">FHIR Server</span>
                      <span className="font-bold text-slate-800 truncate block">{smartSession.serverUrl}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Patient Context</span>
                      <span className="font-bold text-slate-800">{smartSession.patient}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Scopes Granted</span>
                      <span className="font-bold text-emerald-600">Patient Read / Observations</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    MediExplain AI supports the standard HL7 SMART App Launch protocol with OAuth2 Proof Key for Code Exchange (PKCE). 
                    Authorize secure one-way retrieval of laboratory results, medications, and vitals directly from hospital FHIR R4 endpoints.
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={handleInitiateSmartLaunch}
                      disabled={isSmartLoading}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Connect Hospital EMR (SMART on FHIR)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Danger Zone (Section 35 & 36) */}
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

      {/* SMART on FHIR Launch Modal */}
      {showSmartModal && smartLaunchDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">SMART on FHIR OAuth2 Authorization</h3>
                  <p className="text-[11px] text-slate-500">Hospital EHR Linkage via PKCE S256</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSmartModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  HL7 Authorization Endpoint
                </span>
                <span className="font-mono text-[11px] text-indigo-700 break-all">
                  {smartLaunchDetails.authUrl.split('?')[0]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">PKCE Challenge</span>
                  <span className="font-mono text-slate-700">Method: S256 (SHA-256)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">State Token</span>
                  <span className="font-mono text-slate-700 truncate block">{smartLaunchDetails.state}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                In a live hospital deployment, this redirects the patient to the hospital patient portal (e.g. MyChart) to authorize access. For sandbox evaluation, click below to simulate an approved token grant.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSmartModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteSmartExchange}
                disabled={isSmartLoading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simulate Token Grant & Connect</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
