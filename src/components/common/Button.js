/**
 * BUTTON COMPONENT - Consistent button styles
 */

import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    icon,
    className = ''
}) => {
    const variants = {
        primary: {
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            ':hover': { background: '#374151' }
        },
        secondary: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #d1d5db',
            ':hover': { background: '#f9fafb', borderColor: '#9ca3af' }
        },
        danger: {
            background: '#ffffff',
            color: '#dc2626',
            border: '1px solid #fecaca',
            ':hover': { background: '#fef2f2', borderColor: '#fca5a5' }
        },
        success: {
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            ':hover': { background: '#059669' }
        },
        outline: {
            background: 'transparent',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            ':hover': { background: '#f9fafb', color: '#374151' }
        }
    };

    const sizes = {
        small: { padding: '6px 12px', fontSize: '12px', borderRadius: '6px' },
        medium: { padding: '10px 20px', fontSize: '14px', borderRadius: '8px' },
        large: { padding: '12px 24px', fontSize: '16px', borderRadius: '8px' }
    };

    const variantStyle = variants[variant] || variants.primary;
    const sizeStyle = sizes[size] || sizes.medium;

    const styles = {
        button: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '500',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            transition: 'all 200ms ease',
            width: fullWidth ? '100%' : 'auto',
            opacity: disabled || loading ? 0.6 : 1,
            ...variantStyle,
            ...sizeStyle
        }
    };

    return (
        <button
            type={type}
            style={styles.button}
            onClick={onClick}
            disabled={disabled || loading}
            onMouseEnter={(e) => {
                if (!disabled && !loading && variantStyle[':hover']) {
                    Object.assign(e.currentTarget.style, variantStyle[':hover']);
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !loading) {
                    Object.assign(e.currentTarget.style, {
                        background: variantStyle.background,
                        color: variantStyle.color,
                        border: variantStyle.border
                    });
                }
            }}
        >
            {loading && <span>⟳</span>}
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;