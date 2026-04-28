import { z } from 'zod';

// ============================================
// AUTH
// ============================================
export const loginSchema = z.object({
  uid: z.string().min(1, 'UID is required'),
  password: z.string().min(1, 'Password is required'),
});

// ============================================
// LEAVE APPLICATION
// ============================================
const classSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  timing: z.string().min(1),
});

const labClassSchema = classSchema.extend({
  batch: z.string().min(1),
});

const subjectSchema = z.object({
  code: z.string().min(1, 'Subject code is required'),
  name: z.string().min(1, 'Subject name is required'),
  theory_count: z.number().int().min(0),
  lab_count: z.number().int().min(0),
  theory_classes: z.array(classSchema),
  lab_classes: z.array(labClassSchema),
});

export const applyLeaveSchema = z.object({
  event_details: z.object({
    event_name: z.string().min(2, 'Event name is required'),
    organized_by: z.string().min(1, 'Organizer is required'),
    venue: z.string().min(1, 'Venue is required'),
    event_link: z.string().url().optional().or(z.literal('')),
    proof_link: z.string().optional(),
    event_duration_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    event_duration_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    leave_dates_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    leave_dates_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  }),
  semester: z.number().int().min(1).max(8),
  subjects: z.array(subjectSchema).min(1, 'At least one subject is required'),
  total_theory: z.number().int().min(0),
  total_lab: z.number().int().min(0),
  declaration: z.literal(true, { errorMap: () => ({ message: 'Declaration must be accepted' }) }),
});

// ============================================
// ACTIONS (approve / reject)
// ============================================
export const actionSchema = z.object({
  comment: z.string().min(2, 'Comment is required (min 2 characters)'),
});

// ============================================
// MARK ATTENDANCE
// ============================================
export const markAttendanceSchema = z.object({
  comment: z.string().min(2, 'Acknowledgment message is required'),
});
