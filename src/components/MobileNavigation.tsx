'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Pill, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MobileNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isInternal =
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

  if (!isInternal) return null;

  const navItems = [
    {
      label: t('navHome') || 'Home',
      href: '/dashboard',
      icon: Home,
      isActive: pathname === '/dashboard',
    },
    {
      label: t('navRecords') || 'Records',
      href: '/reports',
      icon: FileText,
      isActive:
        pathname.startsWith('/reports') ||
        pathname === '/history' ||
        pathname === '/analyze' ||
        pathname.startsWith('/consultations'),
    },
    {
      label: 'Medicines',
      href: '/medicines',
      icon: Pill,
      isActive: pathname.startsWith('/medicines') || pathname === '/schedules',
    },
    {
      label: t('navProfile') || 'Profile',
      href: '/profile',
      icon: User,
      isActive:
        pathname.startsWith('/profile') ||
        pathname === '/settings' ||
        pathname === '/family',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                item.isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform duration-200 ${
                  item.isActive ? 'bg-blue-50 scale-110' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    item.isActive ? 'text-blue-600 stroke-[2.5]' : 'stroke-2 text-slate-400'
                  }`}
                />
              </div>

              <span className="text-[11px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>

              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
