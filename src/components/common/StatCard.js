/**
 * STAT CARD COMPONENT - For dashboard statistics
 */

import React from 'react';

const StatCard = ({ label, value, icon, trend, color = 'primary' }) => {
    const colors = {
        primary: { background: '#eff6ff', color: '#1a56db' },
        success: { background: '#ecfdf5', color: '#10b981' },
        warning: { background: '#fffbeb', color: '#f59e0b' },
        danger: { background: '#fef2f2', color: '#ef4444' }
    };

    const colorStyle = colors[color] || colors.primary;

    const styles = {
        card: {
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '20px 24px',
            transition: 'box-shadow 200ms ease'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#6b7280'
        },
        iconContainer: {
            width: '40px',
            height: '40px',
            background: colorStyle.background,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
        },
        value: {
            fontSize: '32px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px'
        },
        trend: {
            fontSize: '12px',
            color: trend && trend > 0 ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.label}>{label}</span>
                <div style={styles.iconContainer}>{icon}</div>
            </div>
            <div style={styles.value}>{value}</div>
            {trend && (
                <div style={styles.trend}>
                    <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
                    <span>from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;    