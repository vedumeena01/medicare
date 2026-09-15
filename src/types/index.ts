export type Language = 'en' | 'hi';

export type ReportType =
  | 'Blood Test'
  | 'Urine Test'
  | 'X-Ray'
  | 'MRI'
  | 'CT Scan'
  | 'Ultrasound'
  | 'Health Checkup'
  | 'Prescription'
  | 'Other';

export type FindingStatus = 'low' | 'normal' | 'high';

export interface MedicalFinding {
  test: string;
  testHi?: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: FindingStatus;
  explanation: string;
  explanationHi?: string;
  possibleMeaning: string;
  possibleMeaningHi?: string;
  confidence: number; // e.g. 0.98
}

export interface NormalValueItem {
  test: string;
  testHi?: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal';
}

export interface MedicalTermExplanation {
  term: string;
  termHi?: string;
  simpleMeaning: string;
  simpleMeaningHi?: string;
  whyMeasured: string;
  whyMeasuredHi?: string;
}

export interface DoctorQuestion {
  id: string;
  question: string;
  questionHi?: string;
  category?: string;
}

export interface SuggestionItem {
  category: 'doctor' | 'lifestyle' | 'testing' | 'general';
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
}

export interface RiskAnalysisItem {
  name: string;
  nameHi?: string;
  riskPercentage: number;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  riskLevelHi?: string;
  color: string;
}

export interface TrendPoint {
  month: string;
  value: number;
}

export interface ReportComparison {
  previousReportName: string;
  previousDate: string;
  currentReportName: string;
  currentDate: string;
  comparisons: {
    test: string;
    oldValue: string;
    newValue: string;
    referenceRange: string;
    change: 'improved' | 'declined' | 'stable';
    changeText: string;
    changeTextHi?: string;
  }[];
}

export interface MedicalReport {
  id: string;
  userId: string;
  familyMemberId?: string;
  fileName: string;
  fileUrl?: string;
  reportType: ReportType;
  uploadedAt: string;
  status: 'Completed' | 'Processing' | 'Failed';
  language: Language;
  overallScore?: number;
  summary: string;
  summaryHi: string;
  findings: MedicalFinding[];
  normalValues: NormalValueItem[];
  medicalTerms: MedicalTermExplanation[];
  doctorQuestions: DoctorQuestion[];
  suggestions: SuggestionItem[];
  riskAnalysis: RiskAnalysisItem[];
  comparison?: ReportComparison;
  confidenceThresholdMet: boolean;
  notes?: string;
}

export type MedicineFrequency =
  | 'Once daily'
  | 'Twice daily'
  | 'Three times daily'
  | 'Custom';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface Medicine {
  id: string;
  userId: string;
  familyMemberId?: string;
  name: string;
  strength: string; // e.g. "650 mg", "5 mg"
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Ointment';
  manufacturer?: string;
  dosageInstruction: string; // e.g. "1 tablet after lunch"
  dosageInstructionHi?: string;
  frequency: MedicineFrequency;
  timeSlot: TimeSlot;
  scheduledTime: string; // "02:00 PM"
  startDate: string;
  endDate?: string;
  status: 'Upcoming' | 'Taken' | 'Skipped';
  takenAt?: string;
  notes?: string;
  description: string;
  descriptionHi?: string;
  commonUses: string[];
  commonUsesHi?: string[];
  precautions: string[];
  precautionsHi?: string[];
  sideEffects: string[];
  sideEffectsHi?: string[];
  whenToSeekHelp: string;
  whenToSeekHelpHi?: string;
  extractedFromPhoto?: boolean;
  confidenceScore?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  relationHi?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatar?: string;
  healthConditions?: string[];
  bloodGroup?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface ActiveProfile {
  id: string;
  isSelf: boolean;
  name: string;
  relationship: string;
  relationshipHi?: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  healthConditions: string[];
}

export interface Doctor {
  id: string;
  name: string;
  nameHi?: string;
  specialty: string;
  specialtyHi?: string;
  qualification: string;
  experienceYears: number;
  hospital: string;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  avatarUrl?: string;
  availableDays: string[];
  slots: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital: string;
  date: string; // e.g. "2026-06-25"
  timeSlot: string; // e.g. "10:30 AM"
  type: 'In-Person' | 'Video Call';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  reasonForVisit: string;
  symptoms?: string[];
  attachedReportIds?: string[];
  notes?: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  appointmentId?: string;
  userId: string;
  doctorName: string;
  specialty: string;
  date: string;
  symptoms: string[];
  doctorNotes: string;
  doctorNotesHi?: string;
  diagnosisSuggestion?: string;
  prescribedMedicines?: {
    name: string;
    dosage: string;
    duration: string;
  }[];
  attachedReportNames?: string[];
}

export type NotificationChannel = 'push' | 'whatsapp' | 'sms' | 'email';

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'medicine' | 'appointment' | 'report' | 'system';
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  channel?: NotificationChannel;
  recipientPhone?: string;
  recipientName?: string;
  deliveryStatus?: 'delivered' | 'pending' | 'failed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textHi?: string;
  category?: 'general' | 'symptom' | 'report' | 'lifestyle';
  timestamp: string;
  sources?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  language: Language;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bloodGroup?: string;
  allergies?: string[];
  avatarUrl?: string;
}

export type DrugInteractionSeverity = 'safe' | 'caution' | 'moderate' | 'severe';

export interface DrugInteractionItem {
  drug1: string;
  drug2: string;
  severity: DrugInteractionSeverity;
  title: string;
  titleHi?: string;
  mechanism: string;
  mechanismHi?: string;
  recommendation: string;
  recommendationHi?: string;
  symptomsToWatch?: string[];
  symptomsToWatchHi?: string[];
}

export interface FoodInteractionItem {
  drug: string;
  foodOrBeverage: string;
  foodOrBeverageHi?: string;
  effect: string;
  effectHi?: string;
  recommendation: string;
  recommendationHi?: string;
}

export interface AllergyAlertItem {
  drug: string;
  matchedAllergy: string;
  matchedAllergyHi?: string;
  severity: 'moderate' | 'severe';
  warning: string;
  warningHi?: string;
}

export interface DrugInteractionAnalysisResult {
  overallRisk: 'Safe' | 'Moderate Risk' | 'High Risk';
  overallRiskHi: string;
  overallScore: number;
  summary: string;
  summaryHi: string;
  interactions: DrugInteractionItem[];
  foodInteractions: FoodInteractionItem[];
  allergyAlerts: AllergyAlertItem[];
  generalAdvice: string[];
  generalAdviceHi: string[];
  questionsForDoctor: string[];
  questionsForDoctorHi: string[];
  isLiveAI: boolean;
  message?: string;
}

export type FeedbackCategory = 'bug' | 'feature' | 'translation' | 'accuracy' | 'general';

export interface FeedbackItem {
  id: string;
  userId: string;
  userName?: string;
  rating: number; // 1-5
  category: FeedbackCategory;
  description: string;
  timestamp: string;
  status: 'new' | 'in-review' | 'resolved';
  deviceDetails?: {
    browser?: string;
    os?: string;
    screenResolution?: string;
    language?: string;
  };
}

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
  path?: string;
}

