'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ChevronDown,
  Check,
  Plus,
  UserCheck,
  ShieldCheck,
  Activity,
  Heart
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CaregiverProfileSwitcher({ compact = false }: { compact?: boolean }) {
  const { familyMembers, activeProfile, activeMemberId, setActiveMemberId } = useApp();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (memberId: string | null) => {
    setActiveMemberId(memberId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-2xl border transition-all ${
          activeProfile.isSelf
            ? 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
            : 'bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
        } ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs font-semibold'}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-white text-[11px] ${
          activeProfile.isSelf ? 'bg-blue-600' : 'bg-indigo-600'
        }`}>
          {activeProfile.name[0]}
        </div>

        <div className="text-left leading-tight hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-bold truncate max-w-[120px]">
              {activeProfile.name}
            </span>
            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
              activeProfile.isSelf
                ? 'bg-blue-100 text-blue-700'
                : 'bg-indigo-200 text-indigo-800'
            }`}>
              {language === 'hi' && activeProfile.relationshipHi ? activeProfile.relationshipHi : activeProfile.relationship}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {language === 'hi' ? 'देखभालकर्ता मोड' : 'Managing Profile'} &bull; {activeProfile.bloodGroup}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-3xl bg-white shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
            <div>
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'hi' ? 'पारिवारिक देखभालकर्ता प्रोफाइल' : 'Caregiver Dependent Switcher'}</span>
              </span>
              <p className="text-[10px] text-slate-400">
                {language === 'hi' ? 'दवाएं व रिपोर्ट्स देखने के लिए सदस्य चुनें' : 'Switch active clinical records & emergency view'}
              </p>
            </div>
            <Link
              href="/family"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {language === 'hi' ? 'सभी प्रबंधित करें' : 'Manage'}
            </Link>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {/* Primary Self Profile */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left ${
                activeProfile.isSelf
                  ? 'bg-blue-50/80 border border-blue-200/80 text-blue-900'
                  : 'hover:bg-slate-50 border border-transparent text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  V
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Vedprakash (You)</span>
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.2 rounded-md">
                      {language === 'hi' ? 'स्वयं' : 'Self'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    28 Yrs &bull; Blood Group: B+ &bull; Penicillin (Mild)
                  </p>
                </div>
              </div>
              {activeProfile.isSelf && (
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
              )}
            </button>

            {/* Other Family Members */}
            {familyMembers
              .filter((m) => m.relation !== 'Self')
              .map((member) => {
                const isCurrentActive = activeMemberId === member.id;

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelect(member.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left ${
                      isCurrentActive
                        ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {member.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{member.name}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-700 font-extrabold px-1.5 py-0.2 rounded-md">
                            {language === 'hi' && member.relationHi ? member.relationHi : member.relation}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {member.age} Yrs &bull; {member.bloodGroup || 'Blood: B+'}
                          {member.healthConditions && member.healthConditions.length > 0 && (
                            <span> &bull; {member.healthConditions[0]}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isCurrentActive && (
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                  </button>
                );
              })}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100">
            <Link
              href="/family"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'hi' ? 'नया आश्रित सदस्य जोड़ें' : 'Add New Family Dependent'}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
