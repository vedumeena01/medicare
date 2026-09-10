'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ClipboardList,
  FileCheck,
  Pill,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import GoogleSignInModal from '@/components/GoogleSignInModal';

export default function RegisterPage() {
  const router = useRouter();
  const { login, updateUser } = useApp();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreed: true
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!formData.agreed) {
      setError('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setError('');
    setSuccess(true);

    login(formData.email);
    updateUser({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      age: 28,
      gender: 'Male'
    });

    setTimeout(() => {
      router.push('/verify-otp');
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setShowGoogleModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/50 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              MediExplain <span className="text-blue-600">AI</span>
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            {t('navLogin')}
          </Link>
        </div>
      </div>

      {/* Main Center Registration Card (Matching Mockup 2 faithfully) */}
      <div className="max-w-4xl w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid lg:grid-cols-12">
          {/* Left Side: Medical Graphic / Hero Card (Mockup 2) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                <Sparkles className="w-3 h-3" />
                <span>Smart Health Platform</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                Empowering You with Clear Health Knowledge.
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                Join thousands of patients who upload lab reports, understand complex findings, and manage family medicines with confidence.
              </p>
            </div>

            {/* Medical Illustration Graphic Box matching Mockup 2 */}
            <div className="my-8 py-6 px-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-md shrink-0">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Digital Health Record</h4>
                  <p className="text-[11px] text-blue-100">Encrypted & Private Storage</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-[11px] text-blue-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>HIPAA Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dose Alarms</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-blue-100/90 relative z-10 flex items-center justify-between">
              <span>English & हिन्दी Support</span>
              <span>100% Free to start</span>
            </div>
          </div>

          {/* Right Side: Form Container matching Mockup 2 */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs text-slate-500">
                Start your journey to better health
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Account created successfully! Redirecting to Dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Vedprakash"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vedprakash@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="agreeCheckbox"
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 mt-0.5"
                />
                <label htmlFor="agreeCheckbox" className="ml-2 block text-xs text-slate-600 leading-tight">
                  I agree to the{' '}
                  <span className="text-blue-600 font-semibold underline cursor-pointer">
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span className="text-blue-600 font-semibold underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>

              {/* Create Account Button matching Mockup 2 */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Divider "or" */}
            <div className="relative flex items-center justify-center pt-1">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">
                or
              </span>
            </div>

            {/* Google Login Button matching Mockup 2 */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            {/* Footer switch to Login */}
            <div className="text-center text-xs text-slate-600 pt-1">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-slate-400 pt-4">
        © 2026 MediExplain AI (MediCare AI). Educational Medical Simplification Tool.
      </div>

      {/* Google Sign In Modal */}
      <GoogleSignInModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        redirectTo="/dashboard"
      />
    </div>
  );
}
