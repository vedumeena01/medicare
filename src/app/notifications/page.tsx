'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Pill,
  Calendar,
  FileText,
  Shield,
  CheckCheck,
  ChevronRight,
  Clock,
  Filter,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { NotificationItem } from '@/types';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const { t, language } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<'all' | 'medicine' | 'appointment' | 'report' | 'system'>('all');

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-5 h-5 text-amber-600" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'report':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'system':
      default:
        return <Shield className="w-5 h-5 text-purple-600" />;
    }
  };

  const getBgColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'medicine':
        return 'bg-amber-50 border-amber-200/60';
      case 'appointment':
        return 'bg-teal-50 border-teal-200/60';
      case 'report':
        return 'bg-blue-50 border-blue-200/60';
      case 'system':
      default:
        return 'bg-purple-50 border-purple-200/60';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'सूचनाएं व अलर्ट' : 'Notifications & Health Alerts'}
                </h1>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'दवा समय, आगामी डॉक्टर अपॉइंटमेंट्स और रिपोर्ट अपडेट्स'
                    : 'Real-time dosage reminders, appointment confirmations, and AI report updates'}
                </p>
              </div>
            </div>

            <button
              onClick={markAllNotificationsAsRead}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 transition"
            >
              <CheckCheck className="w-4 h-4 text-teal-600" />
              {language === 'hi' ? 'सभी को पढ़ा हुआ चिह्नित करें' : 'Mark all as read'}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2">
            {(
              [
                { id: 'all', label: language === 'hi' ? 'सभी' : 'All Alerts' },
                { id: 'medicine', label: language === 'hi' ? 'दवा रिमाइंडर' : 'Medicine Reminders' },
                { id: 'appointment', label: language === 'hi' ? 'अपॉइंटमेंट्स' : 'Appointments' },
                { id: 'report', label: language === 'hi' ? 'रिपोर्ट्स' : 'Report Updates' },
                { id: 'system', label: language === 'hi' ? 'सुरक्षा व सिस्टम' : 'System' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-sm">
                  {language === 'hi' ? 'कोई सूचना नहीं है' : 'No notifications found'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'इस श्रेणी में वर्तमान में कोई नए अलर्ट नहीं हैं।'
                    : 'You are all caught up in this category.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={`bg-white rounded-2xl border p-4 lg:p-5 shadow-sm transition hover:shadow-md flex items-start justify-between gap-4 cursor-pointer ${
                    !item.read ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${getBgColor(
                        item.type
                      )}`}
                    >
                      {getIcon(item.type)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {language === 'hi' && item.titleHi ? item.titleHi : item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {language === 'hi' && item.messageHi ? item.messageHi : item.message}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {item.actionUrl && (
                    <Link
                      href={item.actionUrl}
                      className="shrink-0 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-12">
            <DisclaimerBanner />
          </div>
        </main>
      </div>
    </div>
  );
}
