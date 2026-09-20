export type JobCategory =
  | "all"
  | "retail_sales"
  | "delivery_logistics"
  | "office_admin"
  | "skilled_trades"
  | "daily_wage"
  | "hospitality_cooking"
  | "security_guard"
  | "driver_transport"
  | "domestic_helper"
  | "healthcare_nurse"
  | "teaching_tutor";

export type PayType = "monthly" | "daily" | "hourly";

export interface JobOpportunity {
  id: string;
  title: string;
  titleHi?: string;
  company: string;
  category: JobCategory;
  location: string;
  locality: string;
  landmark: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  salary: string;
  payType: PayType;
  payAmountNumeric: number;
  workHours: string;
  timings: string;
  vacancies: number;
  isUrgent: boolean;
  isVerified: boolean;
  immediateJoining: boolean;
  postedTimeAgo: string;
  timestamp: number;
  description: string;
  descriptionHi?: string;
  requirements: string[];
  perks: string[];
  contactPerson: string;
  contactPhone: string;
  contactWhatsapp: string;
  minEducation: string;
  minExperience: string;
}

export interface JobNotification {
  id: string;
  jobId: string;
  title: string;
  message: string;
  distanceKm: number;
  locality: string;
  salary: string;
  timestamp: number;
  read: boolean;
  urgency: "urgent" | "normal";
  company: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  location: string;
  pincode: string;
  latitude: number;
  longitude: number;
  skills: string[];
  experience: string;
  education: string;
  preferredWorkType: string;
  preferredCategory: JobCategory;
  availability: "immediate" | "within_week" | "flexible";
  bio: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  salary: string;
  location: string;
  appliedAt: number;
  status: "applied" | "reviewing" | "interview_scheduled" | "hired" | "rejected";
  applicantName: string;
  applicantPhone: string;
  customNote?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  maxRadiusKm: number;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  minPayThreshold: number;
  immediateOnly: boolean;
}
