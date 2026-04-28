/**
 * ============================================
 * API INTEGRATION FILE
 * ============================================
 *
 * All functions call the real Express/Prisma backend.
 * Base URL is read from REACT_APP_API_URL (.env).
 *
 * WORKFLOW STATUS:
 * pending_teacher → pending_hod → pending_dean → approved → completed
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============================================
// HELPER FUNCTION
// ============================================

const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { ...options, headers };
    if (options.body instanceof FormData) delete config.headers['Content-Type'];

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
};

// ============================================
// AUTHENTICATION APIs
// ============================================

export const login = async (uid, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json(); // { success, token, userId, uid, name, role, class, mobile }
};

export const getCurrentUser = async () => {
    return apiCall('/auth/me'); // { success, user }
};

// ============================================
// STUDENT APIs
// ============================================

export const getStudentProfile = async () => {
    return apiCall('/student/profile'); // { success, name, class, uid, mobile }
};

export const getStudentLeaves = async () => {
    return apiCall('/student/leaves'); // { success, leaves }
};

export const applyLeave = async (leaveData) => {
    return apiCall('/student/leaves', {
        method: 'POST',
        body: JSON.stringify(leaveData),
    }); // { success, leaveId }
};

// ============================================
// FACULTY APIs (Class Teacher, HOD, Dean)
// ============================================

export const getPendingLeaves = async () => {
    return apiCall('/faculty/pending'); // { success, pendingLeaves }
};

export const approveLeave = async (leaveId, comment) => {
    return apiCall(`/faculty/approve/${leaveId}`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
    }); // { success }
};

export const rejectLeave = async (leaveId, comment) => {
    return apiCall(`/faculty/reject/${leaveId}`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
    }); // { success }
};

export const getApprovalHistory = async () => {
    return apiCall('/faculty/history'); // { success, history }
};

// ============================================
// COORDINATOR APIs
// ============================================

export const getApprovedLeaves = async () => {
    return apiCall('/coordinator/approved'); // { success, approvedLeaves }
};

export const markAttendanceAndAcknowledge = async (leaveId, comment) => {
    return apiCall(`/coordinator/mark-attendance/${leaveId}`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
    }); // { success, message }
};

export const getCompletedLeaves = async () => {
    return apiCall('/coordinator/completed'); // { success, completedLeaves }
};

// ============================================
// FILE UPLOAD API
// ============================================

export const uploadProof = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall('/upload/proof', {
        method: 'POST',
        body: formData,
    }); // { success, url }
};

// ============================================
// FACULTY LEAVE-VIEW HELPERS
// TODO: These endpoints are not yet implemented in the backend.
//       Add the corresponding routes/controllers before enabling.
// ============================================

export const getFacultySubjects = async () => {
    // TODO: return apiCall('/faculty/subjects');
    throw new Error('getFacultySubjects: backend endpoint not yet implemented');
};

export const getStudentsOnLeave = async (subjectId, date) => {
    // TODO: return apiCall(`/faculty/students-on-leave?subjectId=${subjectId}&date=${date}`);
    throw new Error('getStudentsOnLeave: backend endpoint not yet implemented');
};

export const getSubjectStudents = async (subjectId) => {
    // TODO: return apiCall(`/faculty/subjects/${subjectId}/students`);
    throw new Error('getSubjectStudents: backend endpoint not yet implemented');
};

export const markAttendance = async (date, subjectId, attendance) => {
    // TODO: return apiCall('/faculty/mark-attendance', { method: 'POST', body: JSON.stringify({ date, subjectId, attendance }) });
    throw new Error('markAttendance: backend endpoint not yet implemented');
};

export const acknowledgeStudentLeave = async (studentId, leaveId, message) => {
    // TODO: return apiCall(`/faculty/acknowledge/${leaveId}`, { method: 'POST', body: JSON.stringify({ studentId, message }) });
    throw new Error('acknowledgeStudentLeave: backend endpoint not yet implemented');
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

const api = {
    login,
    getCurrentUser,
    getStudentProfile,
    getStudentLeaves,
    applyLeave,
    getPendingLeaves,
    approveLeave,
    rejectLeave,
    getApprovalHistory,
    getApprovedLeaves,
    markAttendanceAndAcknowledge,
    getCompletedLeaves,
    uploadProof,
    getFacultySubjects,
    getStudentsOnLeave,
    getSubjectStudents,
    markAttendance,
    acknowledgeStudentLeave,
};

export default api;