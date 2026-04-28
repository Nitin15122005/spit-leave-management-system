import { Request, Response } from 'express';
import { LeaveStatus, Role } from '@prisma/client';
import prisma from '../config/database';
import { formatLeave, leaveInclude } from '../utils/formatLeave';
import {
  sendEmail,
  leaveApprovedByTeacherEmail,
  leaveApprovedByHODEmail,
  leaveFullyApprovedEmail,
  leaveRejectedEmail,
} from '../utils/email';

// Map role → status that role sees as "their inbox"
const roleToStatus: Record<string, LeaveStatus> = {
  teacher: LeaveStatus.pending_teacher,
  hod: LeaveStatus.pending_hod,
  dean: LeaveStatus.pending_dean,
};

// GET /api/faculty/pending
export const getPendingLeaves = async (req: Request, res: Response): Promise<void> => {
  const role = req.user!.role as string;
  const status = roleToStatus[role];

  if (!status) {
    res.status(403).json({ success: false, error: 'Not a faculty role' });
    return;
  }

  const pendingLeaves = await prisma.leaveApplication.findMany({
    where: { status },
    include: leaveInclude,
    orderBy: { createdAt: 'asc' },
  });

  res.json({ success: true, pendingLeaves: pendingLeaves.map(formatLeave) });
};

// POST /api/faculty/approve/:leaveId
export const approveLeave = async (req: Request, res: Response): Promise<void> => {
  const leaveId = parseInt(req.params.leaveId);
  const { comment } = req.body as { comment: string };
  const role = req.user!.role;

  const leave = await prisma.leaveApplication.findUnique({ where: { id: leaveId } });
  if (!leave) {
    res.status(404).json({ success: false, error: 'Leave not found' });
    return;
  }

  // Validate leave is in the correct state for this role
  const expectedStatus = roleToStatus[role];
  if (leave.status !== expectedStatus) {
    res.status(400).json({ success: false, error: `Leave is not in ${expectedStatus} status` });
    return;
  }

  let nextStatus: LeaveStatus;
  let updateData: Record<string, string | LeaveStatus> = {};

  if (role === Role.teacher) {
    nextStatus = LeaveStatus.pending_hod;
    updateData = { teacherComment: comment, status: nextStatus };
  } else if (role === Role.hod) {
    nextStatus = LeaveStatus.pending_dean;
    updateData = { hodComment: comment, status: nextStatus };
  } else if (role === Role.dean) {
    nextStatus = LeaveStatus.approved;
    updateData = { deanComment: comment, status: nextStatus };
  } else {
    res.status(403).json({ success: false, error: 'Only teacher/HOD/dean can approve' });
    return;
  }

  await prisma.leaveApplication.update({ where: { id: leaveId }, data: updateData });

  // Fetch student email for notification
  const student = await prisma.user.findUnique({ where: { id: leave.studentId } });
  if (student?.email) {
    let html = '';
    if (role === Role.teacher) html = leaveApprovedByTeacherEmail(student.name, leave.eventName);
    else if (role === Role.hod) html = leaveApprovedByHODEmail(student.name, leave.eventName);
    else {
      const dates = `${leave.leaveDatesFrom.toISOString().split('T')[0]} – ${leave.leaveDatesTo.toISOString().split('T')[0]}`;
      html = leaveFullyApprovedEmail(student.name, leave.eventName, dates);
    }

    sendEmail({ to: student.email, subject: 'Leave Application Update', html }).catch(console.error);
  }

  res.json({ success: true, message: 'Leave approved successfully' });
};

// POST /api/faculty/reject/:leaveId
export const rejectLeave = async (req: Request, res: Response): Promise<void> => {
  const leaveId = parseInt(req.params.leaveId);
  const { comment } = req.body as { comment: string };
  const role = req.user!.role;

  const leave = await prisma.leaveApplication.findUnique({ where: { id: leaveId } });
  if (!leave) {
    res.status(404).json({ success: false, error: 'Leave not found' });
    return;
  }

  const commentField =
    role === Role.teacher ? 'teacherComment'
    : role === Role.hod ? 'hodComment'
    : role === Role.dean ? 'deanComment'
    : null;

  if (!commentField) {
    res.status(403).json({ success: false, error: 'Not authorized to reject' });
    return;
  }

  await prisma.leaveApplication.update({
    where: { id: leaveId },
    data: { status: LeaveStatus.rejected, [commentField]: comment },
  });

  const student = await prisma.user.findUnique({ where: { id: leave.studentId } });
  if (student?.email) {
    const rejectedBy = role === Role.teacher ? 'Class Teacher' : role === Role.hod ? 'HOD' : 'Dean';
    sendEmail({
      to: student.email,
      subject: 'Leave Application Rejected',
      html: leaveRejectedEmail(student.name, leave.eventName, rejectedBy, comment),
    }).catch(console.error);
  }

  res.json({ success: true, message: 'Leave rejected' });
};

// GET /api/faculty/history
export const getApprovalHistory = async (req: Request, res: Response): Promise<void> => {
  const role = req.user!.role;

  // Faculty see leaves they've touched (not pending_teacher anymore etc.)
  const excludeStatuses: LeaveStatus[] = role === Role.teacher
    ? [LeaveStatus.pending_teacher]
    : role === Role.hod
    ? [LeaveStatus.pending_teacher, LeaveStatus.pending_hod]
    : [LeaveStatus.pending_teacher, LeaveStatus.pending_hod]; // Dean: only show dean-level+ leaves

  const history = await prisma.leaveApplication.findMany({
    where: { status: { notIn: excludeStatuses } },
    include: leaveInclude,
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });

  res.json({ success: true, history: history.map(formatLeave) });
};
