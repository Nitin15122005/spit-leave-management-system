/**
 * ALERT COMPONENT - Success/Error messages
 */

import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', message, onClose, autoClose = 5000 }) => {
    const [visible, setVisible] = useState(true);

    const types = {
        success: { background: '#ecfdf5', color: '#059669', border: '#d1fae5', icon: '✓' },
        error: { background: '#fef2f2', color: '#dc2626', border: '#fee2e2', icon: '⚠' },
        warning: { background: '#fffbeb', color: '#d97706', border: '#fef3c7', icon: '!' },
        info: { background: '#eff6ff', color: '#2563eb', border: '#dbeafe', icon: 'ℹ' }
    };

    const style = types[type] || types.info;

    useEffect(() => {
        if (autoClose && message) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, message, onClose]);

    if (!visible || !message) return null;

    const styles = {
        alert: {
            background: style.background,
            color: style.color,
            border: `1px solid ${style.border}`,
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px'
        },
        content: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1
        },
        icon: {
            fontSize: '16px',
            fontWeight: 'bold'
        },
        message: {
            fontSize: '13px',
            lineHeight: '1.5'
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: style.color,
            opacity: 0.6,
            padding: '0 4px'
        }
    };

    return (
        <div style={styles.alert}>
            <div style={styles.content}>
                <span style={styles.icon}>{style.icon}</span>
                <span style={styles.message}>{message}</span>
            </div>
            <button style={styles.closeBtn} onClick={() => { setVisible(false); if (onClose) onClose(); }}>
                ×
            </button>
        </div>
    );
};

export default Alert;