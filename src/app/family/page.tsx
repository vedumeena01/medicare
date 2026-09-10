'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  HeartPulse,
  User,
  ChevronRight,
  ShieldCheck,
  X,
  FileText
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function FamilyPage() {
  const { familyMembers, addFamilyMember, reports } = useApp();
  const { t, language } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: 'Father',
    age: '50',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    condition: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;

    addFamilyMember({
      name: newMember.name,
      relation: newMember.relation,
      age: parseInt(newMember.age) || 40,
      gender: newMember.gender,
      healthConditions: newMember.condition ? [newMember.condition] : []
    });

    setShowAddModal(false);
    setNewMember({
      name: '',
      relation: 'Father',
      age: '50',
      gender: 'Male',
      condition: ''
    });
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
                <Users className="w-6 h-6 text-blue-600" />
                <span>{t('navFamily')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Organize and monitor health profiles and reports for your entire family
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addMember')}</span>
            </button>
          </div>

          <DisclaimerBanner compact />

          {/* Family Profiles List matching Mockup 16 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Profiles in Your Family Group ({familyMembers.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {familyMembers.map(member => {
                const memberReports = reports.filter(r => r.familyMemberId === member.id);

                return (
                  <div
                    key={member.id}
                    className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-3 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        {member.name[0]}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {language === 'hi' && member.relationHi
                              ? member.relationHi
                              : member.relation}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {member.age} years old &bull; {member.gender}
                        </p>
                        {member.healthConditions && member.healthConditions.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {member.healthConditions.map((cond, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.2 rounded-md"
                              >
                                {cond}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                        {memberReports.length > 0
                          ? `${memberReports.length} report attached`
                          : 'Linked to primary'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">{t('addMember')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Ramesh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={newMember.relation}
                    onChange={e => setNewMember({ ...newMember, relation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newMember.age}
                    onChange={e => setNewMember({ ...newMember, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={newMember.gender}
                  onChange={e => setNewMember({ ...newMember, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Known Health Condition (Optional)
                </label>
                <input
                  type="text"
                  value={newMember.condition}
                  onChange={e => setNewMember({ ...newMember, condition: e.target.value })}
                  placeholder="e.g. Hypertension, Thyroid"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
