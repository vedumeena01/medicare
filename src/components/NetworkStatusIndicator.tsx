'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  isOnline,
  initOfflineSyncListener,
  subscribeSyncQueue,
  processSyncQueue,
  SyncAction
} from '@/lib/offlineSync';
import { useLanguage } from '@/context/LanguageContext';

export default function NetworkStatusIndicator() {
  const { language } = useLanguage();
  const [online, setOnline] = useState<boolean>(true);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [pendingQueue, setPendingQueue] = useState<SyncAction[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    setOnline(isOnline());

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to real-time sync queue mutations across IndexedDB
    const unsubscribeQueue = subscribeSyncQueue((queue) => {
      setPendingQueue(queue);
    });

    // Listen for automatic online reconnect flush
    const unsubscribeListener = initOfflineSyncListener((syncedCount) => {
      const msg =
        language === 'hi'
          ? `इंटरनेट सक्रिय! ${syncedCount} ऑफ़लाइन कार्य सर्वर के साथ सिंक हो गए।`
          : `Online connection restored! ${syncedCount} offline item(s) synchronized.`;
      setSyncFeedback(msg);
      setTimeout(() => setSyncFeedback(null), 4000);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeQueue();
      unsubscribeListener();
    };
  }, [language]);

  const handleManualSync = async () => {
    if (!online || isSyncing) return;
    setIsSyncing(true);
    try {
      const { syncedCount } = await processSyncQueue();
      if (syncedCount > 0) {
        const msg =
          language === 'hi'
            ? `${syncedCount} ऑफ़लाइन रिकॉर्ड्स सिंक किए गए।`
            : `Manually synced ${syncedCount} offline record(s).`;
        setSyncFeedback(msg);
        setTimeout(() => setSyncFeedback(null), 3000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingCount = pendingQueue.length;

  if (online && !syncFeedback && pendingCount === 0) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label={online ? 'Network status online' : 'Network status offline'}
      className="fixed bottom-16 lg:bottom-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-3 duration-300"
    >
      {!online ? (
        <div className="bg-slate-900/95 text-white border border-amber-500/50 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-400">
                {language === 'hi' ? 'ऑफ़लाइन मोड सक्रिय' : 'Offline Mode Active'}
              </h4>
              <p className="text-[11px] text-slate-200">
                {language === 'hi'
                  ? 'कार्रवाइयां स्थानीय IndexedDB में सुरक्षित हैं।'
                  : 'Changes stored in local IndexedDB vault.'}
              </p>
            </div>
          </div>

          {pendingCount > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 shrink-0"
              aria-label={`${pendingCount} pending actions in offline queue`}
            >
              {pendingCount} {language === 'hi' ? 'लंबित' : 'queued'}
            </span>
          )}
        </div>
      ) : pendingCount > 0 ? (
        <div className="bg-slate-900/95 text-white border border-blue-500/40 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-300">
                {language === 'hi' ? 'ऑफ़लाइन कतार तैयार' : 'Offline Queue Ready'}
              </h4>
              <p className="text-[11px] text-slate-300">
                {pendingCount} {language === 'hi' ? 'रिकॉर्ड सिंक होने को तैयार हैं' : 'pending action(s) to sync'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {isSyncing ? (language === 'hi' ? 'सिंक...' : 'Syncing...') : (language === 'hi' ? 'सिंक करें' : 'Sync Now')}
          </button>
        </div>
      ) : syncFeedback ? (
        <div className="bg-emerald-950/95 text-white border border-emerald-500/50 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-emerald-300">
              {language === 'hi' ? 'डेटा सिंक्रनाइज़ हो गया' : 'Sync Complete'}
            </h4>
            <p className="text-[11px] text-slate-100">{syncFeedback}</p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
