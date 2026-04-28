import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApplyLeaveBody } from '../types';
import { formatLeave, leaveInclude } from '../utils/formatLeave';
import { sendEmail, leaveSubmittedEmail } from '../utils/email';

// GET /api/student/leaves
export const getStudentLeaves = async (req: Request, res: Response): Promise<void> => {
  const leaves = await prisma.leaveApplication.findMany({
    where: { studentId: req.user!.userId },
    include: leaveInclude,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, leaves: leaves.map(formatLeave) });
};

// GET /api/student/profile
export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { name: true, uid: true, class: true, mobile: true, email: true },
  });

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  res.json({ success: true, ...user });
};

// POST /api/student/leaves
export const applyLeave = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as ApplyLeaveBody;
  const userId = req.user!.userId;

  // Fetch student info
  const student = await prisma.user.findUnique({ where: { id: userId } });
  if (!student) {
    res.status(404).json({ success: false, error: 'Student not found' });
    return;
  }

  const { event_details, semester, subjects, total_theory, total_lab, declaration } = body;

  const leave = await prisma.leaveApplication.create({
    data: {
      studentId: userId,
      studentName: student.name,
      studentUid: student.uid,
      studentClass: student.class ?? '',
      studentMobile: student.mobile ?? '',
      eventName: event_details.event_name,
      organizedBy: event_details.organized_by,
      venue: event_details.venue,
      eventLink: event_details.event_link || null,
      proofLink: event_details.proof_link || null,
      eventDurationFrom: new Date(event_details.event_duration_from),
      eventDurationTo: new Date(event_details.event_duration_to),
      leaveDatesFrom: new Date(event_details.leave_dates_from),
      leaveDatesTo: new Date(event_details.leave_dates_to),
      semester,
      totalTheory: total_theory,
      totalLab: total_lab,
      declaration,
      subjects: {
        create: subjects.map((s) => ({
          subject: { connect: { code: s.code } },
          subjectCode: s.code,
          subjectName: s.name,
          theoryCount: s.theory_count,
          labCount: s.lab_count,
          classes: {
            create: [
              ...s.theory_classes.map((c) => ({
                date: new Date(c.date),
                timing: c.timing,
                type: 'theory',
                batch: null,
              })),
              ...s.lab_classes.map((c) => ({
                date: new Date(c.date),
                timing: c.timing,
                type: 'lab',
                batch: c.batch,
              })),
            ],
          },
        })),
      },
    },
    include: leaveInclude,
  });

  // Fire-and-forget email
  if (student.email) {
    sendEmail({
      to: student.email,
      subject: 'Leave Application Submitted',
      html: leaveSubmittedEmail(student.name, event_details.event_name),
    }).catch(console.error);
  }

  res.status(201).json({
    success: true,
    leaveId: leave.id,
    message: 'Leave application submitted successfully',
  });
};
