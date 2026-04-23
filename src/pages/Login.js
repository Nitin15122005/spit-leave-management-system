/**
 * LOGIN PAGE - Professional Design System
 * ==========================================
 * 
 * DEMO CREDENTIALS:
 * ┌─────────────────────────┬──────────────┬─────────────────┐
 * │ Role                    │ UID          │ Password        │
 * ├─────────────────────────┼──────────────┼─────────────────┤
 * │ Student                 │ 2023800110   │ 2023800110      │
 * │ Class Teacher           │ TEACHER001   │ TEACHER001      │
 * │ HOD                     │ HOD001       │ HOD001          │
 * │ Dean                    │ DEAN001      │ DEAN001         │
 * │ Attendance Coordinator  │ COORD001     │ COORD001        │
 * └─────────────────────────┴──────────────┴─────────────────┘
 * 
 * BACKEND INTEGRATION:
 * - Endpoint: POST /api/login
 * - Body: { uid, password }
 * - Response: { success, token, userId, name, role, class, mobile }
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const Login = () => {
    const navigate = useNavigate();
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!uid.trim() || !password.trim()) {
            setError('Please enter both UID/Email and Password');
            setLoading(false);
            return;
        }

        try {
            const response = await login(uid, password);

            if (response.success) {
                // Store user data
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('userUid', response.uid);
                localStorage.setItem('userName', response.name);
                localStorage.setItem('userRole', response.role);
                if (response.class) localStorage.setItem('userClass', response.class);
                if (response.mobile) localStorage.setItem('userMobile', response.mobile);

                // Redirect based on role
                if (response.role === 'student') {
                    navigate('/student');
                } else if (['teacher', 'hod', 'dean'].includes(response.role)) {
                    navigate('/faculty');
                } else if (response.role === 'coordinator') {
                    navigate('/coordinator');
                }
            }
        } catch (err) {
            setError(err.message || 'Invalid UID or password');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = (demoUid, demoPwd) => {
        setUid(demoUid);
        setPassword(demoPwd);
    };

    // Demo credentials for quick login
    const demoCredentials = [
        { role: 'Student', uid: '2023800110', pwd: '2023800110', icon: '👨‍🎓', color: '#10b981' },
        { role: 'Class Teacher', uid: 'TEACHER001', pwd: 'TEACHER001', icon: '👨‍🏫', color: '#3b82f6' },
        { role: 'HOD', uid: 'HOD001', pwd: 'HOD001', icon: '📋', color: '#f59e0b' },
        { role: 'Dean', uid: 'DEAN001', pwd: 'DEAN001', icon: '🎓', color: '#8b5cf6' },
        { role: 'Coordinator', uid: 'COORD001', pwd: 'COORD001', icon: '✅', color: '#ef4444' },
    ];

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        },
        container: {
            maxWidth: '1120px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden',
        },
        // Left Panel - Branding
        leftPanel: {
            flex: 1,
            background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        logo: {
            width: '56px',
            height: '56px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '32px',
        },
        brandTitle: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px',
            lineHeight: '1.3',
        },
        brandSubtitle: {
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6',
            marginBottom: '48px',
        },
        features: {
            marginTop: 'auto',
        },
        featureItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '14px',
        },
        // Right Panel - Login Form
        rightPanel: {
            flex: 1,
            padding: '48px',
            background: '#ffffff',
        },
        formHeader: {
            marginBottom: '32px',
        },
        formTitle: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
        },
        formSubtitle: {
            fontSize: '14px',
            color: '#6b7280',
        },
        demoSection: {
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
        },
        demoTitle: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '12px',
        },
        demoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
        },
        demoCard: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        demoIcon: {
            fontSize: '20px',
        },
        demoInfo: {
            flex: 1,
        },
        demoRole: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#111827',
        },
        demoUid: {
            fontSize: '10px',
            color: '#6b7280',
            fontFamily: 'monospace',
        },
        footer: {
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#9ca3af',
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Left Panel - Branding */}
                <div style={styles.leftPanel}>
                    <div>
                        <div style={styles.logo}>📋</div>
                        <h1 style={styles.brandTitle}>Leave Management System</h1>
                        <p style={styles.brandSubtitle}>
                            Sardar Patel Institute of Technology<br />
                            Streamline leave applications, approvals, and attendance tracking.
                        </p>
                    </div>
                    <div style={styles.features}>
                        <div style={styles.featureItem}>
                            <span>✓</span> Apply for leaves with proof
                        </div>
                        <div style={styles.featureItem}>
                            <span>✓</span> Multi-level approval workflow
                        </div>
                        <div style={styles.featureItem}>
                            <span>✓</span> Track application status
                        </div>
                        <div style={styles.featureItem}>
                            <span>✓</span> Mark attendance digitally
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div style={styles.rightPanel}>
                    <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Welcome Back</h2>
                        <p style={styles.formSubtitle}>Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {error && (
                            <Alert
                                type="error"
                                message={error}
                                onClose={() => setError('')}
                                autoClose={5000}
                            />
                        )}

                        <Input
                            label="UID / Email"
                            type="text"
                            placeholder="Enter your UID or Email"
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            required
                            icon="📧"
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon="🔒"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Credentials Section */}
                    <div style={styles.demoSection}>
                        <div style={styles.demoTitle}>🚀 Quick Demo Access</div>
                        <div style={styles.demoGrid}>
                            {demoCredentials.map((cred, idx) => (
                                <div
                                    key={idx}
                                    style={styles.demoCard}
                                    onClick={() => fillDemoCredentials(cred.uid, cred.pwd)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f3f4f6';
                                        e.currentTarget.style.borderColor = cred.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f9fafb';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <span style={styles.demoIcon}>{cred.icon}</span>
                                    <div style={styles.demoInfo}>
                                        <div style={styles.demoRole}>{cred.role}</div>
                                        <div style={styles.demoUid}>{cred.uid}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.footer}>
                        Secure login • Demo mode active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;