/**
 * PROFESSIONAL NAVBAR COMPONENT
 * Role-based navigation with responsive design
 * 
 * Features:
 * - Role-based menu items (Student, Faculty, Coordinator)
 * - Active route highlighting
 * - User profile display
 * - Logout functionality
 * - Mobile responsive
 * 
 * ROLES:
 * - student: Dashboard, My Applications
 * - teacher/hod/dean: Pending Approvals (Faculty Dashboard)
 * - coordinator: Dashboard (Coordinator Dashboard)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Load user data from localStorage on mount and when it changes
    useEffect(() => {
        const loadUserData = () => {
            const name = localStorage.getItem('userName') || 'User';
            const role = localStorage.getItem('userRole') || '';
            setUserName(name);
            setUserRole(role);
        };

        loadUserData();

        // Listen for storage changes (in case user data updates in another tab)
        window.addEventListener('storage', loadUserData);
        return () => window.removeEventListener('storage', loadUserData);
    }, []);

    // Handle logout
    const handleLogout = () => {
        // Clear all localStorage items
        localStorage.clear();
        // Navigate to login
        navigate('/login');
    };

    // Get navigation items based on user role
    const getNavItems = () => {
        switch (userRole) {
            case 'student':
                return [
                    { label: 'Dashboard', path: '/student', icon: '📊' },
                    { label: 'My Applications', path: '/student/applications', icon: '📋' },
                ];
            case 'teacher':
            case 'hod':
            case 'dean':
                return [
                    { label: 'Pending Approvals', path: '/faculty', icon: '⏳' },
                ];
            case 'coordinator':
                return [
                    { label: 'Dashboard', path: '/coordinator', icon: '📊' },
                ];
            default:
                return [];
        }
    };

    // Get role display name
    const getRoleDisplayName = () => {
        switch (userRole) {
            case 'student': return 'Student';
            case 'teacher': return 'Class Teacher';
            case 'hod': return 'HOD';
            case 'dean': return 'Dean';
            case 'coordinator': return 'Attendance Coordinator';
            default: return 'Guest';
        }
    };

    // Check if a path is active
    const isActivePath = (path) => {
        if (path === '/student' && location.pathname === '/student') return true;
        if (path === '/student/applications' && location.pathname === '/student/applications') return true;
        if (path === '/faculty' && location.pathname === '/faculty') return true;
        if (path === '/coordinator' && location.pathname === '/coordinator') return true;
        return false;
    };

    const navItems = getNavItems();

    // Styles
    const styles = {
        navbar: {
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
        container: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
        },
        logoIcon: {
            fontSize: '24px',
        },
        logoText: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            letterSpacing: '-0.3px',
        },
        logoSpan: {
            color: '#6b7280',
            fontWeight: '400',
        },
        desktopNav: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            background: 'transparent',
            border: 'none',
        },
        navItemActive: {
            color: '#111827',
            background: '#f3f4f6',
        },
        userSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingLeft: '16px',
            borderLeft: '1px solid #e5e7eb',
        },
        userAvatar: {
            width: '32px',
            height: '32px',
            background: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
        },
        userDetails: {
            display: 'flex',
            flexDirection: 'column',
        },
        userName: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
        },
        userRole: {
            fontSize: '11px',
            color: '#9ca3af',
        },
        logoutBtn: {
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '6px',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        mobileToggle: {
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
        },
        mobileMenu: {
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 99,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        },
        mobileNavItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
        },
        mobileNavItemActive: {
            color: '#111827',
            background: '#f3f4f6',
        },

        // Responsive styles
        '@media (max-width: 768px)': {
            desktopNav: {
                display: 'none',
            },
            userInfo: {
                display: 'none',
            },
            mobileToggle: {
                display: 'block',
            },
            logoText: {
                fontSize: '16px',
            },
        },
    };

    return (
        <div style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo */}
                <div style={styles.logo} onClick={() => navigate('/')}>
                    <span style={styles.logoIcon}>📚</span>
                    <span style={styles.logoText}>
                        SPIT <span style={styles.logoSpan}>| Leave Management</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div style={styles.desktopNav}>
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            style={{
                                ...styles.navItem,
                                ...(isActivePath(item.path) ? styles.navItemActive : {}),
                            }}
                            onClick={() => navigate(item.path)}
                            onMouseEnter={(e) => {
                                if (!isActivePath(item.path)) {
                                    e.currentTarget.style.background = '#f9fafb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActivePath(item.path)) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* User Section */}
                <div style={styles.userSection}>
                    <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.userDetails}>
                            <span style={styles.userName}>{userName}</span>
                            <span style={styles.userRole}>{getRoleDisplayName()}</span>
                        </div>
                    </div>

                    <button
                        style={styles.logoutBtn}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.color = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = '#6b7280';
                        }}
                    >
                        <span>🚪</span>
                        <span>Sign out</span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        style={styles.mobileToggle}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={styles.mobileMenu}>
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            style={{
                                ...styles.mobileNavItem,
                                ...(isActivePath(item.path) ? styles.mobileNavItemActive : {}),
                            }}
                            onClick={() => {
                                navigate(item.path);
                                setMobileMenuOpen(false);
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                    <button
                        style={{
                            ...styles.mobileNavItem,
                            color: '#dc2626',
                        }}
                        onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                        }}
                    >
                        <span>🚪</span>
                        <span>Sign out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;