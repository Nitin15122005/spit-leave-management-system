/**
 * ============================================
 * API INTEGRATION FILE WITH DEMO DATA
 * ============================================
 * 
 * BACKEND TEAM NOTES:
 * - All API calls are currently using MOCK data
 * - Replace mock implementations with actual backend calls
 * - Search for "BACKEND: Replace with actual API" comments
 * - Data structures are defined below
 * 
 * DEMO USER CREDENTIALS:
 * - Student: uid=2023800110, password=2023800110 (Nitin Sharma)
 * - Teacher (Class Teacher): uid=TEACHER001, password=TEACHER001
 * - HOD: uid=HOD001, password=HOD001
 * - Dean: uid=DEAN001, password=DEAN001
 * - Coordinator: uid=COORD001, password=COORD001
 * 
 * WORKFLOW STATUS:
 * pending_teacher → pending_hod → pending_dean → approved → completed
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============================================
// DEMO DATA STORAGE (Backend: Replace with Database)
// ============================================

// Demo Users
export const DEMO_USERS = [
    { id: 1, uid: '2023800110', name: 'Nitin Sharma', role: 'student', password: '2023800110', class: 'TE', mobile: '9876543210' },
    { id: 2, uid: 'TEACHER001', name: 'Prof. Rajesh Kumar', role: 'teacher', password: 'TEACHER001', department: 'Computer Science' },
    { id: 3, uid: 'HOD001', name: 'Dr. Meera Singh', role: 'hod', password: 'HOD001', department: 'Computer Science' },
    { id: 4, uid: 'DEAN001', name: 'Dr. Sanjay Gupta', role: 'dean', password: 'DEAN001' },
    { id: 5, uid: 'COORD001', name: 'Prof. Anjali Sharma', role: 'coordinator', password: 'COORD001', department: 'Computer Science' },
];

// Demo Leave Applications
export let DEMO_LEAVES = [
    {
        id: 1,
        student_id: 1,
        student_name: 'Nitin Sharma',
        student_uid: '2023800110',
        student_class: 'TE',
        student_mobile: '9876543210',
        event_name: 'National Technical Symposium',
        organized_by: 'CSI Student Chapter',
        venue: 'Main Auditorium',
        event_link: 'https://example.com/event',
        proof_link: 'https://drive.google.com/sample-certificate',
        event_duration_from: '2024-01-15',
        event_duration_to: '2024-01-16',
        leave_dates_from: '2024-01-15',
        leave_dates_to: '2024-01-16',
        semester: 5,
        subjects: [
            {
                code: 'CS321',
                name: 'Natural Language Processing',
                theory_count: 2,
                lab_count: 0,
                theory_classes: [
                    { date: '2024-01-15', timing: '10:00 AM - 11:00 AM' },
                    { date: '2024-01-16', timing: '10:00 AM - 11:00 AM' }
                ],
                lab_classes: []
            },
            {
                code: 'CS308',
                name: 'DevOps Lab',
                theory_count: 0,
                lab_count: 1,
                theory_classes: [],
                lab_classes: [
                    { date: '2024-01-15', timing: '2:00 PM - 5:00 PM', batch: 'A' }
                ]
            }
        ],
        total_theory: 2,
        total_lab: 1,
        status: 'pending_teacher', // pending_teacher → pending_hod → pending_dean → approved → completed
        teacher_comment: null,
        hod_comment: null,
        dean_comment: null,
        coordinator_comment: null,
        created_at: '2024-01-10T10:30:00Z',
        attendance_marked: false,
        declaration: true
    },
    {
        id: 2,
        student_id: 1,
        student_name: 'Nitin Sharma',
        student_uid: '2023800110',
        student_class: 'TE',
        student_mobile: '9876543210',
        event_name: 'Hackathon 2024',
        organized_by: 'GDSC',
        venue: 'Seminar Hall',
        event_link: 'https://example.com/hackathon',
        proof_link: 'https://drive.google.com/hackathon-cert',
        event_duration_from: '2024-01-20',
        event_duration_to: '2024-01-21',
        leave_dates_from: '2024-01-20',
        leave_dates_to: '2024-01-21',
        semester: 5,
        subjects: [
            {
                code: 'CS307',
                name: 'Machine Learning',
                theory_count: 2,
                lab_count: 1,
                theory_classes: [
                    { date: '2024-01-20', timing: '9:00 AM - 10:00 AM' },
                    { date: '2024-01-21', timing: '9:00 AM - 10:00 AM' }
                ],
                lab_classes: [
                    { date: '2024-01-20', timing: '11:00 AM - 1:00 PM', batch: 'B' }
                ]
            }
        ],
        total_theory: 2,
        total_lab: 1,
        status: 'approved',
        teacher_comment: 'Valid participation certificate provided',
        hod_comment: 'Approved',
        dean_comment: null,
        coordinator_comment: null,
        created_at: '2024-01-05T14:20:00Z',
        attendance_marked: false,
        declaration: true
    }
];

// Demo Subjects for Faculty
export const DEMO_SUBJECTS = [
    { id: 1, code: 'CS321', name: 'Natural Language Processing' },
    { id: 2, code: 'CS308', name: 'DevOps Lab' },
    { id: 3, code: 'CS307', name: 'Machine Learning' },
    { id: 4, code: 'CS331', name: 'Business Analytics with Python' },
];

// Demo Students for Faculty
export const DEMO_STUDENTS = [
    { student_id: 1, student_name: 'Nitin Sharma', roll_number: 'CS2023001' },
    { student_id: 2, student_name: 'Amit Patil', roll_number: 'CS2023002' },
    { student_id: 3, student_name: 'Priya Desai', roll_number: 'CS2023003' },
    { student_id: 4, student_name: 'Rahul Verma', roll_number: 'CS2023004' },
];

// ============================================
// HELPER FUNCTION
// ============================================

const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { ...options, headers };
    if (options.body instanceof FormData) delete config.headers['Content-Type'];

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Request failed');
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// ============================================
// AUTHENTICATION APIs
// ============================================

export const login = async (uid, password) => {
    console.log('Login attempt:', { uid, password });

    const user = DEMO_USERS.find(u => u.uid === uid && u.password === password);

    if (user) {
        return {
            success: true,
            token: `demo-token-${user.id}-${Date.now()}`,
            userId: user.id,
            uid: user.uid,
            name: user.name,
            role: user.role,
            class: user.class,
            mobile: user.mobile
        };
    }

    throw new Error('Invalid UID or password');
};

// ============================================
// STUDENT APIs
// ============================================

export const getStudentLeaves = async () => {
    const userId = localStorage.getItem('userId');
    const userLeaves = DEMO_LEAVES.filter(leave => leave.student_id == userId);
    return { leaves: userLeaves };
};

export const applyLeave = async (leaveData) => {
    console.log('Applying leave:', leaveData);

    const newLeave = {
        id: DEMO_LEAVES.length + 1,
        student_id: parseInt(localStorage.getItem('userId')),
        student_uid: localStorage.getItem('userUid'),
        student_name: localStorage.getItem('userName'),
        student_class: localStorage.getItem('userClass'),
        student_mobile: localStorage.getItem('userMobile'),
        ...leaveData.event_details,
        semester: leaveData.semester,
        subjects: leaveData.subjects,
        total_theory: leaveData.total_theory,
        total_lab: leaveData.total_lab,
        status: 'pending_teacher',
        teacher_comment: null,
        hod_comment: null,
        dean_comment: null,
        coordinator_comment: null,
        created_at: new Date().toISOString(),
        attendance_marked: false,
        declaration: leaveData.declaration
    };

    DEMO_LEAVES.unshift(newLeave);
    return { success: true, leaveId: newLeave.id };
};

export const getStudentProfile = async () => {
    const userId = localStorage.getItem('userId');
    const user = DEMO_USERS.find(u => u.id == userId);
    return { name: user?.name, class: user?.class, uid: user?.uid, mobile: user?.mobile };
};

// ============================================
// FACULTY APIs (For Class Teacher, HOD, Dean)
// ============================================

export const getPendingLeaves = async () => {
    const userRole = localStorage.getItem('userRole');
    let statusFilter = '';

    if (userRole === 'teacher') statusFilter = 'pending_teacher';
    else if (userRole === 'hod') statusFilter = 'pending_hod';
    else if (userRole === 'dean') statusFilter = 'pending_dean';
    else statusFilter = 'pending_teacher';

    const pendingLeaves = DEMO_LEAVES.filter(leave => leave.status === statusFilter);
    return { pendingLeaves };
};

export const approveLeave = async (leaveId, comment) => {
    console.log('Approving leave:', leaveId, comment);

    const leaveIndex = DEMO_LEAVES.findIndex(l => l.id === leaveId);
    if (leaveIndex !== -1) {
        const userRole = localStorage.getItem('userRole');

        if (userRole === 'teacher') {
            DEMO_LEAVES[leaveIndex].status = 'pending_hod';
            DEMO_LEAVES[leaveIndex].teacher_comment = comment;
        } else if (userRole === 'hod') {
            DEMO_LEAVES[leaveIndex].status = 'pending_dean';
            DEMO_LEAVES[leaveIndex].hod_comment = comment;
        } else if (userRole === 'dean') {
            DEMO_LEAVES[leaveIndex].status = 'approved';
            DEMO_LEAVES[leaveIndex].dean_comment = comment;
        }
    }

    return { success: true };
};

export const rejectLeave = async (leaveId, comment) => {
    console.log('Rejecting leave:', leaveId, comment);

    const leaveIndex = DEMO_LEAVES.findIndex(l => l.id === leaveId);
    if (leaveIndex !== -1) {
        DEMO_LEAVES[leaveIndex].status = 'rejected';
        const userRole = localStorage.getItem('userRole');

        if (userRole === 'teacher') DEMO_LEAVES[leaveIndex].teacher_comment = comment;
        else if (userRole === 'hod') DEMO_LEAVES[leaveIndex].hod_comment = comment;
        else if (userRole === 'dean') DEMO_LEAVES[leaveIndex].dean_comment = comment;
    }

    return { success: true };
};

// ============================================
// COORDINATOR APIs (Attendance Coordinator)
// ============================================

export const getApprovedLeaves = async () => {
    console.log('Fetching approved leaves for coordinator');

    const approvedLeaves = DEMO_LEAVES.filter(leave =>
        leave.status === 'approved' && !leave.attendance_marked
    );

    return { approvedLeaves };
};

export const markAttendanceAndAcknowledge = async (leaveId, comment) => {
    console.log('Marking attendance for leave:', leaveId, comment);

    const leaveIndex = DEMO_LEAVES.findIndex(l => l.id === leaveId);
    if (leaveIndex !== -1) {
        DEMO_LEAVES[leaveIndex].attendance_marked = true;
        DEMO_LEAVES[leaveIndex].status = 'completed';
        DEMO_LEAVES[leaveIndex].coordinator_comment = comment;
    }

    return {
        success: true,
        message: `Attendance marked successfully for ${DEMO_LEAVES[leaveIndex]?.student_name}. Student has been notified.`
    };
};

// ============================================
// FACULTY LEAVE VIEW APIs (For viewing leaves)
// ============================================

export const getFacultySubjects = async () => {
    return { subjects: DEMO_SUBJECTS };
};

export const getStudentsOnLeave = async (subjectId, date) => {
    console.log('Fetching students on leave:', subjectId, date);

    const subject = DEMO_SUBJECTS.find(s => s.id == subjectId);
    const studentsOnLeave = [];

    DEMO_LEAVES.forEach(leave => {
        if (leave.status === 'approved' || leave.status === 'completed') {
            const hasSubject = leave.subjects.some(s => s.code === subject?.code);
            const dateInRange = date >= leave.leave_dates_from && date <= leave.leave_dates_to;

            if (hasSubject && dateInRange) {
                studentsOnLeave.push({
                    student_id: leave.student_id,
                    student_name: leave.student_name,
                    roll_number: `CS${leave.student_id}`,
                    leave_id: leave.id,
                    from_date: leave.leave_dates_from,
                    to_date: leave.leave_dates_to,
                    reason: leave.event_name,
                    status: leave.status
                });
            }
        }
    });

    return { students_on_leave: studentsOnLeave, total_students: 60, subject_name: subject?.name };
};

export const getSubjectStudents = async (subjectId) => {
    console.log('Fetching subject students:', subjectId);
    return { students: DEMO_STUDENTS };
};

export const markAttendance = async (date, subjectId, attendance) => {
    console.log('Marking attendance:', { date, subjectId, attendance });
    return { success: true };
};

export const acknowledgeStudentLeave = async (studentId, leaveId, message) => {
    console.log('Acknowledging student leave:', { studentId, leaveId, message });

    const leaveIndex = DEMO_LEAVES.findIndex(l => l.id === leaveId);
    if (leaveIndex !== -1) {
        DEMO_LEAVES[leaveIndex].status = 'acknowledged';
        DEMO_LEAVES[leaveIndex].teacher_comment = `ACKNOWLEDGED: ${message}`;
    }

    return {
        success: true,
        message: `Student ${studentId} has been acknowledged. Notification sent.`
    };
};

export const getApprovalHistory = async () => {
    let historyLeaves = DEMO_LEAVES.filter(l => l.status === 'approved' || l.status === 'rejected' || l.status === 'completed');
    return { history: historyLeaves };
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export default {
    login,
    getStudentLeaves,
    getStudentProfile,
    applyLeave,
    getPendingLeaves,
    approveLeave,
    rejectLeave,
    getApprovalHistory,
    getFacultySubjects,
    getStudentsOnLeave,
    getSubjectStudents,
    markAttendance,
    acknowledgeStudentLeave,
    getApprovedLeaves,
    markAttendanceAndAcknowledge
};