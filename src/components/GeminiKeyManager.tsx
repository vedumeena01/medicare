'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, ExternalLink, Loader2, Trash2 } from 'lucide-react';

export default function GeminiKeyManager() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/config/gemini');
      const data = await res.json();
      if (data.success) {
        setHasKey(Boolean(data.hasKey));
        setMaskedKey(data.maskedKey || '');
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      checkStatus();
    });
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setVerifying(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/config/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: inputKey.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setHasKey(true);
        setMaskedKey(data.maskedKey);
        setInputKey('');
        setIsEditing(false);
        setStatusMessage({
          type: 'success',
          text: '✅ Google Gemini 1.5 Flash Connected! Multimodal document vision & live medical assistant are now fully active.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to verify API key with Google servers.',
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: (err as Error)?.message || 'Network error verifying API key.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveKey = async () => {
    if (!confirm('Are you sure you want to disconnect Google Gemini AI? The app will revert to heuristic fallback.')) {
      return;
    }

    try {
      setLoading(true);
      await fetch('/api/config/gemini', { method: 'DELETE' });
      setHasKey(false);
      setMaskedKey('');
      setIsEditing(false);
      setStatusMessage({
        type: 'success',
        text: 'Google Gemini API key removed.',
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Live AI Vision & Assistant Engine (Google Gemini)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Powers multimodal OCR medical report extraction, medicine box vision, and conversational health assistant
          </p>
        </div>

        {/* Live Status Badge */}
        {!loading && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {hasKey ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live AI Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Fallback Mode (Key Required)</span>
              </span>
            )}
          </div>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{statusMessage.text}</span>
        </div>
      )}

      {hasKey && !isEditing ? (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Active Gemini API Key:</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-slate-800">
                {maskedKey}
              </code>
            </div>
            <p className="text-[11px] text-slate-500">
              Live multimodal 1.5 Flash extraction is enabled for all report uploads, medicine scans, and assistant chats.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              Update Key
            </button>
            <button
              type="button"
              onClick={handleRemoveKey}
              className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              title="Disconnect API Key"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveKey} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Enter Google Gemini API Key:</span>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600 text-[11px]"
                >
                  Cancel
                </button>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              <span>Get Free Gemini API Key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              disabled={verifying || !inputKey.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying with Google...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Connect Live Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
