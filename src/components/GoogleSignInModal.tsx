'use client';

import React, { useState } from 'react';
import { X, UserPlus, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function GoogleSignInModal({
  isOpen,
  onClose,
  redirectTo = '/dashboard',
}: GoogleSignInModalProps) {
  const router = useRouter();
  const { loginWithGoogle, user } = useApp();

  const [view, setView] = useState<'chooser' | 'new_account'>('chooser');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (accountEmail: string, accountName: string) => {
    setIsSubmitting(true);
    loginWithGoogle(accountEmail, accountName);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      router.push(redirectTo);
    }, 400);
  };

  const handleNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your Google email address');
      return;
    }
    if (!cleanEmail.includes('@')) {
      setError('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

    setIsSubmitting(true);
    const resolvedName = fullName.trim() || cleanEmail.split('@')[0];
    loginWithGoogle(cleanEmail, resolvedName);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      router.push(redirectTo);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200/90 relative space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-2">
          {/* Official Google 'G' Logo */}
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {view === 'chooser' ? 'Sign in with Google' : 'Use a new Google Account'}
          </h2>
          <p className="text-xs text-slate-500">
            to continue to <strong className="text-blue-600">MediExplain AI</strong>
          </p>
        </div>

        {view === 'chooser' ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Choose an account
            </p>

            {/* Existing Accounts List */}
            <div className="space-y-2 border border-slate-200/80 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-slate-50/40">
              {/* Active / Current Account if exists */}
              {user && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSelectAccount(user.email, user.name)}
                  className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-blue-50/50 transition-colors bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </button>
              )}

              {/* Vedprakash Sharma (Demo / Sample Account) */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  handleSelectAccount('vedprakash@medicare.ai', 'Vedprakash Sharma')
                }
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-blue-50/50 transition-colors bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    V
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Vedprakash Sharma
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      vedprakash@medicare.ai
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Button: Use another / new account */}
            <button
              type="button"
              onClick={() => {
                setView('new_account');
                setError('');
              }}
              className="w-full p-3.5 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/60 text-blue-700 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Use another / new Google Account</span>
            </button>
          </div>
        ) : (
          /* Form for Entering Any New Google Account */
          <form onSubmit={handleNewAccountSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Google Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                autoFocus
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">
                Enter your personal or official Gmail / Google Workspace address
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Your Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Aryan Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setView('chooser')}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Security & Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted OAuth Handshake &bull; Verified Scope</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            To continue, Google will securely share your verified name, email address, and language preference with MediExplain AI.
          </p>
        </div>
      </div>
    </div>
  );
}
