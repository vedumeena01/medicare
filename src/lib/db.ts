import fs from 'fs';
import path from 'path';
import {
  MedicalReport,
  Medicine,
  FamilyMember,
  UserProfile,
  Doctor,
  Appointment,
  Consultation,
  NotificationItem,
  FeedbackItem,
} from '@/types';
import {
  sampleUser,
  sampleReports,
  sampleMedicines,
  sampleFamilyMembers,
  sampleDoctors,
  sampleAppointments,
  sampleConsultations,
  sampleNotifications,
} from './sampleData';
import prisma from './prisma';

export interface DatabaseSchema {
  user: UserProfile;
  reports: MedicalReport[];
  medicines: Medicine[];
  familyMembers: FamilyMember[];
  doctors: Doctor[];
  appointments: Appointment[];
  consultations: Consultation[];
  notifications: NotificationItem[];
  feedback?: FeedbackItem[];
  lastUpdated: string;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'medicare.db.json');

/**
 * Ensures the JSON local store is initialized with valid structures.
 * Fixes LOGIC-01: Verifies array types via Array.isArray rather than length > 0
 * to avoid resurrecting deleted user records when arrays are legitimately empty.
 */
function ensureDatabaseInitialized(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const initialCleanData: DatabaseSchema = {
    user: sampleUser,
    reports: sampleReports,
    medicines: sampleMedicines,
    familyMembers: sampleFamilyMembers,
    doctors: sampleDoctors,
    appointments: sampleAppointments,
    consultations: sampleConsultations,
    notifications: sampleNotifications,
    lastUpdated: new Date().toISOString(),
  };

  if (!fs.existsSync(DB_FILE)) {
    writeDatabase(initialCleanData);
    return initialCleanData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;

    let changed = false;
    if (!parsed.user || !parsed.user.name || parsed.user.name === 'New User') {
      parsed.user = sampleUser;
      changed = true;
    }
    // Doctors catalog is reference static data
    if (!parsed.doctors || !Array.isArray(parsed.doctors) || parsed.doctors.length === 0) {
      parsed.doctors = sampleDoctors;
      changed = true;
    }
    // For user-modifiable lists, only restore defaults if not an array (prevents zombie resurrects)
    if (!parsed.reports || !Array.isArray(parsed.reports)) {
      parsed.reports = sampleReports;
      changed = true;
    }
    if (!parsed.medicines || !Array.isArray(parsed.medicines)) {
      parsed.medicines = sampleMedicines;
      changed = true;
    }
    if (!parsed.familyMembers || !Array.isArray(parsed.familyMembers)) {
      parsed.familyMembers = sampleFamilyMembers;
      changed = true;
    }
    if (!parsed.appointments || !Array.isArray(parsed.appointments)) {
      parsed.appointments = sampleAppointments;
      changed = true;
    }
    if (!parsed.consultations || !Array.isArray(parsed.consultations)) {
      parsed.consultations = sampleConsultations;
      changed = true;
    }
    if (!parsed.notifications || !Array.isArray(parsed.notifications)) {
      parsed.notifications = sampleNotifications;
      changed = true;
    }

    if (changed) {
      writeDatabase(parsed);
    }

    return parsed;
  } catch {
    writeDatabase(initialCleanData);
    return initialCleanData;
  }
}

/**
 * Writes data atomically to disk using a unique temporary file and replacement rename.
 * Prevents zero-byte corruption during crashes, power interruptions, or rapid concurrent updates (CONC-01).
 */
function writeDatabase(data: DatabaseSchema): void {
  data.lastUpdated = new Date().toISOString();
  const serialized = JSON.stringify(data, null, 2);
  const tempFile = path.join(
    DB_DIR,
    `medicare.db.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`
  );

  try {
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    try {
      fs.renameSync(tempFile, DB_FILE);
    } catch {
      // Windows file-lock fallback
      fs.copyFileSync(tempFile, DB_FILE);
      try {
        fs.unlinkSync(tempFile);
      } catch {}
    }
  } catch {
    // Direct write fallback
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch {}
    fs.writeFileSync(DB_FILE, serialized, 'utf-8');
  }
}

// ---------------------------------------------------------
// Background SQLite Prisma Mirroring Helpers
// ---------------------------------------------------------

function backgroundSyncUser(user: UserProfile): void {
  prisma.user
    .upsert({
      where: { id: user.id || 'usr-1' },
      update: {
        name: user.name,
        email: user.email || 'user@medicare.local',
        mobile: user.mobile || '+91 98765 00000',
        age: typeof user.age === 'number' ? user.age : 28,
        gender: user.gender || 'Male',
        language: user.language || 'en',
      },
      create: {
        id: user.id || 'usr-1',
        name: user.name,
        email: user.email || 'user@medicare.local',
        mobile: user.mobile || '+91 98765 00000',
        age: typeof user.age === 'number' ? user.age : 28,
        gender: user.gender || 'Male',
        language: user.language || 'en',
      },
    })
    .catch((err) => console.warn('[Prisma Sync User Error]:', err.message));
}

function backgroundSyncReport(report: MedicalReport): void {
  prisma.report
    .upsert({
      where: { id: report.id },
      update: {
        userId: report.userId || 'usr-1',
        familyMemberId: report.familyMemberId || null,
        fileName: report.fileName || 'Report.pdf',
        fileUrl: report.fileUrl || null,
        reportType: report.reportType || 'Blood Test',
        uploadedAt: report.uploadedAt || new Date().toISOString(),
        status: report.status || 'Completed',
        language: report.language || 'en',
        overallScore: typeof report.overallScore === 'number' ? report.overallScore : 85,
        summary: report.summary || '',
        summaryHi: report.summaryHi || '',
        findingsJson: JSON.stringify(report.findings || []),
        normalValuesJson: JSON.stringify(report.normalValues || []),
        medicalTermsJson: JSON.stringify(report.medicalTerms || []),
        doctorQuestionsJson: JSON.stringify(report.doctorQuestions || []),
        suggestionsJson: JSON.stringify(report.suggestions || []),
        riskAnalysisJson: JSON.stringify(report.riskAnalysis || []),
        comparisonJson: report.comparison ? JSON.stringify(report.comparison) : null,
      },
      create: {
        id: report.id,
        userId: report.userId || 'usr-1',
        familyMemberId: report.familyMemberId || null,
        fileName: report.fileName || 'Report.pdf',
        fileUrl: report.fileUrl || null,
        reportType: report.reportType || 'Blood Test',
        uploadedAt: report.uploadedAt || new Date().toISOString(),
        status: report.status || 'Completed',
        language: report.language || 'en',
        overallScore: typeof report.overallScore === 'number' ? report.overallScore : 85,
        summary: report.summary || '',
        summaryHi: report.summaryHi || '',
        findingsJson: JSON.stringify(report.findings || []),
        normalValuesJson: JSON.stringify(report.normalValues || []),
        medicalTermsJson: JSON.stringify(report.medicalTerms || []),
        doctorQuestionsJson: JSON.stringify(report.doctorQuestions || []),
        suggestionsJson: JSON.stringify(report.suggestions || []),
        riskAnalysisJson: JSON.stringify(report.riskAnalysis || []),
        comparisonJson: report.comparison ? JSON.stringify(report.comparison) : null,
      },
    })
    .catch((err) => console.warn('[Prisma Sync Report Error]:', err.message));
}

function backgroundDeleteReport(id: string): void {
  prisma.report.delete({ where: { id } }).catch(() => {});
}

function backgroundSyncMedicine(med: Medicine): void {
  prisma.medicine
    .upsert({
      where: { id: med.id },
      update: {
        userId: med.userId || 'usr-1',
        name: med.name,
        strength: med.strength || '500 mg',
        form: med.form || 'Tablet',
        manufacturer: med.manufacturer || null,
        dosageInstruction: med.dosageInstruction || '1 tablet after meals',
        dosageInstructionHi: med.dosageInstructionHi || null,
        frequency: med.frequency || 'Once daily',
        timeSlot: med.timeSlot || 'Morning',
        scheduledTime: med.scheduledTime || '08:00 AM',
        startDate: med.startDate || new Date().toISOString().split('T')[0],
        endDate: med.endDate || null,
        status: med.status || 'Upcoming',
        takenAt: med.takenAt || null,
        description: med.description || '',
        descriptionHi: med.descriptionHi || null,
        commonUsesJson: JSON.stringify(med.commonUses || []),
        precautionsJson: JSON.stringify(med.precautions || []),
        sideEffectsJson: JSON.stringify(med.sideEffects || []),
        whenToSeekHelp: med.whenToSeekHelp || '',
        whenToSeekHelpHi: med.whenToSeekHelpHi || null,
      },
      create: {
        id: med.id,
        userId: med.userId || 'usr-1',
        name: med.name,
        strength: med.strength || '500 mg',
        form: med.form || 'Tablet',
        manufacturer: med.manufacturer || null,
        dosageInstruction: med.dosageInstruction || '1 tablet after meals',
        dosageInstructionHi: med.dosageInstructionHi || null,
        frequency: med.frequency || 'Once daily',
        timeSlot: med.timeSlot || 'Morning',
        scheduledTime: med.scheduledTime || '08:00 AM',
        startDate: med.startDate || new Date().toISOString().split('T')[0],
        endDate: med.endDate || null,
        status: med.status || 'Upcoming',
        takenAt: med.takenAt || null,
        description: med.description || '',
        descriptionHi: med.descriptionHi || null,
        commonUsesJson: JSON.stringify(med.commonUses || []),
        precautionsJson: JSON.stringify(med.precautions || []),
        sideEffectsJson: JSON.stringify(med.sideEffects || []),
        whenToSeekHelp: med.whenToSeekHelp || '',
        whenToSeekHelpHi: med.whenToSeekHelpHi || null,
      },
    })
    .catch((err) => console.warn('[Prisma Sync Medicine Error]:', err.message));
}

function backgroundDeleteMedicine(id: string): void {
  prisma.medicine.delete({ where: { id } }).catch(() => {});
}

function backgroundSyncFamilyMember(f: FamilyMember, userId: string): void {
  prisma.familyMember
    .upsert({
      where: { id: f.id },
      update: {
        userId,
        name: f.name,
        relation: f.relation,
        relationHi: f.relationHi || null,
        age: typeof f.age === 'number' ? f.age : 50,
        gender: f.gender || 'Other',
        healthConditionsJson: JSON.stringify(f.healthConditions || []),
      },
      create: {
        id: f.id,
        userId,
        name: f.name,
        relation: f.relation,
        relationHi: f.relationHi || null,
        age: typeof f.age === 'number' ? f.age : 50,
        gender: f.gender || 'Other',
        healthConditionsJson: JSON.stringify(f.healthConditions || []),
      },
    })
    .catch((err) => console.warn('[Prisma Sync FamilyMember Error]:', err.message));
}

function backgroundDeleteFamilyMember(id: string): void {
  prisma.familyMember.delete({ where: { id } }).catch(() => {});
}

// ---------------------------------------------------------
// Unified Database Access Layer (Sync & Async Prisma)
// ---------------------------------------------------------

export const db = {
  prisma,

  // User Operations
  getUser(): UserProfile {
    const data = ensureDatabaseInitialized();
    return data.user;
  },
  async getUserAsync(): Promise<UserProfile> {
    try {
      const u = await prisma.user.findFirst();
      if (u) {
        const local = ensureDatabaseInitialized().user;
        return {
          ...local,
          id: u.id,
          name: u.name,
          email: u.email,
          mobile: u.mobile,
          age: u.age,
          gender: u.gender as UserProfile['gender'],
          language: u.language as UserProfile['language'],
        };
      }
    } catch {}
    return this.getUser();
  },
  updateUser(updates: Partial<UserProfile>): UserProfile {
    const data = ensureDatabaseInitialized();
    data.user = { ...data.user, ...updates };
    writeDatabase(data);
    backgroundSyncUser(data.user);
    return data.user;
  },
  async updateUserAsync(updates: Partial<UserProfile>): Promise<UserProfile> {
    const updated = this.updateUser(updates);
    try {
      await prisma.user.update({
        where: { id: updated.id || 'usr-1' },
        data: {
          name: updated.name,
          email: updated.email,
          mobile: updated.mobile,
          age: updated.age,
          gender: updated.gender,
          language: updated.language,
        },
      });
    } catch {}
    return updated;
  },

  // Report Operations
  getReports(): MedicalReport[] {
    const data = ensureDatabaseInitialized();
    return data.reports;
  },
  async getReportsAsync(): Promise<MedicalReport[]> {
    try {
      const records = await prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          userId: r.userId,
          familyMemberId: r.familyMemberId || undefined,
          fileName: r.fileName,
          fileUrl: r.fileUrl || undefined,
          reportType: r.reportType as MedicalReport['reportType'],
          uploadedAt: r.uploadedAt,
          status: r.status as MedicalReport['status'],
          language: r.language as MedicalReport['language'],
          overallScore: r.overallScore,
          summary: r.summary,
          summaryHi: r.summaryHi,
          findings: r.findingsJson ? JSON.parse(r.findingsJson) : [],
          normalValues: r.normalValuesJson ? JSON.parse(r.normalValuesJson) : [],
          medicalTerms: r.medicalTermsJson ? JSON.parse(r.medicalTermsJson) : [],
          doctorQuestions: r.doctorQuestionsJson ? JSON.parse(r.doctorQuestionsJson) : [],
          suggestions: r.suggestionsJson ? JSON.parse(r.suggestionsJson) : [],
          riskAnalysis: r.riskAnalysisJson ? JSON.parse(r.riskAnalysisJson) : [],
          comparison: r.comparisonJson ? JSON.parse(r.comparisonJson) : undefined,
          confidenceThresholdMet: true,
        }));
      }
    } catch {}
    return this.getReports();
  },
  getReportById(id: string): MedicalReport | undefined {
    const data = ensureDatabaseInitialized();
    return data.reports.find((r) => r.id === id);
  },
  async getReportByIdAsync(id: string): Promise<MedicalReport | null> {
    try {
      const r = await prisma.report.findUnique({ where: { id } });
      if (r) {
        return {
          id: r.id,
          userId: r.userId,
          familyMemberId: r.familyMemberId || undefined,
          fileName: r.fileName,
          fileUrl: r.fileUrl || undefined,
          reportType: r.reportType as MedicalReport['reportType'],
          uploadedAt: r.uploadedAt,
          status: r.status as MedicalReport['status'],
          language: r.language as MedicalReport['language'],
          overallScore: r.overallScore,
          summary: r.summary,
          summaryHi: r.summaryHi,
          findings: r.findingsJson ? JSON.parse(r.findingsJson) : [],
          normalValues: r.normalValuesJson ? JSON.parse(r.normalValuesJson) : [],
          medicalTerms: r.medicalTermsJson ? JSON.parse(r.medicalTermsJson) : [],
          doctorQuestions: r.doctorQuestionsJson ? JSON.parse(r.doctorQuestionsJson) : [],
          suggestions: r.suggestionsJson ? JSON.parse(r.suggestionsJson) : [],
          riskAnalysis: r.riskAnalysisJson ? JSON.parse(r.riskAnalysisJson) : [],
          comparison: r.comparisonJson ? JSON.parse(r.comparisonJson) : undefined,
          confidenceThresholdMet: true,
        };
      }
    } catch {}
    return this.getReportById(id) || null;
  },
  saveReport(report: MedicalReport): MedicalReport {
    const data = ensureDatabaseInitialized();
    const existingIndex = data.reports.findIndex((r) => r.id === report.id);
    if (existingIndex >= 0) {
      data.reports[existingIndex] = report;
    } else {
      data.reports.unshift(report);
    }
    writeDatabase(data);
    backgroundSyncReport(report);
    return report;
  },
  async saveReportAsync(report: MedicalReport): Promise<MedicalReport> {
    return this.saveReport(report);
  },
  deleteReport(id: string): boolean {
    const data = ensureDatabaseInitialized();
    const initialLength = data.reports.length;
    data.reports = data.reports.filter((r) => r.id !== id);
    writeDatabase(data);
    backgroundDeleteReport(id);
    return data.reports.length < initialLength;
  },
  async deleteReportAsync(id: string): Promise<boolean> {
    return this.deleteReport(id);
  },

  // Medicine Operations
  getMedicines(): Medicine[] {
    const data = ensureDatabaseInitialized();
    return data.medicines;
  },
  async getMedicinesAsync(): Promise<Medicine[]> {
    try {
      const records = await prisma.medicine.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) {
        return records.map((m) => ({
          id: m.id,
          userId: m.userId,
          name: m.name,
          strength: m.strength,
          form: m.form as Medicine['form'],
          manufacturer: m.manufacturer || undefined,
          dosageInstruction: m.dosageInstruction,
          dosageInstructionHi: m.dosageInstructionHi || undefined,
          frequency: m.frequency as Medicine['frequency'],
          timeSlot: m.timeSlot as Medicine['timeSlot'],
          scheduledTime: m.scheduledTime,
          startDate: m.startDate,
          endDate: m.endDate || undefined,
          status: m.status as Medicine['status'],
          takenAt: m.takenAt || undefined,
          description: m.description,
          descriptionHi: m.descriptionHi || undefined,
          commonUses: m.commonUsesJson ? JSON.parse(m.commonUsesJson) : [],
          precautions: m.precautionsJson ? JSON.parse(m.precautionsJson) : [],
          sideEffects: m.sideEffectsJson ? JSON.parse(m.sideEffectsJson) : [],
          whenToSeekHelp: m.whenToSeekHelp,
          whenToSeekHelpHi: m.whenToSeekHelpHi || undefined,
        }));
      }
    } catch {}
    return this.getMedicines();
  },
  saveMedicine(medicine: Omit<Medicine, 'id'> & { id?: string }): Medicine {
    const data = ensureDatabaseInitialized();
    const newMed: Medicine = {
      ...medicine,
      id: medicine.id || 'med-' + Date.now(),
      userId: medicine.userId || data.user.id || 'usr-1',
    };
    const existingIndex = data.medicines.findIndex((m) => m.id === newMed.id);
    if (existingIndex >= 0) {
      data.medicines[existingIndex] = newMed;
    } else {
      data.medicines.unshift(newMed);
    }
    writeDatabase(data);
    backgroundSyncMedicine(newMed);
    return newMed;
  },
  async saveMedicineAsync(medicine: Omit<Medicine, 'id'> & { id?: string }): Promise<Medicine> {
    return this.saveMedicine(medicine);
  },
  updateMedicineStatus(id: string, status: 'Upcoming' | 'Taken' | 'Skipped'): Medicine | null {
    const data = ensureDatabaseInitialized();
    const med = data.medicines.find((m) => m.id === id);
    if (!med) return null;

    med.status = status;
    med.takenAt =
      status === 'Taken'
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : undefined;
    writeDatabase(data);
    backgroundSyncMedicine(med);
    return med;
  },
  async updateMedicineStatusAsync(
    id: string,
    status: 'Upcoming' | 'Taken' | 'Skipped'
  ): Promise<Medicine | null> {
    return this.updateMedicineStatus(id, status);
  },
  deleteMedicine(id: string): boolean {
    const data = ensureDatabaseInitialized();
    const initialLength = data.medicines.length;
    data.medicines = data.medicines.filter((m) => m.id !== id);
    writeDatabase(data);
    backgroundDeleteMedicine(id);
    return data.medicines.length < initialLength;
  },
  async deleteMedicineAsync(id: string): Promise<boolean> {
    return this.deleteMedicine(id);
  },

  // Family Member Operations
  getFamilyMembers(): FamilyMember[] {
    const data = ensureDatabaseInitialized();
    return data.familyMembers || [];
  },
  async getFamilyMembersAsync(): Promise<FamilyMember[]> {
    try {
      const records = await prisma.familyMember.findMany();
      if (records && records.length > 0) {
        return records.map((f) => ({
          id: f.id,
          name: f.name,
          relation: f.relation,
          relationHi: f.relationHi || undefined,
          age: f.age,
          gender: f.gender as FamilyMember['gender'],
          healthConditions: f.healthConditionsJson ? JSON.parse(f.healthConditionsJson) : [],
        }));
      }
    } catch {}
    return this.getFamilyMembers();
  },
  addFamilyMember(member: Omit<FamilyMember, 'id'>): FamilyMember {
    const data = ensureDatabaseInitialized();
    if (!data.familyMembers) data.familyMembers = [];
    const newMember: FamilyMember = {
      ...member,
      id: 'fam-' + Date.now(),
    };
    data.familyMembers.push(newMember);
    writeDatabase(data);
    backgroundSyncFamilyMember(newMember, data.user?.id || 'usr-1');
    return newMember;
  },
  async addFamilyMemberAsync(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    return this.addFamilyMember(member);
  },
  deleteFamilyMember(id: string): boolean {
    const data = ensureDatabaseInitialized();
    if (!data.familyMembers) return false;
    const initialLen = data.familyMembers.length;
    data.familyMembers = data.familyMembers.filter((m) => m.id !== id);
    writeDatabase(data);
    backgroundDeleteFamilyMember(id);
    return data.familyMembers.length < initialLen;
  },
  async deleteFamilyMemberAsync(id: string): Promise<boolean> {
    return this.deleteFamilyMember(id);
  },

  // Doctor Operations
  getDoctors(): Doctor[] {
    const data = ensureDatabaseInitialized();
    return data.doctors || [];
  },
  getDoctorById(id: string): Doctor | undefined {
    const data = ensureDatabaseInitialized();
    return data.doctors?.find((d) => d.id === id);
  },

  // Appointment Operations
  getAppointments(): Appointment[] {
    const data = ensureDatabaseInitialized();
    return data.appointments || [];
  },
  getAppointmentById(id: string): Appointment | undefined {
    const data = ensureDatabaseInitialized();
    return data.appointments?.find((a) => a.id === id);
  },
  bookAppointment(
    appointment: Omit<Appointment, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
  ): Appointment {
    const data = ensureDatabaseInitialized();
    const newApt: Appointment = {
      ...appointment,
      id: appointment.id || 'apt-' + Date.now(),
      createdAt: appointment.createdAt || new Date().toISOString().split('T')[0],
      status: appointment.status || 'Upcoming',
    };
    if (!data.appointments) data.appointments = [];
    data.appointments.unshift(newApt);

    // Auto-create notification for confirmed appointment
    if (!data.notifications) data.notifications = [];
    data.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: newApt.userId,
      type: 'appointment',
      title: `Appointment Confirmed: ${newApt.doctorName}`,
      titleHi: `अपॉइंटमेंट निश्चित: ${newApt.doctorName}`,
      message: `Your appointment for ${newApt.date} at ${newApt.timeSlot} (${newApt.type}) has been confirmed.`,
      messageHi: `आपका अपॉइंटमेंट ${newApt.date} को ${newApt.timeSlot} बजे निश्चित किया गया है।`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '/appointments',
    });

    writeDatabase(data);
    return newApt;
  },
  updateAppointmentStatus(
    id: string,
    status: 'Upcoming' | 'Completed' | 'Cancelled'
  ): Appointment | null {
    const data = ensureDatabaseInitialized();
    const apt = data.appointments?.find((a) => a.id === id);
    if (!apt) return null;
    apt.status = status;
    writeDatabase(data);
    return apt;
  },
  deleteAppointment(id: string): boolean {
    const data = ensureDatabaseInitialized();
    if (!data.appointments) return false;
    const initialLen = data.appointments.length;
    data.appointments = data.appointments.filter((a) => a.id !== id);
    writeDatabase(data);
    return data.appointments.length < initialLen;
  },

  // Consultation Operations
  getConsultations(): Consultation[] {
    const data = ensureDatabaseInitialized();
    return data.consultations || [];
  },
  getConsultationById(id: string): Consultation | undefined {
    const data = ensureDatabaseInitialized();
    return data.consultations?.find((c) => c.id === id);
  },
  saveConsultation(consultation: Omit<Consultation, 'id'> & { id?: string }): Consultation {
    const data = ensureDatabaseInitialized();
    const newCon: Consultation = {
      ...consultation,
      id: consultation.id || 'con-' + Date.now(),
    };
    if (!data.consultations) data.consultations = [];
    const idx = data.consultations.findIndex((c) => c.id === newCon.id);
    if (idx >= 0) {
      data.consultations[idx] = newCon;
    } else {
      data.consultations.unshift(newCon);
    }
    writeDatabase(data);
    return newCon;
  },

  // Notification Operations
  getNotifications(): NotificationItem[] {
    const data = ensureDatabaseInitialized();
    return data.notifications || [];
  },
  markNotificationRead(id: string): boolean {
    const data = ensureDatabaseInitialized();
    if (!data.notifications) return false;
    const item = data.notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
      writeDatabase(data);
      return true;
    }
    return false;
  },
  markAllNotificationsRead(): boolean {
    const data = ensureDatabaseInitialized();
    if (!data.notifications) return false;
    data.notifications.forEach((n) => (n.read = true));
    writeDatabase(data);
    return true;
  },
  addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem {
    const data = ensureDatabaseInitialized();
    if (!data.notifications) data.notifications = [];
    const item: NotificationItem = {
      ...notification,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
    };
    data.notifications.unshift(item);
    writeDatabase(data);
    return item;
  },

  // Feedback Operations
  getFeedback(): FeedbackItem[] {
    const data = ensureDatabaseInitialized();
    return data.feedback || [];
  },
  saveFeedback(
    feedback: Omit<FeedbackItem, 'id' | 'timestamp' | 'status'> & {
      id?: string;
      timestamp?: string;
      status?: FeedbackItem['status'];
    }
  ): FeedbackItem {
    const data = ensureDatabaseInitialized();
    if (!data.feedback) data.feedback = [];
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: feedback.id || 'fb-' + Date.now(),
      timestamp: feedback.timestamp || new Date().toISOString(),
      status: feedback.status || 'new',
    };
    data.feedback.unshift(newFeedback);
    writeDatabase(data);
    return newFeedback;
  },

  // Full Database Sync to SQLite
  async syncToSqlite(data?: DatabaseSchema): Promise<void> {
    const current = data || ensureDatabaseInitialized();
    backgroundSyncUser(current.user);
    for (const r of current.reports || []) {
      backgroundSyncReport(r);
    }
    for (const m of current.medicines || []) {
      backgroundSyncMedicine(m);
    }
    for (const f of current.familyMembers || []) {
      backgroundSyncFamilyMember(f, current.user?.id || 'usr-1');
    }
  },

  resetDatabase(): DatabaseSchema {
    const cleanData: DatabaseSchema = {
      user: {
        id: 'usr-1',
        name: 'New User',
        email: '',
        mobile: '',
        age: 28,
        gender: 'Male',
        language: 'en',
      },
      reports: [],
      medicines: [],
      familyMembers: [],
      doctors: sampleDoctors,
      appointments: [],
      consultations: [],
      notifications: [],
      lastUpdated: new Date().toISOString(),
    };
    writeDatabase(cleanData);
    return cleanData;
  },

  loadDemoData(): DatabaseSchema {
    const demoData: DatabaseSchema = {
      user: sampleUser,
      reports: sampleReports,
      medicines: sampleMedicines,
      familyMembers: sampleFamilyMembers,
      doctors: sampleDoctors,
      appointments: sampleAppointments,
      consultations: sampleConsultations,
      notifications: sampleNotifications,
      lastUpdated: new Date().toISOString(),
    };
    writeDatabase(demoData);
    this.syncToSqlite(demoData);
    return demoData;
  },
};
