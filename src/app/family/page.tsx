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
  FileText,
  ShieldAlert,
  CheckCircle2,
  Check,
  ArrowRight,
  Pill,
  Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function FamilyPage() {
  const {
    familyMembers,
    addFamilyMember,
    reports,
    medicines,
    activeMemberId,
    setActiveMemberId,
    activeProfile
  } = useApp();
  const { t, language } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: 'Father',
    relationHi: 'पिताजी',
    age: '50',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    condition: '',
    bloodGroup: 'B+',
    allergies: '',
    emergencyPhone: '+91 98765 43210'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;

    const relationHiMap: Record<string, string> = {
      Father: 'पिताजी',
      Mother: 'माताजी',
      Spouse: 'जीवनसाथी',
      Son: 'बेटा',
      Daughter: 'बेटी',
      Sister: 'बहन',
      Brother: 'भाई',
      Other: 'अन्य'
    };

    addFamilyMember({
      name: newMember.name,
      relation: newMember.relation,
      relationHi: relationHiMap[newMember.relation] || newMember.relation,
      age: parseInt(newMember.age) || 40,
      gender: newMember.gender,
      healthConditions: newMember.condition ? [newMember.condition] : [],
      bloodGroup: newMember.bloodGroup,
      allergies: newMember.allergies ? newMember.allergies.split(',').map(s => s.trim()) : [],
      emergencyContact: {
        name: 'Primary Caregiver',
        phone: newMember.emergencyPhone,
        relation: 'Caregiver'
      }
    });

    setShowAddModal(false);
    setNewMember({
      name: '',
      relation: 'Father',
      relationHi: 'पिताजी',
      age: '50',
      gender: 'Male',
      condition: '',
      bloodGroup: 'B+',
      allergies: '',
      emergencyPhone: '+91 98765 43210'
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
                {language === 'hi'
                  ? 'अपने पूरे परिवार के स्वास्थ्य प्रोफाइल, दवाएं और आपातकालीन कार्ड प्रबंधित करें'
                  : 'Multi-profile caregiver management for elderly parents, children, and dependents'}
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

          {/* Active Caregiver Status Callout Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-xl border border-white/20">
                {activeProfile.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white">
                    {language === 'hi' ? 'सक्रिय देखभालकर्ता दृश्य' : 'ACTIVE CAREGIVER CONTEXT'}
                  </span>
                  <span className="text-xs font-bold text-blue-100">
                    &bull; Blood: {activeProfile.bloodGroup}
                  </span>
                </div>
                <h2 className="text-lg font-black tracking-tight mt-0.5">
                  {activeProfile.name} {activeProfile.isSelf ? '' : `(${activeProfile.relationship})`}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/emergency"
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 backdrop-blur-sm transition-all inline-flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-300" />
                <span>{language === 'hi' ? 'आपातकालीन ICE कार्ड देखें' : 'View ICE Card'}</span>
              </Link>

              {!activeProfile.isSelf && (
                <button
                  type="button"
                  onClick={() => setActiveMemberId(null)}
                  className="px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-extrabold shadow-sm transition-all"
                >
                  {language === 'hi' ? 'स्वयं (Self) पर वापस जाएं' : 'Switch Back to Self'}
                </button>
              )}
            </div>
          </div>

          {/* Family Profiles List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'पारिवारिक आश्रित प्रोफाइल' : 'Family Dependent Profiles'} ({familyMembers.length})
              </h2>
              <span className="text-xs text-slate-400">
                {language === 'hi' ? 'क्लिक करके प्रोफाइल बदलें' : 'Select a member to switch active records'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyMembers.map((member) => {
                const isCurrentActive =
                  (activeMemberId === member.id) ||
                  (member.relation === 'Self' && (!activeMemberId || activeMemberId === 'self'));

                const memberReports = reports.filter((r) => r.familyMemberId === member.id);

                return (
                  <div
                    key={member.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      isCurrentActive
                        ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-lg shadow-sm ${
                          member.relation === 'Self'
                            ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                            : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                        }`}>
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                              {language === 'hi' && member.relationHi ? member.relationHi : member.relation}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {member.age} Yrs &bull; {member.gender} &bull; <span className="font-bold text-rose-600">Blood: {member.bloodGroup || 'B+'}</span>
                          </p>
                        </div>
                      </div>

                      {isCurrentActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveMemberId(member.relation === 'Self' ? null : member.id)}
                          className="text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all"
                        >
                          Switch View
                        </button>
                      )}
                    </div>

                    {/* Allergies & Conditions Pill Cluster */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      {member.allergies && member.allergies.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-amber-800">Allergies:</span>
                          {member.allergies.map((a, i) => (
                            <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.2 rounded-md">
                              ⚠️ {a}
                            </span>
                          ))}
                        </div>
                      )}

                      {member.healthConditions && member.healthConditions.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Conditions:</span>
                          {member.healthConditions.map((cond, i) => (
                            <span key={i} className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.2 rounded-md">
                              {cond}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                      <span className="text-slate-400 font-medium text-[11px]">
                        {memberReports.length > 0 ? `${memberReports.length} Clinical Reports` : '0 Attached Reports'}
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/emergency"
                          onClick={() => setActiveMemberId(member.relation === 'Self' ? null : member.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>ICE Card</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setActiveMemberId(member.relation === 'Self' ? null : member.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t('addMember')}</h3>
                <p className="text-xs text-slate-400">Add an elderly parent, spouse, or child to your caregiver account</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={newMember.relation}
                    onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Father">Father (पिताजी)</option>
                    <option value="Mother">Mother (माताजी)</option>
                    <option value="Spouse">Spouse (जीवनसाथी)</option>
                    <option value="Son">Son (बेटा)</option>
                    <option value="Daughter">Daughter (बेटी)</option>
                    <option value="Sister">Sister (बहन)</option>
                    <option value="Brother">Brother (भाई)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={newMember.gender}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        gender: e.target.value as 'Male' | 'Female' | 'Other',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group (Emergency) *
                  </label>
                  <select
                    value={newMember.bloodGroup}
                    onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold text-rose-700"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Known Drug Allergies (Optional)
                </label>
                <input
                  type="text"
                  value={newMember.allergies}
                  onChange={(e) => setNewMember({ ...newMember, allergies: e.target.value })}
                  placeholder="e.g. Sulfa drugs, Penicillin"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Known Chronic Conditions (Optional)
                </label>
                <input
                  type="text"
                  value={newMember.condition}
                  onChange={(e) => setNewMember({ ...newMember, condition: e.target.value })}
                  placeholder="e.g. Hypertension, Diabetes Type 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  Save Dependent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
