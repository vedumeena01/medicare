'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { login } = useApp();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const canResend = countdown <= 0;
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    setError('');

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };


  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError(
        language === 'hi'
          ? 'कृपया 6-अंकीय सत्यापन कोड पूरा दर्ज करें।'
          : 'Please enter the complete 6-digit verification code.'
      );
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);
      login('vedprakash@medicare.ai');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 900);
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              M
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Medi<span className="text-blue-600">Care</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'hi' ? 'सुरक्षा सत्यापन (OTP)' : 'Two-Factor Verification'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            {language === 'hi'
              ? 'आपके पंजीकृत मोबाइल नंबर (+91 98765 43210) पर भेजा गया 6-अंकीय कोड दर्ज करें'
              : 'Enter the 6-digit security code sent to your mobile (+91 98765 43210)'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 relative overflow-hidden">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>

          {success ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'hi' ? 'सत्यापन सफल!' : 'Identity Verified!'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'डैशबोर्ड पर निर्देशित किया जा रहा है...'
                  : 'Redirecting to your patient dashboard...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium">
                  {error}
                </div>
              )}

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 shadow-sm"
                  />
                ))}
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'hi' ? 'कोड सत्यापित करें' : 'Verify & Sign In'}</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center pt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {language === 'hi' ? 'नया OTP भेजें' : 'Resend Verification Code'}
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    {language === 'hi'
                      ? `कोड दोबारा भेजें ${countdown} सेकंड में`
                      : `Resend code in ${countdown}s`}
                  </p>
                )}
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              {language === 'hi' ? 'लॉगिन पेज पर वापस जाएं' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
