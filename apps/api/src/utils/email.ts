import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!process.env.SMTP_USER) {
    console.log('[EMAIL SKIPPED - SMTP not configured]', options.subject, '→', options.to);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Leave System <noreply@spit.ac.in>',
    ...options,
  });
};

// ============================================
// EMAIL TEMPLATES
// ============================================

export const leaveSubmittedEmail = (studentName: string, eventName: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #1e40af;">Leave Application Submitted</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your leave application for <strong>${eventName}</strong> has been submitted successfully and is now pending Class Teacher review.</p>
    <p style="color: #6b7280; font-size: 14px;">You will receive updates as your application progresses through the approval workflow.</p>
    <hr/>
    <p style="font-size: 12px; color: #9ca3af;">Leave Management System – Sardar Patel Institute of Technology</p>
  </div>
`;

export const leaveApprovedByTeacherEmail = (studentName: string, eventName: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #059669;">Application Approved by Class Teacher</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your leave application for <strong>${eventName}</strong> has been approved by your Class Teacher and forwarded to the HOD.</p>
    <hr/>
    <p style="font-size: 12px; color: #9ca3af;">Leave Management System – Sardar Patel Institute of Technology</p>
  </div>
`;

export const leaveApprovedByHODEmail = (studentName: string, eventName: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #059669;">Application Approved by HOD</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your leave application for <strong>${eventName}</strong> has been approved by the HOD and forwarded to the Dean for final approval.</p>
    <hr/>
    <p style="font-size: 12px; color: #9ca3af;">Leave Management System – Sardar Patel Institute of Technology</p>
  </div>
`;

export const leaveFullyApprovedEmail = (studentName: string, eventName: string, leaveDates: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #059669;">🎉 Leave Fully Approved!</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your leave application for <strong>${eventName}</strong> has been fully approved by all authorities.</p>
    <p><strong>Leave Dates:</strong> ${leaveDates}</p>
    <p>The Attendance Coordinator will mark your attendance accordingly.</p>
    <hr/>
    <p style="font-size: 12px; color: #9ca3af;">Leave Management System – Sardar Patel Institute of Technology</p>
  </div>
`;

export const leaveRejectedEmail = (studentName: string, eventName: string, rejectedBy: string, reason: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #dc2626;">Leave Application Rejected</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your leave application for <strong>${eventName}</strong> has been rejected by <strong>${rejectedBy}</strong>.</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <hr/>
    <p style="font-size: 12px; color: #9ca3af;">Leave Management System – Sardar Patel Institute of Technology</p>
  </div>
`;

export const attendanceMarkedEmail = (studentName: string, eventName: string, message: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #10b981;">✅ Attendance Marked</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your attendance has been marked for your leave during <strong>${eventName}</strong>.</p>
    <p><em>${message}</em></p>
    <hr/>
    <p style="font-size: 12px; color: #9ca3af;">Leave Management System – Sardar Patel Institute of Technology</p>
  </div>
`;
