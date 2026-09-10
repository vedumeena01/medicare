'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Stethoscope,
  Filter,
  FileText,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Doctor, Appointment } from '@/types';

export default function AppointmentsPage() {
  const { doctors, appointments, bookAppointment, cancelAppointment, reports } = useApp();
  const { t, language } = useLanguage();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'doctors' | 'history'>('upcoming');

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookingSlot, setBookingSlot] = useState('10:30 AM');
  const [bookingType, setBookingType] = useState<'In-Person' | 'Video Call'>('In-Person');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);

  const specialties = [
    'All',
    'Cardiologist',
    'Endocrinologist & Diabetologist',
    'General Physician & Internal Medicine',
    'Pulmonologist & Chest Specialist',
  ];

  const commonSymptomPills = [
    'Elevated Cholesterol',
    'High Blood Sugar',
    'Mild Fatigue',
    'Shortness of Breath',
    'Headache / Dizziness',
    'Routine Preventative Checkup',
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const upcomingAppointments = appointments.filter((a) => a.status === 'Upcoming');
  const pastAppointments = appointments.filter((a) => a.status !== 'Upcoming');

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleOpenBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingSlot(doctor.slots.morning[0] || '10:00 AM');
    setReasonForVisit('');
    setSelectedSymptoms([]);
    setSelectedReportId(reports[0]?.id || '');
    setBookingSuccess(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setIsSubmitting(true);
    try {
      const newApt = await bookAppointment({
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorHospital: selectedDoctor.hospital,
        date: bookingDate,
        timeSlot: bookingSlot,
        type: bookingType,
        status: 'Upcoming',
        reasonForVisit: reasonForVisit.trim() || 'Consultation regarding laboratory report metrics.',
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['General Clinical Review'],
        attachedReportIds: selectedReportId ? [selectedReportId] : [],
        notes: `Booked via MediExplain AI appointment portal.`,
      });

      setBookingSuccess(newApt);
      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedDoctor(null);
        setActiveTab('upcoming');
      }, 1400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Title Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 lg:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
                  <Stethoscope className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'विशेषज्ञ डॉक्टर अपॉइंटमेंट्स' : 'Verified Specialist Network'}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
                  {language === 'hi' ? 'डॉक्टर अपॉइंटमेंट्स व परामर्श' : 'Doctor Appointments & Tele-Consultations'}
                </h1>
                <p className="text-teal-100 max-w-xl text-sm lg:text-base">
                  {language === 'hi'
                    ? 'अपनी जांच रिपोर्ट के साथ सीधे विशेषज्ञ डॉक्टरों से क्लिनिक में मिलें या वीडियो कॉल पर परामर्श लें।'
                    : 'Seamlessly schedule In-Person or Video tele-consultations. Attach your AI-analyzed lab reports for an informed doctor discussion.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('doctors');
                    if (doctors.length > 0) handleOpenBooking(doctors[0]);
                  }}
                  className="px-5 py-3 bg-white text-teal-800 font-semibold rounded-xl shadow hover:bg-teal-50 transition-all flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'hi' ? 'नया अपॉइंटमेंट बुक करें' : 'Book New Appointment'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              {language === 'hi' ? 'आगामी अपॉइंटमेंट्स' : 'Upcoming Appointments'}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'upcoming' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {upcomingAppointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === 'doctors'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              {language === 'hi' ? 'डॉक्टर खोजें' : 'Find Specialists'}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'doctors' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {doctors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === 'history'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              {language === 'hi' ? 'इतिहास (History)' : 'Past Consultations'}
            </button>
          </div>

          {/* TAB 1: UPCOMING APPOINTMENTS */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {upcomingAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {language === 'hi' ? 'कोई आगामी अपॉइंटमेंट नहीं है' : 'No upcoming appointments'}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    {language === 'hi'
                      ? 'अपने डॉक्टर के साथ समय निश्चित करें ताकि आपकी रिपोर्ट का समय पर मूल्यांकन हो सके।'
                      : 'Schedule a visit or video call with top specialists to review your lab test results.'}
                  </p>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition"
                  >
                    {language === 'hi' ? 'उपलब्ध डॉक्टर देखें' : 'Browse Available Doctors'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full pointer-events-none -z-0" />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-tr from-teal-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {apt.doctorName.charAt(4) || 'D'}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">{apt.doctorName}</h3>
                              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                                {apt.doctorSpecialty}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              apt.type === 'Video Call'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {apt.type === 'Video Call' ? (
                              <Video className="w-3.5 h-3.5" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5" />
                            )}
                            {apt.type}
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3.5 mb-4 space-y-2 text-sm border border-slate-100">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-4 h-4 text-teal-600" />
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                              <Clock className="w-4 h-4 text-teal-600" />
                              {apt.timeSlot}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{apt.doctorHospital}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-medium text-slate-500 mb-1">
                            {language === 'hi' ? 'परामर्श का कारण:' : 'Reason for Visit:'}
                          </p>
                          <p className="text-sm text-slate-800 bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                            {apt.reasonForVisit}
                          </p>
                        </div>

                        {apt.symptoms && apt.symptoms.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-slate-500 mb-1.5">
                              {language === 'hi' ? 'चिह्नित लक्षण:' : 'Noted Symptoms:'}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {apt.symptoms.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {apt.attachedReportIds && apt.attachedReportIds.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-teal-700 font-medium mb-4">
                            <FileText className="w-3.5 h-3.5" />
                            {language === 'hi'
                              ? '1 लैब रिपोर्ट संलग्न है'
                              : '1 Medical Report attached for doctor'}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        {apt.type === 'Video Call' ? (
                          <button
                            onClick={() =>
                              alert(
                                language === 'hi'
                                  ? 'टेली-कंसल्टेशन लिंक अपॉइंटमेंट समय से 10 मिनट पहले सक्रिय होगा।'
                                  : 'Tele-consultation video room will unlock 10 minutes prior to the scheduled time.'
                              )
                            }
                            className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                          >
                            <Video className="w-3.5 h-3.5" />
                            {language === 'hi' ? 'वीडियो रूम खोलें' : 'Join Video Room'}
                          </button>
                        ) : (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(apt.doctorHospital)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-600" />
                            {language === 'hi' ? 'अस्पताल रास्ता' : 'Hospital Route'}
                          </a>
                        )}

                        <button
                          onClick={() => {
                            if (
                              confirm(
                                language === 'hi'
                                  ? 'क्या आप इस अपॉइंटमेंट को रद्द करना चाहते हैं?'
                                  : 'Are you sure you want to cancel this appointment?'
                              )
                            ) {
                              cancelAppointment(apt.id);
                            }
                          }}
                          className="py-2 px-3 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition"
                        >
                          {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCTORS DIRECTORY */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              {/* Search & Filter bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={
                      language === 'hi'
                        ? 'डॉक्टर का नाम, विशेषता या अस्पताल खोजें...'
                        : 'Search doctor by name, specialty, or hospital...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Specialty Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
                  {specialties.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                        selectedSpecialty === spec
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-tr from-teal-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
                            {doc.name.charAt(4) || 'D'}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                              {language === 'hi' && doc.nameHi ? doc.nameHi : doc.name}
                            </h3>
                            <p className="text-xs font-semibold text-teal-700">
                              {language === 'hi' && doc.specialtyHi ? doc.specialtyHi : doc.specialty}
                            </p>
                            <p className="text-xs text-slate-500">{doc.qualification}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 text-amber-700 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{doc.rating}</span>
                          <span className="text-slate-400 font-normal">({doc.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800">{doc.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {doc.experienceYears}{' '}
                            {language === 'hi' ? 'वर्षों का अनुभव' : 'years of clinical experience'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {language === 'hi' ? 'उपलब्ध दिन:' : 'Available:'}{' '}
                            {doc.availableDays.join(', ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 px-1">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold">
                            {language === 'hi' ? 'परामर्श शुल्क' : 'Consultation Fee'}
                          </p>
                          <p className="text-base font-bold text-slate-900">₹{doc.consultationFee}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 uppercase font-semibold">
                            {language === 'hi' ? 'उपलब्ध स्लॉट्स' : 'Next Available'}
                          </p>
                          <p className="text-xs font-semibold text-emerald-600">
                            {doc.slots.morning[0] || '10:00 AM Today'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(doc)}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Calendar className="w-4 h-4" />
                      {language === 'hi' ? 'अपॉइंटमेंट स्लॉट चुनें' : 'Select Time Slot & Book'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAST HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {pastAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
                  <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    {language === 'hi' ? 'कोई पूर्व अपॉइंटमेंट इतिहास नहीं है' : 'No past appointment history'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi'
                      ? 'पूर्ण किए गए अथवा पुराने परामर्श यहाँ सूचीबद्ध होंगे।'
                      : 'Completed or archived consultations will appear here.'}
                  </p>
                </div>
              ) : (
                pastAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                        {apt.doctorName.charAt(4) || 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h4>
                        <p className="text-xs text-slate-500">
                          {apt.doctorSpecialty} • {apt.date} at {apt.timeSlot}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        apt.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* BOOKING MODAL */}
          {selectedDoctor && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative my-8">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>

                {bookingSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {language === 'hi' ? 'अपॉइंटमेंट निश्चित हो गया!' : 'Appointment Confirmed!'}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      {language === 'hi'
                        ? `${selectedDoctor.name} के साथ ${bookingDate} को ${bookingSlot} बजे आपका अपॉइंटमेंट दर्ज कर लिया गया है।`
                        : `Your visit with ${selectedDoctor.name} on ${bookingDate} at ${bookingSlot} is confirmed.`}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmBooking} className="space-y-5">
                    <div>
                      <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                        {language === 'hi' ? 'अपॉइंटमेंट बुकिंग' : 'Schedule Appointment'}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        {selectedDoctor.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {selectedDoctor.specialty} • {selectedDoctor.hospital}
                      </p>
                    </div>

                    {/* Mode: In Person vs Video */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                        {language === 'hi' ? 'परामर्श प्रकार' : 'Consultation Type'}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setBookingType('In-Person')}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                            bookingType === 'In-Person'
                              ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
                          <div>
                            <p className="font-bold text-xs">
                              {language === 'hi' ? 'क्लिनिक में मिलें' : 'In-Person Visit'}
                            </p>
                            <p className="text-[10px] text-slate-500">Max / Apollo Clinic</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBookingType('Video Call')}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                            bookingType === 'Video Call'
                              ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Video className="w-5 h-5 text-purple-600 shrink-0" />
                          <div>
                            <p className="font-bold text-xs">
                              {language === 'hi' ? 'वीडियो परामर्श' : 'Video Tele-Consult'}
                            </p>
                            <p className="text-[10px] text-slate-500">HD Encrypted Call</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Date and Slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                          {language === 'hi' ? 'तारीख चुनें' : 'Select Date'}
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                          {language === 'hi' ? 'समय स्लॉट' : 'Time Slot'}
                        </label>
                        <select
                          value={bookingSlot}
                          onChange={(e) => setBookingSlot(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                        >
                          <optgroup label="Morning">
                            {selectedDoctor.slots.morning.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Afternoon">
                            {selectedDoctor.slots.afternoon.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Evening">
                            {selectedDoctor.slots.evening.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Symptoms selection chips */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                        {language === 'hi'
                          ? 'लक्षण या स्वास्थ्य विषय चुनें'
                          : 'Select Symptoms / Topics'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {commonSymptomPills.map((symptom) => {
                          const isSelected = selectedSymptoms.includes(symptom);
                          return (
                            <button
                              key={symptom}
                              type="button"
                              onClick={() => toggleSymptom(symptom)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                                isSelected
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {symptom}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reason for visit notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                        {language === 'hi'
                          ? 'डॉक्टर के लिए विवरण (वैकल्पिक)'
                          : 'Reason for visit / Notes'}
                      </label>
                      <textarea
                        rows={2}
                        placeholder={
                          language === 'hi'
                            ? 'उदा. हालिया लिपिड प्रोफाइल में बढ़ा हुआ कोलेस्ट्रॉल...'
                            : 'e.g. Seeking advice regarding elevated cholesterol and fatigue...'
                        }
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    {/* Attach Lab Report */}
                    {reports.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                          {language === 'hi'
                            ? 'संलग्न मेडिकल रिपोर्ट (AI सारांश डॉक्टर को दिखेगा)'
                            : 'Attach Medical Report for Doctor Review'}
                        </label>
                        <select
                          value={selectedReportId}
                          onChange={(e) => setSelectedReportId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                        >
                          <option value="">
                            {language === 'hi' ? '-- कोई रिपोर्ट नहीं --' : '-- None --'}
                          </option>
                          {reports.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.fileName} ({r.reportType} - {r.uploadedAt})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block">
                          {language === 'hi' ? 'कुल परामर्श शुल्क:' : 'Consultation Fee:'}
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                          ₹{selectedDoctor.consultationFee}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>{language === 'hi' ? 'पुष्टि हो रही है...' : 'Confirming...'}</span>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            {language === 'hi' ? 'अपॉइंटमेंट कन्फर्म करें' : 'Confirm Appointment'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Medical Disclaimer Banner */}
          <div className="mt-12">
            <DisclaimerBanner />
          </div>
        </main>
      </div>
    </div>
  );
}
