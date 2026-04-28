/**
 * INPUT COMPONENT - Consistent form inputs
 */

import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    fullWidth = true,
    icon,
    className = ''
}) => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            width: fullWidth ? '100%' : 'auto'
        },
        label: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151'
        },
        inputWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            paddingLeft: icon ? '36px' : '14px'
        },
        errorText: {
            fontSize: '12px',
            color: '#ef4444',
            marginTop: '4px'
        },
        iconContainer: {
            position: 'absolute',
            left: '12px',
            color: '#9ca3af'
        }
    };

    return (
        <div style={styles.container}>
            {label && <label style={styles.label}>{label}{required && ' *'}</label>}
            <div style={styles.inputWrapper}>
                {icon && <span style={styles.iconContainer}>{icon}</span>}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1a56db'}
                    onBlur={(e) => e.currentTarget.style.borderColor = error ? '#ef4444' : '#d1d5db'}
                />
            </div>
            {error && <div style={styles.errorText}>{error}</div>}
        </div>
    );
};

export default Input;