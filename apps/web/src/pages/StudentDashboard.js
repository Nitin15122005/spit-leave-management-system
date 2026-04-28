/**
 * STUDENT DASHBOARD - Professional Design System
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import StatCard from '../components/common/StatCard';
import { getStudentLeaves, applyLeave } from '../api/api';

const StudentDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [studentInfo, setStudentInfo] = useState({
        name: localStorage.getItem('userName') || '',
        class: '',
        uid: '',
        mobile: ''
    });

    const subjectsBySemester = {
        1: [{ code: 'CS101', name: 'Programming Fundamentals', theory: true, lab: true }],
        2: [{ code: 'CS201', name: 'Data Structures', theory: true, lab: true }],
        3: [{ code: 'CS301', name: 'Database Systems', theory: true, lab: true }],
        4: [{ code: 'CS401', name: 'Software Engineering', theory: true, lab: false }],
        5: [
            { code: 'CS331', name: 'Business Analytics with Python', theory: true, lab: true },
            { code: 'CS307', name: 'Machine Learning', theory: true, lab: true },
            { code: 'CS306', name: 'Human Machine Interaction', theory: true, lab: false },
            { code: 'CS332', name: 'Big Data Analytics', theory: true, lab: true },
            { code: 'CE312', name: 'Deep Learning', theory: true, lab: false },
            { code: 'CS321', name: 'Natural Language Processing', theory: true, lab: false },
        ],
        6: [{ code: 'CS601', name: 'Artificial Intelligence', theory: true, lab: true }],
        7: [{ code: 'CS701', name: 'Cyber Security', theory: true, lab: true }],
        8: [{ code: 'CS801', name: 'Project Work', theory: false, lab: true }],
    };

    const [selectedSemester, setSelectedSemester] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [formData, setFormData] = useState({
        event_name: '',
        organized_by: '',
        venue: '',
        event_duration_from: '',
        event_duration_to: '',
        leave_dates_from: '',
        leave_dates_to: '',
        declaration: false
    });

    useEffect(() => {
        loadLeavesSilently();
    }, []);

    const loadLeavesSilently = async () => {
        try {
            const response = await getStudentLeaves();
            if (response && response.leaves) setLeaves(response.leaves);
        } catch (err) {
            console.log('No existing leaves found');
        }
    };

    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
        setSubjects(subjectsBySemester[semester] || []);
        setSelectedSubjects([]);
    };

    const addSubject = (subject) => {
        if (selectedSubjects.find(s => s.code === subject.code)) {
            setError(`${subject.code} already added`);
            setTimeout(() => setError(''), 2000);
            return;
        }
        setSelectedSubjects([...selectedSubjects, {
            ...subject,
            theory_classes: subject.theory ? [{ date: '', timing: '' }] : [],
            lab_classes: subject.lab ? [{ date: '', timing: '', batch: '' }] : []
        }]);
    };

    const removeSubject = (index) => {
        const updated = [...selectedSubjects];
        updated.splice(index, 1);
        setSelectedSubjects(updated);
    };

    const updateTheoryClass = (subjectIndex, classIndex, field, value) => {
        const updated = [...selectedSubjects];
        updated[subjectIndex].theory_classes[classIndex][field] = value;
        setSelectedSubjects(updated);
    };

    const updateLabClass = (subjectIndex, classIndex, field, value) => {
        const updated = [...selectedSubjects];
        updated[subjectIndex].lab_classes[classIndex][field] = value;
        setSelectedSubjects(updated);
    };

    const addTheoryClass = (subjectIndex) => {
        const updated = [...selectedSubjects];
        updated[subjectIndex].theory_classes.push({ date: '', timing: '' });
        setSelectedSubjects(updated);
    };

    const removeTheoryClass = (subjectIndex, classIndex) => {
        const updated = [...selectedSubjects];
        updated[subjectIndex].theory_classes.splice(classIndex, 1);
        setSelectedSubjects(updated);
    };

    const addLabClass = (subjectIndex) => {
        const updated = [...selectedSubjects];
        updated[subjectIndex].lab_classes.push({ date: '', timing: '', batch: '' });
        setSelectedSubjects(updated);
    };

    const removeLabClass = (subjectIndex, classIndex) => {
        const updated = [...selectedSubjects];
        updated[subjectIndex].lab_classes.splice(classIndex, 1);
        setSelectedSubjects(updated);
    };

    const getTotalTheoryCount = () => {
        return selectedSubjects.reduce((total, subject) =>
            total + subject.theory_classes.filter(c => c.date && c.timing).length, 0);
    };

    const getTotalLabCount = () => {
        return selectedSubjects.reduce((total, subject) =>
            total + subject.lab_classes.filter(c => c.date && c.timing && c.batch).length, 0);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (!studentInfo.class || !studentInfo.uid || !studentInfo.mobile) {
            setError('Please complete student information');
            setSubmitting(false);
            return;
        }

        if (!formData.event_name || !formData.organized_by || !formData.venue) {
            setError('Please complete event details');
            setSubmitting(false);
            return;
        }

        if (!selectedSemester) {
            setError('Please select a semester');
            setSubmitting(false);
            return;
        }

        if (selectedSubjects.length === 0) {
            setError('Please add at least one subject');
            setSubmitting(false);
            return;
        }

        if (getTotalTheoryCount() === 0 && getTotalLabCount() === 0) {
            setError('Please add at least one theory or lab class');
            setSubmitting(false);
            return;
        }

        if (!formData.declaration) {
            setError('Please accept the declaration');
            setSubmitting(false);
            return;
        }

        const leaveData = {
            student_info: studentInfo,
            event_details: formData,
            semester: selectedSemester,
            subjects: selectedSubjects.map(subject => ({
                code: subject.code,
                name: subject.name,
                theory_classes: subject.theory_classes.filter(c => c.date && c.timing),
                theory_count: subject.theory_classes.filter(c => c.date && c.timing).length,
                lab_classes: subject.lab_classes.filter(c => c.date && c.timing && c.batch),
                lab_count: subject.lab_classes.filter(c => c.date && c.timing && c.batch).length
            })),
            total_theory: getTotalTheoryCount(),
            total_lab: getTotalLabCount(),
            declaration: formData.declaration
        };

        try {
            const response = await applyLeave(leaveData);
            if (response.success) {
                setSuccess('Leave application submitted successfully');
                resetForm();
                loadLeavesSilently();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setSelectedSemester('');
        setSelectedSubjects([]);
        setFormData({
            event_name: '', organized_by: '', venue: '',
            event_duration_from: '', event_duration_to: '',
            leave_dates_from: '', leave_dates_to: '',
            declaration: false
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            'pending_faculty': { label: 'Pending Faculty', color: '#f59e0b', bg: '#fffbeb' },
            'pending_hod': { label: 'Pending HOD', color: '#d97706', bg: '#fffbeb' },
            'pending_dean': { label: 'Pending Dean', color: '#dc2626', bg: '#fef2f2' },
            'approved': { label: 'Approved', color: '#10b981', bg: '#ecfdf5' },
            'rejected': { label: 'Rejected', color: '#ef4444', bg: '#fef2f2' }
        };
        return configs[status] || { label: 'Pending', color: '#6b7280', bg: '#f3f4f6' };
    };

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status?.includes('pending')).length,
        approved: leaves.filter(l => l.status === 'approved').length,
    };

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#f3f4f6'
        },
        container: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 24px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '32px'
        },
        semesterGrid: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px'
        },
        semesterBtn: {
            padding: '8px 20px',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 200ms ease'
        },
        semesterBtnActive: {
            background: '#111827',
            color: '#ffffff',
            borderColor: '#111827'
        },
        subjectGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px'
        },
        subjectCard: {
            padding: '14px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            background: '#ffffff'
        },
        subjectCode: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px'
        },
        subjectName: {
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '8px'
        },
        subjectTags: {
            display: 'flex',
            gap: '8px'
        },
        tag: {
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: '#f3f4f6',
            color: '#6b7280'
        },
        selectedSubjectsContainer: {
            marginTop: '24px'
        },
        selectedSubjectCard: {
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid #e5e7eb'
        },
        selectedSubjectHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e7eb'
        },
        selectedSubjectTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827'
        },
        classRow: {
            display: 'grid',
            gridTemplateColumns: '150px 1fr 100px auto',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '12px'
        },
        classInput: {
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none'
        },
        addBtn: {
            background: 'none',
            border: '1px dashed #d1d5db',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            marginTop: '8px',
            color: '#6b7280'
        },
        removeBtn: {
            background: 'none',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '20px'
        },
        declaration: {
            margin: '24px 0',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '12px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
        },
        buttonGroup: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            textAlign: 'left',
            padding: '12px 16px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            borderBottom: '1px solid #e5e7eb'
        },
        td: {
            padding: '16px',
            fontSize: '14px',
            color: '#374151',
            borderBottom: '1px solid #f0f0f0'
        },
        statusBadge: (color, bg) => ({
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            color: color,
            background: bg
        }),
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af'
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                {/* Stats */}
                <div style={styles.statsGrid}>
                    <StatCard label="Total Applications" value={stats.total} icon="📋" color="primary" />
                    <StatCard label="Pending Approval" value={stats.pending} icon="⏳" color="warning" />
                    <StatCard label="Approved" value={stats.approved} icon="✓" color="success" />
                </div>

                {/* Main Content */}
                <Card>
                    {!showForm ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                        Leave Applications
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#6b7280' }}>View and track your leave requests</p>
                                </div>
                                <Button onClick={() => setShowForm(true)} icon="+">New Application</Button>
                            </div>

                            {leaves.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                                    <div>No leave applications yet</div>
                                    <div style={{ fontSize: '13px', marginTop: '8px', color: '#9ca3af' }}>Click "New Application" to get started</div>
                                </div>
                            ) : (
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Event / Subjects</th>
                                            <th style={styles.th}>Leave Period</th>
                                            <th style={styles.th}>Classes</th>
                                            <th style={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.map((leave) => {
                                            const status = getStatusConfig(leave.status);
                                            return (
                                                <tr key={leave.id}>
                                                    <td style={styles.td}>
                                                        <div style={{ fontWeight: '500' }}>{leave.event_name}</div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                                            {leave.subjects?.map(s => s.code).join(', ') || leave.course_code}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>{leave.leave_dates_from} – {leave.leave_dates_to}</td>
                                                    <td style={styles.td}>{leave.total_theory || 0} theory • {leave.total_lab || 0} lab</td>
                                                    <td style={styles.td}>
                                                        <span style={styles.statusBadge(status.color, status.bg)}>{status.label}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                            {/* Student Information */}
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                    Student Information
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                    <Input label="Full Name" value={studentInfo.name} disabled />
                                    <Select
                                        label="Class"
                                        value={studentInfo.class}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, class: e.target.value })}
                                        options={[
                                            { value: 'FE', label: 'FE' },
                                            { value: 'SE', label: 'SE' },
                                            { value: 'TE', label: 'TE' },
                                            { value: 'BE', label: 'BE' }
                                        ]}
                                        required
                                    />
                                    <Input label="UID Number" value={studentInfo.uid} onChange={(e) => setStudentInfo({ ...studentInfo, uid: e.target.value })} required />
                                    <Input label="Mobile Number" value={studentInfo.mobile} onChange={(e) => setStudentInfo({ ...studentInfo, mobile: e.target.value })} required />
                                </div>
                            </div>

                            {/* Event Details */}
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                    Event Details
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                    <Input label="Event Name" name="event_name" value={formData.event_name} onChange={handleInputChange} required />
                                    <Input label="Organized By" name="organized_by" value={formData.organized_by} onChange={handleInputChange} required />
                                    <Input label="Venue" name="venue" value={formData.venue} onChange={handleInputChange} required />
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <Input label="Event From" type="date" name="event_duration_from" value={formData.event_duration_from} onChange={handleInputChange} />
                                        <Input label="Event To" type="date" name="event_duration_to" value={formData.event_duration_to} onChange={handleInputChange} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <Input label="Leave From" type="date" name="leave_dates_from" value={formData.leave_dates_from} onChange={handleInputChange} required />
                                        <Input label="Leave To" type="date" name="leave_dates_to" value={formData.leave_dates_to} onChange={handleInputChange} required />
                                    </div>
                                </div>
                            </div>

                            {/* Semester Selection */}
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                    Select Semester
                                </h4>
                                <div style={styles.semesterGrid}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <button
                                            key={sem}
                                            type="button"
                                            style={{
                                                ...styles.semesterBtn,
                                                ...(selectedSemester === sem ? styles.semesterBtnActive : {})
                                            }}
                                            onClick={() => handleSemesterChange(sem)}
                                        >
                                            Semester {sem}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects */}
                            {selectedSemester && subjects.length > 0 && (
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                        Select Subjects
                                    </h4>
                                    <div style={styles.subjectGrid}>
                                        {subjects.map(subject => (
                                            <div
                                                key={subject.code}
                                                style={styles.subjectCard}
                                                onClick={() => addSubject(subject)}
                                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#111827'}
                                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                            >
                                                <div style={styles.subjectCode}>{subject.code}</div>
                                                <div style={styles.subjectName}>{subject.name}</div>
                                                <div style={styles.subjectTags}>
                                                    {subject.theory && <span style={styles.tag}>Theory</span>}
                                                    {subject.lab && <span style={styles.tag}>Lab</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected Subjects */}
                            {selectedSubjects.length > 0 && (
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                        Selected Subjects ({selectedSubjects.length}) - Total Theory: {getTotalTheoryCount()} | Total Lab: {getTotalLabCount()}
                                    </h4>
                                    <div style={styles.selectedSubjectsContainer}>
                                        {selectedSubjects.map((subject, idx) => (
                                            <div key={subject.code} style={styles.selectedSubjectCard}>
                                                <div style={styles.selectedSubjectHeader}>
                                                    <div style={styles.selectedSubjectTitle}>{subject.code} - {subject.name}</div>
                                                    <Button variant="outline" size="small" onClick={() => removeSubject(idx)}>Remove</Button>
                                                </div>

                                                {/* Theory Classes */}
                                                {subject.theory && (
                                                    <div style={{ marginBottom: '20px' }}>
                                                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                                                            Theory Classes ({subject.theory_classes.filter(c => c.date && c.timing).length})
                                                        </div>
                                                        {subject.theory_classes.map((cls, clsIdx) => (
                                                            <div key={clsIdx} style={styles.classRow}>
                                                                <input type="date" style={styles.classInput} value={cls.date} onChange={(e) => updateTheoryClass(idx, clsIdx, 'date', e.target.value)} />
                                                                <input type="text" style={styles.classInput} placeholder="Timing (e.g., 10:00-11:00 AM)" value={cls.timing} onChange={(e) => updateTheoryClass(idx, clsIdx, 'timing', e.target.value)} />
                                                                <div></div>
                                                                {clsIdx > 0 && (
                                                                    <button type="button" style={styles.removeBtn} onClick={() => removeTheoryClass(idx, clsIdx)}>×</button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button type="button" style={styles.addBtn} onClick={() => addTheoryClass(idx)}>+ Add Theory Class</button>
                                                    </div>
                                                )}

                                                {/* Lab Classes */}
                                                {subject.lab && (
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                                                            Lab Classes ({subject.lab_classes.filter(c => c.date && c.timing && c.batch).length})
                                                        </div>
                                                        {subject.lab_classes.map((cls, clsIdx) => (
                                                            <div key={clsIdx} style={{ ...styles.classRow, gridTemplateColumns: '150px 1fr 100px auto' }}>
                                                                <input type="date" style={styles.classInput} value={cls.date} onChange={(e) => updateLabClass(idx, clsIdx, 'date', e.target.value)} />
                                                                <input type="text" style={styles.classInput} placeholder="Timing (e.g., 2:00-5:00 PM)" value={cls.timing} onChange={(e) => updateLabClass(idx, clsIdx, 'timing', e.target.value)} />
                                                                <input type="text" style={styles.classInput} placeholder="Batch" value={cls.batch} onChange={(e) => updateLabClass(idx, clsIdx, 'batch', e.target.value)} />
                                                                {clsIdx > 0 && (
                                                                    <button type="button" style={styles.removeBtn} onClick={() => removeLabClass(idx, clsIdx)}>×</button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button type="button" style={styles.addBtn} onClick={() => addLabClass(idx)}>+ Add Lab Class</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Declaration */}
                            <div style={styles.declaration}>
                                <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} required style={{ marginTop: '2px' }} />
                                <label style={{ fontSize: '13px', lineHeight: '1.5', color: '#4b5563' }}>
                                    I declare that I am representing the Institute for this event. I have not been involved in any malpractices and no disciplinary action has been taken against me.
                                </label>
                            </div>

                            {/* Actions */}
                            <div style={styles.buttonGroup}>
                                <Button variant="secondary" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" loading={submitting}>Submit Application</Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;