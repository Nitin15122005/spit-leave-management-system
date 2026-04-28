import { Request, Response } from 'express';
import { LeaveStatus } from '@prisma/client';
import prisma from '../config/database';
import { formatLeave, leaveInclude } from '../utils/formatLeave';
import { sendEmail, attendanceMarkedEmail } from '../utils/email';

// GET /api/coordinator/approved
export const getApprovedLeaves = async (_req: Request, res: Response): Promise<void> => {
  const approvedLeaves = await prisma.leaveApplication.findMany({
    where: { status: LeaveStatus.approved, attendanceMarked: false },
    include: leaveInclude,
    orderBy: { updatedAt: 'asc' },
  });

  res.json({ success: true, approvedLeaves: approvedLeaves.map(formatLeave) });
};

// POST /api/coordinator/mark-attendance/:leaveId
export const markAttendanceAndAcknowledge = async (req: Request, res: Response): Promise<void> => {
  const leaveId = parseInt(req.params.leaveId);
  const { comment } = req.body as { comment: string };

  const leave = await prisma.leaveApplication.findUnique({ where: { id: leaveId } });
  if (!leave) {
    res.status(404).json({ success: false, error: 'Leave not found' });
    return;
  }

  if (leave.status !== LeaveStatus.approved) {
    res.status(400).json({ success: false, error: 'Leave must be in approved status' });
    return;
  }

  await prisma.leaveApplication.update({
    where: { id: leaveId },
    data: {
      status: LeaveStatus.completed,
      attendanceMarked: true,
      coordinatorComment: comment,
    },
  });

  const student = await prisma.user.findUnique({ where: { id: leave.studentId } });
  if (student?.email) {
    sendEmail({
      to: student.email,
      subject: '✅ Attendance Marked for Your Leave',
      html: attendanceMarkedEmail(student.name, leave.eventName, comment),
    }).catch(console.error);
  }

  res.json({
    success: true,
    message: `Attendance marked successfully for ${leave.studentName}. Student has been notified.`,
  });
};

// GET /api/coordinator/completed
export const getCompletedLeaves = async (_req: Request, res: Response): Promise<void> => {
  const completed = await prisma.leaveApplication.findMany({
    where: { status: LeaveStatus.completed },
    include: leaveInclude,
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  res.json({ success: true, completed: completed.map(formatLeave) });
};
