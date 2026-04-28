/**
 * STUDENT APPLICATIONS PAGE
 * View all leave applications with detailed view on click
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import StatCard from '../components/common/StatCard';
import { getStudentLeaves } from '../api/api';

const StudentApplications = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await getStudentLeaves();
            setLeaves(response.leaves || []);
        } catch (err) {
            setError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (leave) => {
        setSelectedLeave(leave);
        setShowDetailModal(true);
    };

    const getStatusConfig = (status) => {
        const configs = {
            'pending_teacher': { label: 'Pending Teacher', color: '#f59e0b', bg: '#fffbeb', icon: '⏳', step: 1 },
            'pending_hod':     { label: 'Pending HOD',     color: '#d97706', bg: '#fffbeb', icon: '📋', step: 2 },
            'pending_dean':    { label: 'Pending Dean',    color: '#dc2626', bg: '#fef2f2', icon: '🎓', step: 3 },
            'approved':        { label: 'Approved',        color: '#10b981', bg: '#ecfdf5', icon: '✅', step: 4 },
            'rejected':        { label: 'Rejected',        color: '#ef4444', bg: '#fef2f2', icon: '❌', step: 0 },
            'completed':       { label: 'Completed',       color: '#6366f1', bg: '#eef2ff', icon: '🎉', step: 5 },
        };
        return configs[status] || { label: status || 'Pending', color: '#6b7280', bg: '#f3f4f6', icon: '📝', step: 1 };
    };

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status?.includes('pending')).length,
        approved: leaves.filter(l => l.status === 'approved').length,
        rejected: leaves.filter(l => l.status === 'rejected').length,
    };

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#f3f4f6',
        },
        container: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 24px',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '32px',
        },
        filters: {
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
        },
        filterBtn: {
            padding: '8px 20px',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 200ms ease',
        },
        filterBtnActive: {
            background: '#111827',
            color: '#ffffff',
            borderColor: '#111827',
        },
        applicationsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '20px',
        },
        applicationCard: {
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
        },
        eventName: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px',
        },
        eventDate: {
            fontSize: '12px',
            color: '#6b7280',
        },
        statusBadge: (color, bg) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            color: color,
            background: bg,
        }),
        cardContent: {
            marginBottom: '16px',
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #f0f0f0',
        },
        infoLabel: {
            fontSize: '13px',
            color: '#6b7280',
        },
        infoValue: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
        },
        cardFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb',
        },
        subjectsList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
        },
        subjectTag: {
            padding: '2px 8px',
            background: '#f3f4f6',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#6b7280',
        },
        viewLink: {
            color: '#1a56db',
            fontSize: '13px',
            fontWeight: '500',
            textDecoration: 'none',
        },
        emptyState: {
            textAlign: 'center',
            padding: '80px 20px',
            color: '#9ca3af',
        },
        // Modal Styles
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
        },
        modal: {
            background: '#ffffff',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
        },
        modalHeader: {
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280',
        },
        modalBody: {
            padding: '24px',
        },
        detailSection: {
            marginBottom: '24px',
        },
        detailSectionTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e5e7eb',
        },
        detailGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
        },
        detailItem: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
        },
        detailLabel: {
            fontSize: '12px',
            color: '#6b7280',
        },
        detailValue: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
        },
        approvalTimeline: {
            marginTop: '16px',
        },
        timelineStep: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '20px',
        },
        timelineIcon: (isCompleted, isActive) => ({
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isCompleted ? '#10b981' : isActive ? '#f59e0b' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            flexShrink: 0,
        }),
        timelineContent: {
            flex: 1,
        },
        timelineTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '4px',
        },
        timelineComment: {
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '4px',
        },
        timelineDate: {
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '2px',
        },
        subjectCard: {
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
        },
        subjectHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb',
        },
        subjectCode: {
            fontSize: '15px',
            fontWeight: '600',
            color: '#111827',
        },
        classRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 0',
            fontSize: '13px',
        },
    };

    const [filterStatus, setFilterStatus] = useState('all');

    const filteredLeaves = leaves.filter(leave => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'pending') return leave.status?.includes('pending');
        return leave.status === filterStatus;
    });

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                {/* Stats */}
                <div style={styles.statsGrid}>
                    <StatCard label="Total Applications" value={stats.total} icon="📋" color="primary" />
                    <StatCard label="Pending" value={stats.pending} icon="⏳" color="warning" />
                    <StatCard label="Approved" value={stats.approved} icon="✅" color="success" />
                    <StatCard label="Rejected" value={stats.rejected} icon="❌" color="danger" />
                </div>

                {/* Filters */}
                <div style={styles.filters}>
                    <button
                        style={{ ...styles.filterBtn, ...(filterStatus === 'all' ? styles.filterBtnActive : {}) }}
                        onClick={() => setFilterStatus('all')}
                    >
                        All Applications
                    </button>
                    <button
                        style={{ ...styles.filterBtn, ...(filterStatus === 'pending' ? styles.filterBtnActive : {}) }}
                        onClick={() => setFilterStatus('pending')}
                    >
                        Pending
                    </button>
                    <button
                        style={{ ...styles.filterBtn, ...(filterStatus === 'approved' ? styles.filterBtnActive : {}) }}
                        onClick={() => setFilterStatus('approved')}
                    >
                        Approved
                    </button>
                    <button
                        style={{ ...styles.filterBtn, ...(filterStatus === 'rejected' ? styles.filterBtnActive : {}) }}
                        onClick={() => setFilterStatus('rejected')}
                    >
                        Rejected
                    </button>
                </div>

                {/* Applications Grid */}
                {loading ? (
                    <div style={styles.emptyState}>Loading applications...</div>
                ) : filteredLeaves.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <div>No applications found</div>
                        <div style={{ fontSize: '13px', marginTop: '8px', color: '#9ca3af' }}>
                            {filterStatus !== 'all' ? `No ${filterStatus} applications` : 'Click "New Application" to get started'}
                        </div>
                    </div>
                ) : (
                    <div style={styles.applicationsGrid}>
                        {filteredLeaves.map((leave) => {
                            const status = getStatusConfig(leave.status);
                            return (
                                <div
                                    key={leave.id}
                                    style={styles.applicationCard}
                                    onClick={() => handleViewDetails(leave)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <div style={styles.eventName}>{leave.event_name || leave.course_code}</div>
                                            <div style={styles.eventDate}>
                                                Applied on: {new Date(leave.created_at || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <span style={styles.statusBadge(status.color, status.bg)}>
                                            {status.icon} {status.label}
                                        </span>
                                    </div>

                                    <div style={styles.cardContent}>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Leave Period</span>
                                            <span style={styles.infoValue}>{leave.leave_dates_from} – {leave.leave_dates_to}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Event Venue</span>
                                            <span style={styles.infoValue}>{leave.venue || leave.organized_by || 'Not specified'}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Classes Missed</span>
                                            <span style={styles.infoValue}>
                                                {leave.total_theory || leave.theory_count || 0} Theory • {leave.total_lab || leave.lab_count || 0} Lab
                                            </span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Subjects</span>
                                            <div style={styles.subjectsList}>
                                                {(leave.subjects || []).map((s, idx) => (
                                                    <span key={idx} style={styles.subjectTag}>{s.code}</span>
                                                ))}
                                                {!leave.subjects && leave.course_code && (
                                                    <span style={styles.subjectTag}>{leave.course_code}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.cardFooter}>
                                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                                            Application #{leave.id}
                                        </span>
                                        <span style={styles.viewLink}>View Details →</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedLeave && (
                <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <div style={styles.modalTitle}>Leave Application Details</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                                    Application #{selectedLeave.id}
                                </div>
                            </div>
                            <button style={styles.closeBtn} onClick={() => setShowDetailModal(false)}>×</button>
                        </div>

                        <div style={styles.modalBody}>
                            {/* Status Section */}
                            <div style={styles.detailSection}>
                                <div style={styles.detailSectionTitle}>Application Status</div>
                                <div style={styles.approvalTimeline}>
                                    {[
                                        {
                                            key: 'teacher',
                                            label: 'Teacher Approval',
                                            status: selectedLeave.teacher_comment
                                                ? 'completed'
                                                : (selectedLeave.status === 'pending_teacher' ? 'active' : 'pending'),
                                        },
                                        {
                                            key: 'hod',
                                            label: 'HOD Approval',
                                            status: selectedLeave.hod_comment
                                                ? 'completed'
                                                : (selectedLeave.status === 'pending_hod' ? 'active' : 'pending'),
                                        },
                                        {
                                            key: 'dean',
                                            label: 'Dean Approval',
                                            status: selectedLeave.dean_comment
                                                ? 'completed'
                                                : (selectedLeave.status === 'pending_dean' ? 'active' : 'pending'),
                                        },
                                        {
                                            key: 'coordinator',
                                            label: 'Attendance Marked',
                                            status: selectedLeave.attendance_marked
                                                ? 'completed'
                                                : (selectedLeave.status === 'approved' ? 'active' : 'pending'),
                                        },
                                    ].map((step, idx) => (
                                        <div key={idx} style={styles.timelineStep}>
                                            <div style={styles.timelineIcon(
                                                step.status === 'completed',
                                                step.status === 'active'
                                            )}>
                                                {step.status === 'completed' ? '✓' : step.status === 'active' ? '●' : '○'}
                                            </div>
                                            <div style={styles.timelineContent}>
                                                <div style={styles.timelineTitle}>{step.label}</div>
                                                {step.key === 'teacher' && selectedLeave.teacher_comment && (
                                                    <>
                                                        <div style={styles.timelineComment}>{selectedLeave.teacher_comment}</div>
                                                        <div style={styles.timelineDate}>Reviewed by Teacher</div>
                                                    </>
                                                )}
                                                {step.key === 'hod' && selectedLeave.hod_comment && (
                                                    <>
                                                        <div style={styles.timelineComment}>{selectedLeave.hod_comment}</div>
                                                        <div style={styles.timelineDate}>Reviewed by HOD</div>
                                                    </>
                                                )}
                                                {step.key === 'dean' && selectedLeave.dean_comment && (
                                                    <>
                                                        <div style={styles.timelineComment}>{selectedLeave.dean_comment}</div>
                                                        <div style={styles.timelineDate}>Reviewed by Dean</div>
                                                    </>
                                                )}
                                                {step.key === 'coordinator' && selectedLeave.coordinator_comment && (
                                                    <>
                                                        <div style={styles.timelineComment}>{selectedLeave.coordinator_comment}</div>
                                                        <div style={styles.timelineDate}>Attendance marked by Coordinator</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Student Information */}
                            <div style={styles.detailSection}>
                                <div style={styles.detailSectionTitle}>Student Information</div>
                                <div style={styles.detailGrid}>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Student Name</div>
                                        <div style={styles.detailValue}>{selectedLeave.student_name || selectedLeave.student_info?.name}</div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Class</div>
                                        <div style={styles.detailValue}>{selectedLeave.student_class || selectedLeave.student_info?.class}</div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>UID Number</div>
                                        <div style={styles.detailValue}>{selectedLeave.student_uid || selectedLeave.student_info?.uid}</div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Mobile Number</div>
                                        <div style={styles.detailValue}>{selectedLeave.student_mobile || selectedLeave.student_info?.mobile}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Information */}
                            <div style={styles.detailSection}>
                                <div style={styles.detailSectionTitle}>Event Information</div>
                                <div style={styles.detailGrid}>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Event Name</div>
                                        <div style={styles.detailValue}>{selectedLeave.event_name}</div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Organized By</div>
                                        <div style={styles.detailValue}>{selectedLeave.organized_by}</div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Venue</div>
                                        <div style={styles.detailValue}>{selectedLeave.venue}</div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Event Duration</div>
                                        <div style={styles.detailValue}>
                                            {selectedLeave.event_duration_from} – {selectedLeave.event_duration_to}
                                        </div>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <div style={styles.detailLabel}>Leave Dates</div>
                                        <div style={styles.detailValue}>
                                            {selectedLeave.leave_dates_from} – {selectedLeave.leave_dates_to}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subjects and Classes */}
                            <div style={styles.detailSection}>
                                <div style={styles.detailSectionTitle}>Subjects & Classes Missed</div>
                                {(selectedLeave.subjects || []).map((subject, idx) => (
                                    <div key={idx} style={styles.subjectCard}>
                                        <div style={styles.subjectHeader}>
                                            <span style={styles.subjectCode}>{subject.code} - {subject.name}</span>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                {subject.theory_count || 0} Theory • {subject.lab_count || 0} Lab
                                            </span>
                                        </div>
                                        {subject.theory_classes && subject.theory_classes.length > 0 && (
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Theory Classes:</div>
                                                {subject.theory_classes.map((cls, clsIdx) => (
                                                    <div key={clsIdx} style={styles.classRow}>
                                                        <span>{cls.date}</span>
                                                        <span>{cls.timing}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {subject.lab_classes && subject.lab_classes.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Lab Classes:</div>
                                                {subject.lab_classes.map((cls, clsIdx) => (
                                                    <div key={clsIdx} style={styles.classRow}>
                                                        <span>{cls.date}</span>
                                                        <span>{cls.timing}</span>
                                                        <span>Batch: {cls.batch}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {!selectedLeave.subjects && (
                                    <div style={styles.subjectCard}>
                                        <div style={styles.subjectHeader}>
                                            <span style={styles.subjectCode}>{selectedLeave.course_code} - {selectedLeave.subject_name}</span>
                                        </div>
                                        <div style={styles.classRow}>
                                            <span>Theory Classes: {selectedLeave.theory_count || 0}</span>
                                            <span>Lab Classes: {selectedLeave.lab_count || 0}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Declaration */}
                            <div style={styles.detailSection}>
                                <div style={styles.detailSectionTitle}>Declaration</div>
                                <div style={{
                                    background: '#f9fafb',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    color: '#4b5563'
                                }}>
                                    {selectedLeave.declaration || 'I declare that I am representing the Institute for this event. I have not been involved in any malpractices and no disciplinary action has been taken against me.'}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentApplications;