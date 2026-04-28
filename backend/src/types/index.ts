import { Role, LeaveStatus } from '@prisma/client';

// ============================================
// AUTH TYPES
// ============================================
export interface JwtPayload {
  userId: number;
  uid: string;
  role: Role;
}

export interface AuthRequest extends Express.Request {
  user?: JwtPayload;
}

// ============================================
// REQUEST BODY TYPES
// ============================================
export interface LoginBody {
  uid: string;
  password: string;
}

export interface ApplyLeaveBody {
  event_details: {
    event_name: string;
    organized_by: string;
    venue: string;
    event_link?: string;
    proof_link?: string;
    event_duration_from: string;
    event_duration_to: string;
    leave_dates_from: string;
    leave_dates_to: string;
  };
  semester: number;
  subjects: SubjectInput[];
  total_theory: number;
  total_lab: number;
  declaration: boolean;
}

export interface SubjectInput {
  code: string;
  name: string;
  theory_count: number;
  lab_count: number;
  theory_classes: ClassInput[];
  lab_classes: LabClassInput[];
}

export interface ClassInput {
  date: string;
  timing: string;
}

export interface LabClassInput extends ClassInput {
  batch: string;
}

export interface ActionLeaveBody {
  comment: string;
}

// ============================================
// RESPONSE TYPES
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LeaveWithDetails {
  id: number;
  student_id: number;
  student_name: string;
  student_uid: string;
  student_class: string;
  student_mobile: string;
  event_name: string;
  organized_by: string;
  venue: string;
  event_link: string | null;
  proof_link: string | null;
  event_duration_from: string;
  event_duration_to: string;
  leave_dates_from: string;
  leave_dates_to: string;
  semester: number;
  subjects: SubjectDetail[];
  total_theory: number;
  total_lab: number;
  status: LeaveStatus;
  teacher_comment: string | null;
  hod_comment: string | null;
  dean_comment: string | null;
  coordinator_comment: string | null;
  attendance_marked: boolean;
  declaration: boolean;
  created_at: string;
}

export interface SubjectDetail {
  code: string;
  name: string;
  theory_count: number;
  lab_count: number;
  theory_classes: ClassDetail[];
  lab_classes: LabClassDetail[];
}

export interface ClassDetail {
  date: string;
  timing: string;
}

export interface LabClassDetail extends ClassDetail {
  batch: string;
}
