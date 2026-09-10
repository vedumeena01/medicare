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

interface DatabaseSchema {
  user: UserProfile;
  reports: MedicalReport[];
  medicines: Medicine[];
  familyMembers: FamilyMember[];
  doctors: Doctor[];
  appointments: Appointment[];
  consultations: Consultation[];
  notifications: NotificationItem[];
  lastUpdated: string;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'medicare.db.json');

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
    fs.writeFileSync(DB_FILE, JSON.stringify(initialCleanData, null, 2), 'utf-8');
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
    if (!parsed.doctors || parsed.doctors.length === 0) {
      parsed.doctors = sampleDoctors;
      changed = true;
    }
    if (!parsed.reports || parsed.reports.length === 0) {
      parsed.reports = sampleReports;
      changed = true;
    }
    if (!parsed.medicines || parsed.medicines.length === 0) {
      parsed.medicines = sampleMedicines;
      changed = true;
    }
    if (!parsed.familyMembers || parsed.familyMembers.length === 0) {
      parsed.familyMembers = sampleFamilyMembers;
      changed = true;
    }
    if (!parsed.appointments || parsed.appointments.length === 0) {
      parsed.appointments = sampleAppointments;
      changed = true;
    }
    if (!parsed.consultations || parsed.consultations.length === 0) {
      parsed.consultations = sampleConsultations;
      changed = true;
    }
    if (!parsed.notifications || parsed.notifications.length === 0) {
      parsed.notifications = sampleNotifications;
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }

    return parsed;
  } catch {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialCleanData, null, 2), 'utf-8');
    return initialCleanData;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  // User Operations
  getUser(): UserProfile {
    const data = ensureDatabaseInitialized();
    return data.user;
  },
  updateUser(updates: Partial<UserProfile>): UserProfile {
    const data = ensureDatabaseInitialized();
    data.user = { ...data.user, ...updates };
    writeDatabase(data);
    return data.user;
  },

  // Report Operations
  getReports(): MedicalReport[] {
    const data = ensureDatabaseInitialized();
    return data.reports;
  },
  getReportById(id: string): MedicalReport | undefined {
    const data = ensureDatabaseInitialized();
    return data.reports.find((r) => r.id === id);
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
    return report;
  },
  deleteReport(id: string): boolean {
    const data = ensureDatabaseInitialized();
    const initialLength = data.reports.length;
    data.reports = data.reports.filter((r) => r.id !== id);
    writeDatabase(data);
    return data.reports.length < initialLength;
  },

  // Medicine Operations
  getMedicines(): Medicine[] {
    const data = ensureDatabaseInitialized();
    return data.medicines;
  },
  saveMedicine(medicine: Omit<Medicine, 'id'> & { id?: string }): Medicine {
    const data = ensureDatabaseInitialized();
    const newMed: Medicine = {
      ...medicine,
      id: medicine.id || 'med-' + Date.now(),
      userId: data.user.id,
    };
    const existingIndex = data.medicines.findIndex((m) => m.id === newMed.id);
    if (existingIndex >= 0) {
      data.medicines[existingIndex] = newMed;
    } else {
      data.medicines.unshift(newMed);
    }
    writeDatabase(data);
    return newMed;
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
    return med;
  },
  deleteMedicine(id: string): boolean {
    const data = ensureDatabaseInitialized();
    const initialLength = data.medicines.length;
    data.medicines = data.medicines.filter((m) => m.id !== id);
    writeDatabase(data);
    return data.medicines.length < initialLength;
  },

  // Family Member Operations
  getFamilyMembers(): FamilyMember[] {
    const data = ensureDatabaseInitialized();
    return data.familyMembers || [];
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
    return newMember;
  },
  deleteFamilyMember(id: string): boolean {
    const data = ensureDatabaseInitialized();
    if (!data.familyMembers) return false;
    const initialLen = data.familyMembers.length;
    data.familyMembers = data.familyMembers.filter((m) => m.id !== id);
    writeDatabase(data);
    return data.familyMembers.length < initialLen;
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

    // Auto-create a notification for the appointment
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
  updateAppointmentStatus(id: string, status: 'Upcoming' | 'Completed' | 'Cancelled'): Appointment | null {
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

  resetDatabase(): DatabaseSchema {
    const cleanData: DatabaseSchema = {
      user: {
        id: 'user-new',
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
    return demoData;
  },
};

