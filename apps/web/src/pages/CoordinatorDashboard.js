/**
 * COORDINATOR DASHBOARD - For Attendance Coordinator
 * ===================================================
 * 
 * WORKFLOW:
 * - Views all approved leave requests (status: approved)
 * - Marks attendance and acknowledges student
 * - After marking, status becomes 'completed'
 * - Student can see that attendance is marked
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getApprovedLeaves, markAttendanceAndAcknowledge } from '../api/api';

const CoordinatorDashboard = () => {
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [comment, setComment] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadApprovedLeaves();
    }, []);

    const loadApprovedLeaves = async () => {
        try {
            setLoading(true);
            const response = await getApprovedLeaves();
            setApprovedLeaves(response.approvedLeaves || []);
        } catch (err) {
            setError('Failed to load approved leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = (leave) => {
        setSelectedLeave(leave);
        setComment('');
        setShowModal(true);
    };

    const submitAttendance = async () => {
        if (!comment.trim()) {
            setError('Please enter acknowledgment message');
            return;
        }

        setSubmitting(true);
        try {
            const response = await markAttendanceAndAcknowledge(selectedLeave.id, comment);
            if (response.success) {
                setError('');
                setSuccess(response.message);
                setShowModal(false);
                loadApprovedLeaves();
                setTimeout(() => setSuccess(''), 4000);
            }
        } catch (err) {
            setError('Failed to mark attendance. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = {
        page: { minHeight: '100vh', background: '#F9FAFB' },
        container: { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' },
        header: { marginBottom: '32px' },
        title: { fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' },
        subtitle: { fontSize: '14px', color: '#6B7280' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' },
        statCard: { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px 24px' },
        statLabel: { fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '8px' },
        statValue: { fontSize: '32px', fontWeight: '600', color: '#111827' },
        statValueSmall: { fontSize: '18px', fontWeight: '600', color: '#111827' },
        mainCard: { background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' },
        cardHeader: { padding: '20px 24px', borderBottom: '1px solid #E5E7EB' },
        cardTitle: { fontSize: '16px', fontWeight: '600', color: '#111827' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: '#6B7280', borderBottom: '1px solid #E5E7EB' },
        td: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #F0F0F0' },
        btnSuccess: { background: '#10b981', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#FFFFFF', borderRadius: '16px', width: '480px', maxWidth: '90%', padding: '24px' },
        modalTitle: { fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
        modalInfo: { background: '#F9FAFB', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' },
        textarea: { width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', minHeight: '100px', marginBottom: '20px', outline: 'none' },
        modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
        btnCancel: { background: '#FFFFFF', color: '#6B7280', border: '1px solid #D1D5DB', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
        alert: { padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' },
        alertError: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' },
        alertSuccess: { background: '#ECFDF5', color: '#059669', border: '1px solid #D1FAE5' },
        emptyState: { textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' },
        proofLink: { color: '#3B82F6', textDecoration: 'none', fontSize: '13px' },
    };

    const stats = { pending: approvedLeaves.length };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Attendance Coordinator Dashboard</h1>
                    <p style={styles.subtitle}>View approved leave requests and mark student attendance</p>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Approved Leaves Pending</div>
                        <div style={styles.statValue}>{stats.pending}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Your Role</div>
                        <div style={styles.statValueSmall}>ATTENDANCE COORDINATOR</div>
                    </div>
                </div>

                <div style={styles.mainCard}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitle}>Approved Leave Requests - Attendance Pending</div>
                    </div>

                    {error && <div style={{ ...styles.alert, ...styles.alertError, margin: '20px 24px 0' }}>{error}</div>}
                    {success && <div style={{ ...styles.alert, ...styles.alertSuccess, margin: '20px 24px 0' }}>{success}</div>}

                    <div style={{ padding: '0 24px 24px' }}>
                        {loading ? (
                            <div style={styles.emptyState}>Loading...</div>
                        ) : approvedLeaves.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <div>No pending attendance requests</div>
                                <div style={{ fontSize: '13px', marginTop: '8px' }}>All approved leaves have been processed</div>
                            </div>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Student</th>
                                        <th style={styles.th}>Course</th>
                                        <th style={styles.th}>Leave Dates</th>
                                        <th style={styles.th}>Classes Missed</th>
                                        <th style={styles.th}>Event</th>
                                        <th style={styles.th}>Proof</th>
                                        <th style={styles.th}>Approval Chain</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedLeaves.map((leave) => (
                                        <tr key={leave.id}>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '500' }}>{leave.student_name}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{leave.student_class} • UID: {leave.student_uid}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <div>{leave.subjects?.map(s => s.code).join(', ')}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{leave.subjects?.length} subjects</div>
                                            </td>
                                            <td style={styles.td}>{leave.leave_dates_from} – {leave.leave_dates_to}</td>
                                            <td style={styles.td}>{leave.total_theory || 0} theory / {leave.total_lab || 0} lab</td>
                                            <td style={styles.td}>
                                                <div>{leave.event_name}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{leave.organized_by}</div>
                                            </td>
                                            <td style={styles.td}>
                                                {leave.proof_link ? (
                                                    <a href={leave.proof_link} target="_blank" rel="noopener noreferrer" style={styles.proofLink}>View</a>
                                                ) : (
                                                    <span style={{ color: '#9CA3AF' }}>No proof</span>
                                                )}
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontSize: '11px', color: '#6B7280' }}>
                                                    {leave.teacher_comment && <div>✓ Teacher: {leave.teacher_comment.substring(0, 20)}...</div>}
                                                    {leave.hod_comment && <div>✓ HOD: {leave.hod_comment.substring(0, 20)}...</div>}
                                                    {leave.dean_comment && <div>✓ Dean: {leave.dean_comment.substring(0, 20)}...</div>}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <button style={styles.btnSuccess} onClick={() => handleMarkAttendance(leave)}>
                                                    ✓ Mark Attendance & Acknowledge
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {showModal && selectedLeave && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalTitle}>Mark Attendance & Acknowledge Student</div>
                        <div style={styles.modalInfo}>
                            <div><strong>{selectedLeave.student_name}</strong> ({selectedLeave.student_uid})</div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                Event: {selectedLeave.event_name}<br />
                                Leave Dates: {selectedLeave.leave_dates_from} to {selectedLeave.leave_dates_to}<br />
                                Classes Missed: {selectedLeave.total_theory} Theory, {selectedLeave.total_lab} Lab
                            </div>
                        </div>
                        <textarea
                            style={styles.textarea}
                            placeholder="Enter acknowledgment message (e.g., Your attendance has been marked. Leave approved and recorded.)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div style={styles.modalActions}>
                            <button style={styles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                            <button
                                style={{ ...styles.btnSuccess, opacity: submitting ? 0.7 : 1 }}
                                onClick={submitAttendance}
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Confirm & Mark Attendance'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinatorDashboard;