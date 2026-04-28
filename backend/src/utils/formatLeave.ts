import { LeaveApplication, LeaveSubject, LeaveClass } from '@prisma/client';

type FullLeave = LeaveApplication & {
  subjects: (LeaveSubject & { classes: LeaveClass[] })[];
};

export const formatLeave = (leave: FullLeave) => {
  return {
    id: leave.id,
    student_id: leave.studentId,
    student_name: leave.studentName,
    student_uid: leave.studentUid,
    student_class: leave.studentClass,
    student_mobile: leave.studentMobile,
    event_name: leave.eventName,
    organized_by: leave.organizedBy,
    venue: leave.venue,
    event_link: leave.eventLink,
    proof_link: leave.proofLink,
    event_duration_from: leave.eventDurationFrom.toISOString().split('T')[0],
    event_duration_to: leave.eventDurationTo.toISOString().split('T')[0],
    leave_dates_from: leave.leaveDatesFrom.toISOString().split('T')[0],
    leave_dates_to: leave.leaveDatesTo.toISOString().split('T')[0],
    semester: leave.semester,
    subjects: leave.subjects.map((s) => ({
      code: s.subjectCode,
      name: s.subjectName,
      theory_count: s.theoryCount,
      lab_count: s.labCount,
      theory_classes: s.classes
        .filter((c) => c.type === 'theory')
        .map((c) => ({ date: c.date.toISOString().split('T')[0], timing: c.timing })),
      lab_classes: s.classes
        .filter((c) => c.type === 'lab')
        .map((c) => ({
          date: c.date.toISOString().split('T')[0],
          timing: c.timing,
          batch: c.batch ?? '',
        })),
    })),
    total_theory: leave.totalTheory,
    total_lab: leave.totalLab,
    status: leave.status,
    teacher_comment: leave.teacherComment,
    hod_comment: leave.hodComment,
    dean_comment: leave.deanComment,
    coordinator_comment: leave.coordinatorComment,
    attendance_marked: leave.attendanceMarked,
    declaration: leave.declaration,
    created_at: leave.createdAt.toISOString(),
  };
};

// Standard include for Prisma leave queries
export const leaveInclude = {
  subjects: {
    include: {
      classes: true,
    },
  },
};
