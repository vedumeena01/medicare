'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MedicalReport,
  Medicine,
  FamilyMember,
  UserProfile,
  Doctor,
  Appointment,
  Consultation,
  NotificationItem,
  ActiveProfile,
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
} from '@/lib/sampleData';
import { triggerBrowserMedicineAlert } from '@/lib/alarmSound';
import { isOnline, enqueueSyncAction } from '@/lib/offlineSync';

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (emailOrMobile: string, pass?: string) => boolean;
  loginWithGoogle: (email: string, name?: string, avatarUrl?: string) => boolean;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;

  activeMemberId: string | null;
  setActiveMemberId: (id: string | null) => void;
  activeProfile: ActiveProfile;

  reports: MedicalReport[];
  addReport: (report: MedicalReport) => void;
  deleteReport: (id: string) => void;
  getReport: (id: string) => MedicalReport | undefined;

  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'userId'>) => Medicine;
  updateMedicineStatus: (id: string, status: 'Upcoming' | 'Taken' | 'Skipped') => void;
  deleteMedicine: (id: string) => void;

  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  deleteFamilyMember: (id: string) => Promise<void>;

  doctors: Doctor[];
  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'userId'>) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;

  consultations: Consultation[];
  addConsultation: (con: Omit<Consultation, 'id' | 'userId'>) => Promise<Consultation>;

  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => NotificationItem;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  activeReminder: Medicine | null;
  dismissReminder: () => void;
  triggerDemoReminder: (targetMed?: Medicine) => void;

  loadDemoData: () => Promise<void>;
  resetToCleanState: () => Promise<void>;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(sampleUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [reports, setReports] = useState<MedicalReport[]>(sampleReports);
  const [medicines, setMedicines] = useState<Medicine[]>(sampleMedicines);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(sampleFamilyMembers);

  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [consultations, setConsultations] = useState<Consultation[]>(sampleConsultations);
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);

  const [activeReminder, setActiveReminder] = useState<Medicine | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeMemberId, setActiveMemberIdState] = useState<string | null>(null);

  const setActiveMemberId = (id: string | null) => {
    setActiveMemberIdState(id);
    if (id) {
      localStorage.setItem('medicare_active_member', id);
    } else {
      localStorage.removeItem('medicare_active_member');
    }
  };

  const activeProfile: ActiveProfile = React.useMemo(() => {
    if (!activeMemberId || activeMemberId === 'self' || activeMemberId === 'fam-1') {
      return {
        id: 'self',
        isSelf: true,
        name: user?.name || 'Vedprakash',
        relationship: 'Self',
        relationshipHi: 'स्वयं',
        age: user?.age || 28,
        gender: user?.gender || 'Male',
        bloodGroup: user?.bloodGroup || 'B+',
        allergies: user?.allergies || ['Penicillin (Mild)'],
        emergencyContact: user?.emergencyContact || {
          name: 'Ramesh (Father)',
          phone: '+91 98765 11111',
          relation: 'Father',
        },
        healthConditions: ['Mild Vitamin D deficiency'],
      };
    }

    const found = familyMembers.find((m) => m.id === activeMemberId);
    if (found) {
      return {
        id: found.id,
        isSelf: false,
        name: found.name,
        relationship: found.relation,
        relationshipHi: found.relationHi,
        age: found.age,
        gender: found.gender,
        bloodGroup: found.bloodGroup || 'B+',
        allergies: found.allergies || ['No known drug allergies'],
        emergencyContact: found.emergencyContact || {
          name: user?.name || 'Vedprakash',
          phone: user?.mobile || '+91 98765 43210',
          relation: 'Primary Caregiver',
        },
        healthConditions: found.healthConditions || [],
      };
    }

    return {
      id: 'self',
      isSelf: true,
      name: user?.name || 'Vedprakash',
      relationship: 'Self',
      relationshipHi: 'स्वयं',
      age: user?.age || 28,
      gender: user?.gender || 'Male',
      bloodGroup: user?.bloodGroup || 'B+',
      allergies: user?.allergies || ['Penicillin (Mild)'],
      emergencyContact: user?.emergencyContact || {
        name: 'Ramesh (Father)',
        phone: '+91 98765 11111',
        relation: 'Father',
      },
      healthConditions: ['Mild Vitamin D deficiency'],
    };
  }, [activeMemberId, user, familyMembers]);

  // Initialize from persistent backend database with LocalStorage fallback
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('medicare_auth');
      const storedUser = localStorage.getItem('medicare_user');
      const storedReports = localStorage.getItem('medicare_reports');
      const storedMedicines = localStorage.getItem('medicare_medicines');
      const storedFamily = localStorage.getItem('medicare_family');
      const storedActiveMember = localStorage.getItem('medicare_active_member');

      // Schedule initial state hydration to avoid synchronous render cascades
      queueMicrotask(() => {
        if (storedActiveMember) {
          setActiveMemberIdState(storedActiveMember);
        }
        if (storedAuth === 'false') {
          setUser(null);
          setIsAuthenticated(false);
        } else if (storedAuth === 'true' && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch {}
        }
        if (storedReports) {
          try {
            const parsed = JSON.parse(storedReports);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setReports(parsed);
            }
          } catch {}
        }
        if (storedMedicines) {
          try {
            const parsed = JSON.parse(storedMedicines);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMedicines(parsed);
            }
          } catch {}
        }
        if (storedFamily) {
          try {
            const parsed = JSON.parse(storedFamily);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFamilyMembers(parsed);
            }
          } catch {}
        }
      });

      // Fetch user profile from persistent backend only if not explicitly logged out
      if (storedAuth !== 'false') {
        fetch('/api/user')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user) {
              setUser(data.user);
              setIsAuthenticated(true);
              localStorage.setItem('medicare_auth', 'true');
              localStorage.setItem('medicare_user', JSON.stringify(data.user));
            }
          })
          .catch(() => {});
      }

      // Fetch persistent family members
      fetch('/api/family')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.familyMembers)) {
            setFamilyMembers(data.familyMembers);
            localStorage.setItem('medicare_family', JSON.stringify(data.familyMembers));
          }
        })
        .catch(() => {});

      // Fetch persistent reports
      fetch('/api/reports')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.reports)) {
            setReports(data.reports);
            localStorage.setItem('medicare_reports', JSON.stringify(data.reports));
          }
        })
        .catch(() => {});

      // Fetch persistent medicines
      fetch('/api/medicines')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.medicines)) {
            setMedicines(data.medicines);
            localStorage.setItem('medicare_medicines', JSON.stringify(data.medicines));
          }
        })
        .catch(() => {});

      // Fetch appointments & doctors
      fetch('/api/appointments')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (Array.isArray(data.appointments)) setAppointments(data.appointments);
            if (Array.isArray(data.doctors)) setDoctors(data.doctors);
          }
        })
        .catch(() => {});

      // Fetch consultations
      fetch('/api/consultations')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.consultations)) {
            setConsultations(data.consultations);
          }
        })
        .catch(() => {});

      // Fetch notifications
      fetch('/api/notifications')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
        })
        .catch(() => {});
    } catch {
      // Fallback in memory
    }
  }, []);

  const login = (emailOrMobile: string) => {
    const rawName = emailOrMobile.includes('@')
      ? emailOrMobile.split('@')[0]
      : emailOrMobile || 'User';
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    const activeUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: capitalizedName,
      email: emailOrMobile.includes('@') ? emailOrMobile : `${emailOrMobile}@medicare.ai`,
      mobile: '+91 98765 00000',
      age: 28,
      gender: 'Male',
      language: 'en',
    };
    setUser(activeUser);
    setIsAuthenticated(true);
    localStorage.setItem('medicare_auth', 'true');
    localStorage.setItem('medicare_user', JSON.stringify(activeUser));
    return true;
  };

  const loginWithGoogle = (email: string, name?: string, avatarUrl?: string) => {
    const rawName = name || (email.includes('@') ? email.split('@')[0] : email);
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    const googleUser: UserProfile = {
      id: 'usr-google-' + Date.now(),
      name: capitalizedName,
      email: email,
      mobile: '+91 98765 00000',
      age: 28,
      gender: 'Male',
      language: 'en',
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(capitalizedName)}`,
    };

    setUser(googleUser);
    setIsAuthenticated(true);
    localStorage.setItem('medicare_auth', 'true');
    localStorage.setItem('medicare_user', JSON.stringify(googleUser));

    fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUser),
    }).catch(() => {});

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem('medicare_auth', 'false');
    localStorage.removeItem('medicare_user');
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const next = { ...user, ...updated };
    setUser(next);
    localStorage.setItem('medicare_user', JSON.stringify(next));
    fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch(() => {});
  };

  const addReport = (report: MedicalReport) => {
    setReports((prev) => {
      const next = [report, ...prev];
      localStorage.setItem('medicare_reports', JSON.stringify(next));
      return next;
    });
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch(() => {});
  };

  const deleteReport = (id: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('medicare_reports', JSON.stringify(next));
      return next;
    });
    fetch(`/api/reports?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {});
  };

  const getReport = (id: string) => {
    return reports.find((r) => r.id === id) || sampleReports.find((r) => r.id === id);
  };

  const addMedicine = (medData: Omit<Medicine, 'id' | 'userId'>): Medicine => {
    const newMed: Medicine = {
      ...medData,
      id: 'med-' + Date.now(),
      userId: user?.id || 'user-1',
    };
    setMedicines((prev) => {
      const next = [newMed, ...prev];
      localStorage.setItem('medicare_medicines', JSON.stringify(next));
      return next;
    });
    if (!isOnline()) {
      enqueueSyncAction({
        type: 'SYNC_MEDICINE',
        endpoint: '/api/medicines',
        method: 'POST',
        payload: newMed as unknown as Record<string, unknown>,
      }).catch(() => {});
    } else {
      fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed),
      }).catch(() => {
        enqueueSyncAction({
          type: 'SYNC_MEDICINE',
          endpoint: '/api/medicines',
          method: 'POST',
          payload: newMed as unknown as Record<string, unknown>,
        }).catch(() => {});
      });
    }
    return newMed;
  };

  const updateMedicineStatus = (id: string, status: 'Upcoming' | 'Taken' | 'Skipped') => {
    setMedicines((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status,
            takenAt:
              status === 'Taken'
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
          };
        }
        return m;
      });
      localStorage.setItem('medicare_medicines', JSON.stringify(next));
      return next;
    });

    const payload = { id, status };
    if (!isOnline()) {
      enqueueSyncAction({
        type: 'UPDATE_MEDICINE_STATUS',
        endpoint: '/api/medicines',
        method: 'PATCH',
        payload,
      }).catch(() => {});
    } else {
      fetch('/api/medicines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        enqueueSyncAction({
          type: 'UPDATE_MEDICINE_STATUS',
          endpoint: '/api/medicines',
          method: 'PATCH',
          payload,
        }).catch(() => {});
      });
    }
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem('medicare_medicines', JSON.stringify(next));
      return next;
    });
    fetch(`/api/medicines?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {});
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    fetch('/api/family', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.familyMember) {
          setFamilyMembers((prev) => {
            const next = [...prev, data.familyMember];
            localStorage.setItem('medicare_family', JSON.stringify(next));
            return next;
          });
        }
      })
      .catch(() => {
        const newMember: FamilyMember = {
          ...member,
          id: 'fam-' + Date.now(),
        };
        setFamilyMembers((prev) => {
          const next = [...prev, newMember];
          localStorage.setItem('medicare_family', JSON.stringify(next));
          return next;
        });
      });
  };

  const deleteFamilyMember = async (id: string): Promise<void> => {
    setFamilyMembers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem('medicare_family', JSON.stringify(next));
      return next;
    });
    try {
      await fetch(`/api/family?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch {}
  };

  const bookAppointment = async (
    aptData: Omit<Appointment, 'id' | 'createdAt' | 'userId'>
  ): Promise<Appointment> => {
    const payload = {
      ...aptData,
      userId: user?.id || 'user-1',
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setAppointments((prev) => [data.appointment, ...prev]);
        // Refresh notifications as one was auto-created
        fetch('/api/notifications')
          .then((r) => r.json())
          .then((nd) => {
            if (nd.success) setNotifications(nd.notifications);
          });
        return data.appointment;
      }
    } catch {
      // Fallback
    }

    const fallbackApt: Appointment = {
      ...payload,
      id: 'apt-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Upcoming',
    };
    setAppointments((prev) => [fallbackApt, ...prev]);
    return fallbackApt;
  };

  const cancelAppointment = async (id: string): Promise<void> => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a))
    );
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Cancelled' }),
      });
    } catch {}
  };

  const addConsultation = async (
    conData: Omit<Consultation, 'id' | 'userId'>
  ): Promise<Consultation> => {
    const payload = {
      ...conData,
      userId: user?.id || 'user-1',
    };
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.consultation) {
        setConsultations((prev) => [data.consultation, ...prev]);
        return data.consultation;
      }
    } catch {}

    const fallbackCon: Consultation = {
      ...payload,
      id: 'con-' + Date.now(),
    };
    setConsultations((prev) => [fallbackCon, ...prev]);
    return fallbackCon;
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>
  ): NotificationItem => {
    const newItem: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
    if (!isOnline()) {
      enqueueSyncAction({
        type: 'ADD_NOTIFICATION',
        endpoint: '/api/notifications',
        method: 'POST',
        payload: newItem as unknown as Record<string, unknown>,
      }).catch(() => {});
    } else {
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      }).catch(() => {
        enqueueSyncAction({
          type: 'ADD_NOTIFICATION',
          endpoint: '/api/notifications',
          method: 'POST',
          payload: newItem as unknown as Record<string, unknown>,
        }).catch(() => {});
      });
    }
    return newItem;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  };

  const dismissReminder = () => {
    setActiveReminder(null);
  };

  const triggerDemoReminder = (targetMed?: Medicine) => {
    const fallbackMed: Medicine = medicines[0] || {
      id: 'med-dose-alert',
      userId: 'user-active',
      name: 'Prescribed Medicine',
      strength: '500mg',
      form: 'Tablet' as const,
      dosageInstruction: '1 tablet after meals with water',
      frequency: 'Once daily' as const,
      timeSlot: 'Morning' as const,
      scheduledTime: '09:00 AM',
      startDate: '2026-06-01',
      status: 'Upcoming' as const,
      description: 'Prescribed clinical dose',
      commonUses: ['Pain relief', 'Fever reduction'],
      precautions: ['Take after food'],
      sideEffects: ['None expected at standard dose'],
      whenToSeekHelp: 'If fever persists over 48 hours',
    };
    const medToAlert: Medicine = targetMed || fallbackMed;
    setActiveReminder(medToAlert);
    triggerBrowserMedicineAlert(
      medToAlert.name,
      medToAlert.strength || medToAlert.dosageInstruction,
      medToAlert.scheduledTime
    );
  };

  const loadDemoData = async () => {
    try {
      const res = await fetch('/api/demo-pack', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.reports) {
          setReports(json.data.reports);
          localStorage.setItem('medicare_reports', JSON.stringify(json.data.reports));
        }
        if (json.data.medicines) {
          setMedicines(json.data.medicines);
          localStorage.setItem('medicare_medicines', JSON.stringify(json.data.medicines));
        }
        if (json.data.familyMembers) setFamilyMembers(json.data.familyMembers);
        if (json.data.appointments) setAppointments(json.data.appointments);
        if (json.data.consultations) setConsultations(json.data.consultations);
        if (json.data.notifications) setNotifications(json.data.notifications);
        if (json.data.doctors) setDoctors(json.data.doctors);
        if (json.data.user) {
          setUser(json.data.user);
          setIsAuthenticated(true);
          localStorage.setItem('medicare_auth', 'true');
          localStorage.setItem('medicare_user', JSON.stringify(json.data.user));
        }
      }
    } catch {
      // ignore
    }
  };

  const resetToCleanState = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        setReports([]);
        setMedicines([]);
        setFamilyMembers([]);
        setAppointments([]);
        setConsultations([]);
        setNotifications([]);
        localStorage.removeItem('medicare_reports');
        localStorage.removeItem('medicare_medicines');
        localStorage.removeItem('medicare_family');
        localStorage.removeItem('medicare_user');
      }
    } catch {
      // ignore
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        logout,
        updateUser,
        activeMemberId,
        setActiveMemberId,
        activeProfile,
        reports,
        addReport,
        deleteReport,
        getReport,
        medicines,
        addMedicine,
        updateMedicineStatus,
        deleteMedicine,
        familyMembers,
        addFamilyMember,
        deleteFamilyMember,
        doctors,
        appointments,
        bookAppointment,
        cancelAppointment,
        consultations,
        addConsultation,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeReminder,
        dismissReminder,
        triggerDemoReminder,
        loadDemoData,
        resetToCleanState,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
