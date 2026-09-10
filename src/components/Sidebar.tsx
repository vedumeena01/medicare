'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Pill,
  CalendarCheck,
  Users,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Calendar,
  ClipboardList,
  Sparkles,
  Bell,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { logout, user, unreadNotificationsCount } = useApp();

  const mainNavItems = [
    {
      label: t('navDashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: t('navAssistant'),
      href: '/assistant',
      icon: Sparkles,
      active: pathname === '/assistant',
      highlight: true,
    },
    {
      label: t('navAppointments'),
      href: '/appointments',
      icon: Calendar,
      active: pathname.startsWith('/appointments'),
    },
    {
      label: t('navConsultations'),
      href: '/consultations',
      icon: ClipboardList,
      active: pathname.startsWith('/consultations'),
    },
    {
      label: t('navAnalyze'),
      href: '/analyze',
      icon: UploadCloud,
      active: pathname === '/analyze',
    },
    {
      label: t('navReports'),
      href: '/reports',
      icon: FileText,
      active: pathname.startsWith('/reports') || pathname === '/history',
    },
    {
      label: t('navMedicines'),
      href: '/medicines',
      icon: Pill,
      active: pathname.startsWith('/medicines'),
    },
    {
      label: t('navSchedules'),
      href: '/schedules',
      icon: CalendarCheck,
      active: pathname === '/schedules',
    },
    {
      label: t('navInteractions'),
      href: '/medicines/interactions',
      icon: ShieldAlert,
      active: pathname === '/medicines/interactions',
    },
    {
      label: t('navNotifications'),
      href: '/notifications',
      icon: Bell,
      active: pathname === '/notifications',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    {
      label: t('navFamily'),
      href: '/family',
      icon: Users,
      active: pathname === '/family',
    },
    {
      label: t('navProfile'),
      href: '/profile',
      icon: User,
      active: pathname === '/profile',
    },
    {
      label: t('navSettings'),
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 justify-between shrink-0">
      <div className="space-y-4">
        {/* User Card Pill */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/30">
            {user?.name ? user.name[0] : 'V'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {user?.name || 'Vedprakash'}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.email || 'vedprakash@example.com'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : item.highlight
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      item.active
                        ? 'text-white'
                        : item.highlight
                        ? 'text-purple-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.active ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Safety & Privacy</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            HIPAA aligned data segregation. No clinical diagnosis made.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <Link
            href="/#faq"
            className="flex items-center gap-1.5 hover:text-slate-800 transition-colors p-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors p-1 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('navLogout')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
