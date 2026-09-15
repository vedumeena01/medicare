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
  MessageSquare,
  Share2,
  Send,
  Smartphone
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { NotificationItem, NotificationChannel } from '@/types';
import { simulateChannelDispatch } from '@/lib/reminderNotification';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    medicines,
    activeProfile,
    addNotification
  } = useApp();
  const { t, language } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<'all' | 'medicine' | 'appointment' | 'report' | 'system'>('all');
  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | 'push' | 'whatsapp' | 'sms'>('all');
  const [simulatorMedId, setSimulatorMedId] = useState<string>(medicines[0]?.id || '');
  const [simulatorChannel, setSimulatorChannel] = useState<NotificationChannel>('whatsapp');
  const [testSentFeedback, setTestSentFeedback] = useState<string | null>(null);

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter !== 'all' && item.type !== activeFilter) return false;
    if (activeChannelFilter !== 'all') {
      const itemChannel = item.channel || 'push';
      if (itemChannel !== activeChannelFilter) return false;
    }
    return true;
  });

  const handleSimulateTestDispatch = () => {
    const targetMed = medicines.find((m) => m.id === simulatorMedId) || medicines[0];
    if (!targetMed) return;

    const dispatch = simulateChannelDispatch({
      medicine: targetMed,
      patientName: activeProfile.name,
      channel: simulatorChannel,
      recipientPhone: activeProfile.emergencyContact?.phone || '+91 98765 11111',
      lang: language === 'hi' ? 'hi' : 'en'
    });

    addNotification(dispatch.notification);
    setTestSentFeedback(
      language === 'hi'
        ? `${simulatorChannel.toUpperCase()} सिमुलेशन अलर्ट सफलतापूर्वक भेजा गया!`
        : `${simulatorChannel.toUpperCase()} reminder simulated and added to feed!`
    );
    setTimeout(() => setTestSentFeedback(null), 4000);
  };

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
                  {language === 'hi' ? 'सूचनाएं व मल्टी-चैनल अलर्ट' : 'Notifications & Multi-Channel Alerts'}
                </h1>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'दवा समय, व्हाट्सएप/एसएमएस प्रेषण इतिहास, और डॉक्टर अपॉइंटमेंट्स'
                    : 'Real-time dosage reminders, WhatsApp/SMS dispatch audit logs, and AI report updates'}
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

          {/* Quick Interactive Multi-Channel Dispatch Simulator Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Simulator
                  </span>
                  <h3 className="text-sm font-bold">Multi-Channel Reminder Test Dispatcher</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Test instant alerts for active dependent ({activeProfile.name}) across WhatsApp, SMS, or Push channels.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {medicines.length > 0 && (
                  <select
                    value={simulatorMedId || medicines[0]?.id}
                    onChange={(e) => setSimulatorMedId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-100 text-xs border border-slate-700 focus:outline-none"
                  >
                    {medicines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.scheduledTime})
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={simulatorChannel}
                  onChange={(e) => setSimulatorChannel(e.target.value as NotificationChannel)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-100 text-xs border border-slate-700 focus:outline-none"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS Gateway</option>
                  <option value="push">In-App Push</option>
                </select>

                <button
                  type="button"
                  onClick={handleSimulateTestDispatch}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Alert</span>
                </button>
              </div>
            </div>

            {testSentFeedback && (
              <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 font-semibold animate-in fade-in">
                ✓ {testSentFeedback}
              </div>
            )}
          </div>

          {/* Filter Tabs (Category & Delivery Channel) */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Category:</span>
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    activeFilter === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Delivery Channel Filters */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Channel:</span>
              {(
                [
                  { id: 'all', label: 'All Channels', icon: Filter },
                  { id: 'whatsapp', label: 'WhatsApp', icon: Share2 },
                  { id: 'sms', label: 'SMS Gateway', icon: MessageSquare },
                  { id: 'push', label: 'In-App Push', icon: Smartphone },
                ] as const
              ).map((channelTab) => {
                const Icon = channelTab.icon;
                return (
                  <button
                    key={channelTab.id}
                    onClick={() => setActiveChannelFilter(channelTab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                      activeChannelFilter === channelTab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{channelTab.label}</span>
                  </button>
                );
              })}
            </div>
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
                    ? 'इस श्रेणी या चैनल में वर्तमान में कोई नए अलर्ट नहीं हैं।'
                    : 'You are all caught up in this category or channel.'}
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
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {language === 'hi' && item.titleHi ? item.titleHi : item.title}
                        </h4>

                        {/* Channel Badge */}
                        {item.channel === 'whatsapp' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <Share2 className="w-2.5 h-2.5" />
                            WhatsApp
                          </span>
                        ) : item.channel === 'sms' ? (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5" />
                            SMS Gateway
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Smartphone className="w-2.5 h-2.5" />
                            In-App Push
                          </span>
                        )}

                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {language === 'hi' && item.messageHi ? item.messageHi : item.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.timestamp}</span>
                        </span>
                        {item.recipientName && (
                          <span className="text-slate-500">
                            Recipient: <strong className="text-slate-700">{item.recipientName}</strong>
                          </span>
                        )}
                        {item.deliveryStatus && (
                          <span className="text-emerald-600 font-semibold">
                            ✓ {item.deliveryStatus}
                          </span>
                        )}
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
