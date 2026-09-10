'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Languages,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Edit2,
  Check,
  Lock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const { user, updateUser } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Vedprakash',
    email: user?.email || 'vedprakash@example.com',
    mobile: user?.mobile || '+91 98765 43210',
    age: user?.age || 28,
    gender: (user?.gender || 'Male') as 'Male' | 'Female' | 'Other',
    bloodGroup: user?.bloodGroup || 'B+'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      queueMicrotask(() => {
        setFormData({
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          age: user.age,
          gender: user.gender,
          bloodGroup: user.bloodGroup || 'B+',
        });
      });
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                <span>{t('navProfile')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Personal medical identity and contact information
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Editing' : t('editProfile')}</span>
            </button>
          </div>

          <DisclaimerBanner compact />

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Avatar Row */}
            <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-500/20">
                {formData.name[0]}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900">{formData.name}</h2>
                <p className="text-xs text-slate-500">
                  Patient ID: #MED-94021 &bull; Account Active
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                    Blood Group: {formData.bloodGroup}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
                    Verified Mobile
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 disabled:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 disabled:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 disabled:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age & Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 28 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 disabled:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <select
                      disabled={!isEditing}
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 disabled:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Language */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Emergency Contact
                  </span>
                  <p className="text-xs text-slate-600">
                    {user?.emergencyContact?.name || 'Ramesh (Father)'} &bull;{' '}
                    {user?.emergencyContact?.phone || '+91 98765 11111'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Preferred Language
                  </span>
                  <p className="text-xs text-slate-600">
                    Currently set to:{' '}
                    <strong className="text-blue-600">
                      {language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
                    </strong>
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
