/**
 * FACULTY DASHBOARD - For Class Teacher, HOD, Dean
 * =================================================
 * 
 * WORKFLOW:
 * - Class Teacher: sees pending_teacher → approves → sends to HOD (pending_hod)
 * - HOD: sees pending_hod → approves → sends to Dean (pending_dean)
 * - Dean: sees pending_dean → approves → marks as approved
 * - Any can reject
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getPendingLeaves, approveLeave, rejectLeave } from '../api/api';

const FacultyDashboard = () => {
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [comment, setComment] = useState('');
    const [actionType, setActionType] = useState('');
    const [viewDetailsLeave, setViewDetailsLeave] = useState(null);

    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        loadPendingLeaves();
    }, []);

    const loadPendingLeaves = async () => {
        try {
            setLoading(true);
            const response = await getPendingLeaves();
            setPendingLeaves(response.pendingLeaves || []);
        } catch (err) {
            setError('Failed to load pending leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (leave) => {
        setSelectedLeave(leave);
        setActionType('approve');
        setComment('');
    };

    const handleReject = (leave) => {
        setSelectedLeave(leave);
        setActionType('reject');
        setComment('');
    };

    const submitAction = async () => {
        if (!comment.trim()) {
            setError('Please add a comment');
            return;
        }

        try {
            let response;
            if (actionType === 'approve') {
                response = await approveLeave(selectedLeave.id, comment);
            } else {
                response = await rejectLeave(selectedLeave.id, comment);
            }

            if (response.success) {
                setError('');
                setComment('');
                setSuccess(`Application ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
                setSelectedLeave(null);
                loadPendingLeaves();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError('Action failed. Please try again.');
        }
    };

    const getRoleTitle = () => {
        switch (userRole) {
            case 'teacher': return 'Class Teacher Approval Portal';
            case 'hod': return 'HOD Approval Portal';
            case 'dean': return 'Dean Approval Portal';
            default: return 'Faculty Approval Portal';
        }
    };

    const getRoleDescription = () => {
        switch (userRole) {
            case 'teacher': return 'Review student leave applications. Approving will send to HOD for further approval.';
            case 'hod': return 'Review teacher-approved applications. Approving will send to Dean for final approval.';
            case 'dean': return 'Review HOD-approved applications. Approving will mark as Approved and send to Coordinator.';
            default: return 'Review and process leave applications';
        }
    };

    const getNextLevel = () => {
        switch (userRole) {
            case 'teacher': return 'HOD';
            case 'hod': return 'Dean';
            case 'dean': return 'Attendance Coordinator';
            default: return 'Next';
        }
    };

    const styles = {
        page: { minHeight: '100vh', background: '#F9FAFB' },
        container: { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' },
        header: { marginBottom: '32px' },
        title: { fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' },
        subtitle: { fontSize: '14px', color: '#6B7280' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' },
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
        btnApprove: { background: '#059669', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', marginRight: '8px' },
        btnReject: { background: '#FFFFFF', color: '#DC2626', border: '1px solid #FEE2E2', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
        btnView: { background: '#3B82F6', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', marginRight: '8px' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#FFFFFF', borderRadius: '16px', width: '480px', maxWidth: '90%', padding: '24px' },
        modalTitle: { fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
        modalInfo: { background: '#F9FAFB', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' },
        textarea: { width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', minHeight: '100px', marginBottom: '20px', outline: 'none' },
        modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
        alert: { padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' },
        alertError: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' },
        alertSuccess: { background: '#ECFDF5', color: '#059669', border: '1px solid #D1FAE5' },
        emptyState: { textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' },
        proofLink: { color: '#3B82F6', textDecoration: 'none', fontSize: '13px' },
        detailRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB', fontSize: '14px' },
        detailLabel: { fontWeight: '600', color: '#6B7280', minWidth: '200px' },
        detailValue: { color: '#111827', flex: 1 },
        detailSection: { marginBottom: '20px' },
        detailSectionTitle: { fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #F0F0F0' },
    };

    const stats = {
        pending: pendingLeaves.length,
        role: userRole?.toUpperCase(),
        next: getNextLevel()
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>{getRoleTitle()}</h1>
                    <p style={styles.subtitle}>{getRoleDescription()}</p>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Pending Approval</div>
                        <div style={styles.statValue}>{stats.pending}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Your Role</div>
                        <div style={styles.statValueSmall}>{stats.role}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Next Approver</div>
                        <div style={styles.statValueSmall}>{stats.next}</div>
                    </div>
                </div>

                <div style={styles.mainCard}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitle}>Pending Applications</div>
                    </div>
                    {error && <div style={{ ...styles.alert, ...styles.alertError, margin: '20px 24px 0' }}>{error}</div>}
                    {success && <div style={{ ...styles.alert, ...styles.alertSuccess, margin: '20px 24px 0' }}>{success}</div>}
                    <div style={{ padding: '0 24px 24px' }}>
                        {loading ? (
                            <div style={styles.emptyState}>Loading...</div>
                        ) : pendingLeaves.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                                <div>No pending applications</div>
                                <div style={{ fontSize: '13px', marginTop: '8px' }}>All requests have been processed</div>
                            </div>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Student</th>
                                        <th style={styles.th}>Course</th>
                                        <th style={styles.th}>Leave Period</th>
                                        <th style={styles.th}>Classes</th>
                                        <th style={styles.th}>Event Details</th>
                                        <th style={styles.th}>Proof</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingLeaves.map((leave) => (
                                        <tr key={leave.id}>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '500' }}>{leave.student_name}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{leave.student_class} • UID: {leave.student_uid}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <div>{leave.subjects?.[0]?.code || leave.course_code}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{leave.subjects?.[0]?.name || leave.subject_name}</div>
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
                                                <button style={styles.btnView} onClick={() => setViewDetailsLeave(leave)}>View</button>
                                                <button style={styles.btnApprove} onClick={() => handleApprove(leave)}>Approve</button>
                                                <button style={styles.btnReject} onClick={() => handleReject(leave)}>Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {viewDetailsLeave && (
                <div style={styles.modalOverlay} onClick={() => setViewDetailsLeave(null)}>
                    <div style={{ ...styles.modal, width: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalTitle}>Application Details</div>
                        
                        {/* Student Information */}
                        <div style={styles.detailSection}>
                            <div style={styles.detailSectionTitle}>Student Information</div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Name:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.student_name}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>UID:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.student_uid}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Class:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.student_class}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Email:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.student_email || 'N/A'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Phone:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.student_phone || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Leave Information */}
                        <div style={styles.detailSection}>
                            <div style={styles.detailSectionTitle}>Leave Information</div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>From Date:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.leave_dates_from}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>To Date:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.leave_dates_to}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Time:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.time || viewDetailsLeave.leave_time || 'N/A'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Leave Type:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.leave_type || 'N/A'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Reason:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.reason || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Event Information */}
                        <div style={styles.detailSection}>
                            <div style={styles.detailSectionTitle}>Event Information</div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Event Name:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.event_name}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Organized By:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.organized_by || 'N/A'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Location:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.location || 'N/A'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Description:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.description || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Subject Information */}
                        <div style={styles.detailSection}>
                            <div style={styles.detailSectionTitle}>Subject Information</div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Subject Code:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.subjects?.[0]?.code || viewDetailsLeave.course_code}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Subject Name:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.subjects?.[0]?.name || viewDetailsLeave.subject_name}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Theory Classes:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.total_theory || 0}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Lab Classes:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.total_lab || 0}</span>
                            </div>
                        </div>

                        {/* Proof */}
                        <div style={styles.detailSection}>
                            <div style={styles.detailSectionTitle}>Proof Document</div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Status:</span>
                                <span style={styles.detailValue}>
                                    {viewDetailsLeave.proof_link ? (
                                        <a href={viewDetailsLeave.proof_link} target="_blank" rel="noopener noreferrer" style={styles.proofLink}>
                                            📎 View Proof
                                        </a>
                                    ) : (
                                        'No proof uploaded'
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Application Status */}
                        <div style={styles.detailSection}>
                            <div style={styles.detailSectionTitle}>Application Status</div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Status:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.status || 'Pending'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Submitted Date:</span>
                                <span style={styles.detailValue}>{viewDetailsLeave.created_at ? new Date(viewDetailsLeave.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>

                        <div style={styles.modalActions}>
                            <button style={styles.btnReject} onClick={() => setViewDetailsLeave(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedLeave && (
                <div style={styles.modalOverlay} onClick={() => setSelectedLeave(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalTitle}>
                            {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
                        </div>
                        <div style={styles.modalInfo}>
                            <div><strong>{selectedLeave.student_name}</strong> • {selectedLeave.subjects?.[0]?.code || selectedLeave.course_code}</div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                Event: {selectedLeave.event_name} | Dates: {selectedLeave.leave_dates_from} – {selectedLeave.leave_dates_to}
                            </div>
                        </div>
                        <textarea
                            style={styles.textarea}
                            placeholder={actionType === 'approve' ? 'Add approval notes...' : 'Provide reason for rejection...'}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div style={styles.modalActions}>
                            <button style={styles.btnReject} onClick={() => setSelectedLeave(null)}>Cancel</button>
                            <button style={styles.btnApprove} onClick={submitAction}>
                                Confirm {actionType === 'approve' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;