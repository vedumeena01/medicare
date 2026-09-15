'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  Menu,
  X,
  Search,
  Bell,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  FileText,
  Pill,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, isAuthenticated, setIsSearchOpen, unreadNotificationsCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardView =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/analyze') ||
    pathname.startsWith('/medicines') ||
    pathname.startsWith('/schedules') ||
    pathname.startsWith('/family') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/consultations') ||
    pathname.startsWith('/assistant') ||
    pathname.startsWith('/notifications');

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                MediExplain
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                AI
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Healthcare Assistant
            </span>
          </div>
        </Link>

        {/* Desktop Links - When in Public/Landing view */}
        {!isDashboardView ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              {t('navHome')}
            </Link>
            <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">
              {t('navHowItWorks')}
            </Link>
            <Link href="/#features" className="hover:text-blue-600 transition-colors">
              {t('navFeatures')}
            </Link>
            <Link href="/#faq" className="hover:text-blue-600 transition-colors">
              {t('navFaq')}
            </Link>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 text-xs font-medium transition-all w-64 border border-slate-200/60"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{t('searchPlaceholder')}</span>
              <kbd className="ml-auto text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          <LanguageSelector />

          {/* Search button on mobile or dashboard */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Emergency Medical ID (ICE) Quick Access */}
          <Link
            href="/emergency"
            title="Emergency Medical Card (ICE)"
            aria-label="In Case of Emergency Medical ID Card"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">ICE</span>
          </Link>

          {/* Notifications Hub Link with Badge */}
          <Link
            href="/notifications"
            title="Notifications & Alerts"
            className="relative p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[9px] font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>


          {!isDashboardView ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                {t('navLogin')}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                >
                  <span>Dashboard &rarr;</span>
                </Link>
              )}
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/analyze"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('uploadReport')}</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-800"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'V'}
                </div>
                <span className="hidden sm:inline font-semibold">{user?.name || 'Vedprakash'}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                {t('navLogin')}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <Link
              href="/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold flex items-center gap-2 border border-purple-100"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{t('navAssistant')}</span>
            </Link>
            <Link
              href="/appointments"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-teal-50 text-teal-700 text-xs font-semibold flex items-center gap-2 border border-teal-100"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{t('navAppointments')}</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-blue-50/70 text-blue-700 text-xs font-semibold flex items-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              <span>{t('navDashboard')}</span>
            </Link>
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-indigo-50/70 text-indigo-700 text-xs font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('uploadReport')}</span>
            </Link>
            <Link
              href="/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('navReports')}</span>
            </Link>
            <Link
              href="/schedules"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('navSchedules')}</span>
            </Link>
          </div>

          <div className="space-y-1.5 pt-1 text-sm font-medium text-slate-700">
            <Link
              href="/consultations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span>{t('navConsultations')}</span>
            </Link>
            <Link
              href="/medicines"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>{t('navMedicines')}</span>
            </Link>
            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span>{t('navNotifications')}</span>
            </Link>
            <Link
              href="/family"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <UserIcon className="w-4 h-4 text-blue-600" />
              <span>{t('navFamily')}</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <span>{t('navProfile')}</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <span>{t('navSettings')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
