'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Pill,
  Trash2,
  Bell
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Medicine, MedicineFrequency, TimeSlot } from '@/types';

export default function MedicineSchedulePage() {
  const {
    medicines,
    addMedicine,
    updateMedicineStatus,
    deleteMedicine,
    triggerDemoReminder
  } = useApp();
  const { t, language } = useLanguage();

  const [viewMode, setViewMode] = useState<'today' | 'calendar' | 'all'>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const totalDaysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInCurrentMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const [selectedDate, setSelectedDate] = useState<number>(currentDay);

  // Form state for adding new medicine (Section 29)
  const [newMed, setNewMed] = useState<{
    name: string;
    strength: string;
    form: Medicine['form'];
    dosageInstruction: string;
    frequency: MedicineFrequency;
    timeSlot: TimeSlot;
    scheduledTime: string;
    startDate: string;
    notes: string;
  }>({
    name: '',
    strength: '',
    form: 'Tablet',
    dosageInstruction: '',
    frequency: 'Once daily',
    timeSlot: 'Morning',
    scheduledTime: '09:00 AM',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;

    addMedicine({
      name: newMed.name,
      strength: newMed.strength || 'Standard Dose',
      form: newMed.form,
      dosageInstruction: newMed.dosageInstruction || '1 tablet as directed by physician',
      frequency: newMed.frequency,
      timeSlot: newMed.timeSlot,
      scheduledTime: newMed.scheduledTime,
      startDate: newMed.startDate,
      status: 'Upcoming',
      description: 'Prescribed medication added to schedule.',
      commonUses: ['Prescribed medical therapy'],
      precautions: ['Take strictly as advised by your physician'],
      sideEffects: ['Consult physician if unusual symptoms arise'],
      whenToSeekHelp: 'Seek immediate care for severe allergic reactions or adverse effects.'
    });

    setShowAddModal(false);
    setNewMed({
      name: '',
      strength: '',
      form: 'Tablet',
      dosageInstruction: '',
      frequency: 'Once daily',
      timeSlot: 'Morning',
      scheduledTime: '09:00 AM',
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
                <span>{t('medicineSchedule')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Track and log daily doses, view compliance calendar, and configure timely reminders
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerDemoReminder()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Plays real medical alert audio chime and sends browser notification"
              >
                <Bell className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'hi' ? 'अलार्म और साउंड टेस्ट करें' : 'Test Dose Alarm & Sound'}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addMedicine')}</span>
              </button>
            </div>
          </div>

          <DisclaimerBanner compact />

          {/* View Mode Tabs: Today's Schedule vs Calendar View */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('today')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'today' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Today&apos;s Schedule (20 June)
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Calendar View (Month)
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Prescriptions ({medicines.length})
              </button>
            </div>
          </div>

          {/* Section 30: Today's Medicines matching Mockup 13 */}
          {viewMode === 'today' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Today &bull; 20 June 2026</h3>
                  <p className="text-xs text-slate-500">
                    4 doses planned &bull; Tap checkmark when taken, or skip if instructed
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {medicines.filter(m => m.status === 'Taken').length} of {medicines.length} taken
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {medicines.map(med => {
                  const isTaken = med.status === 'Taken';
                  const isSkipped = med.status === 'Skipped';

                  return (
                    <div
                      key={med.id}
                      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        isTaken
                          ? 'opacity-80'
                          : isSkipped
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isTaken
                              ? 'bg-emerald-100 text-emerald-700'
                              : isSkipped
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <Pill className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                isTaken ? 'text-slate-800 line-through' : 'text-slate-900'
                              }`}
                            >
                              {med.name}
                            </h4>
                            <span className="text-xs font-bold text-slate-500">
                              {med.strength}
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                              {med.scheduledTime}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {language === 'hi' && med.dosageInstructionHi
                              ? med.dosageInstructionHi
                              : med.dosageInstruction}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges & Controls (Section 30) */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isTaken ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Taken {med.takenAt ? `at ${med.takenAt}` : ''}
                            </span>
                            <button
                              onClick={() => updateMedicineStatus(med.id, 'Upcoming')}
                              className="text-[11px] text-slate-400 hover:text-slate-600 underline px-1"
                            >
                              Undo
                            </button>
                          </div>
                        ) : isSkipped ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                              Skipped
                            </span>
                            <button
                              onClick={() => updateMedicineStatus(med.id, 'Upcoming')}
                              className="text-[11px] text-slate-400 hover:text-slate-600 underline px-1"
                            >
                              Undo
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateMedicineStatus(med.id, 'Taken')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t('takeNow')}</span>
                            </button>
                            <button
                              onClick={() => updateMedicineStatus(med.id, 'Skipped')}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-all"
                            >
                              {t('skipDose')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Crucial Section 30 Safety Callout */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Missed Dose Safety Protocol:</strong> Marking a medicine as skipped does not mean you should take a double dose later. Strictly consult your doctor or pharmacist regarding specific missed-dose instructions.
                </span>
              </div>
            </div>
          )}

          {/* Section 31: Calendar View */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentMonthName} {currentYear} Compliance Calendar</h3>
                  <p className="text-xs text-slate-500">
                    Click any day to view scheduled medicines and completion logs
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-700">Selected Day: {selectedDate} {currentMonthName}</span>
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-[11px] font-bold text-slate-400 py-1">
                    {day}
                  </div>
                ))}
                {daysInCurrentMonth.map(day => {
                  const isSelected = selectedDate === day;
                  const isToday = day === currentDay;
                  const isPast = day < currentDay;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-16 rounded-2xl border p-1.5 text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : isToday
                          ? 'border-blue-300 bg-blue-50/30'
                          : 'border-slate-100 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : 'text-slate-700'
                          }`}
                        >
                          {day}
                        </span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        )}
                      </div>

                      {/* Pill status dots */}
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isPast ? 'bg-emerald-500' : isToday ? 'bg-amber-400' : 'bg-slate-300'
                          }`}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isPast ? 'bg-emerald-500' : isToday ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Log Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-800">
                  Logs for {selectedDate} June 2026:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedDate < 20 && (
                    <p className="text-emerald-700 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      All 4 scheduled doses completed on time. 100% compliance.
                    </p>
                  )}
                  {selectedDate === 20 && (
                    <p className="text-blue-700 font-medium">
                      2 doses completed, 2 doses remaining for today.
                    </p>
                  )}
                  {selectedDate > 20 && (
                    <p className="text-slate-500">
                      Scheduled for upcoming date. Daily regimen: Dolo 650, Augmentin 625, Vitamin D3, Pantoprazole 40.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View Mode: All Prescriptions */}
          {viewMode === 'all' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                All Active Medication Prescriptions ({medicines.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {medicines.map(m => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          {m.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Strength: {m.strength} &bull; Form: {m.form}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Timing: {m.scheduledTime} ({m.timeSlot})
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => deleteMedicine(m.id)}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Medicine Modal (Section 29) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>{t('addMedicine')}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMed.name}
                  onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="e.g. Paracetamol or Cetirizine"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Strength / Dose
                  </label>
                  <input
                    type="text"
                    value={newMed.strength}
                    onChange={e => setNewMed({ ...newMed, strength: e.target.value })}
                    placeholder="e.g. 500 mg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Form
                  </label>
                  <select
                    value={newMed.form}
                    onChange={e => setNewMed({ ...newMed, form: e.target.value as Medicine['form'] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Drops">Drops</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Frequency
                </label>
                <select
                  value={newMed.frequency}
                  onChange={e => setNewMed({ ...newMed, frequency: e.target.value as MedicineFrequency })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newMed.timeSlot}
                    onChange={e => setNewMed({ ...newMed, timeSlot: e.target.value as TimeSlot })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newMed.scheduledTime}
                    onChange={e => setNewMed({ ...newMed, scheduledTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions / Food Timing
                </label>
                <input
                  type="text"
                  value={newMed.dosageInstruction}
                  onChange={e => setNewMed({ ...newMed, dosageInstruction: e.target.value })}
                  placeholder="e.g. 1 tablet after breakfast with water"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
