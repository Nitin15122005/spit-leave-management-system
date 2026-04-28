/**
 * SELECT COMPONENT - Consistent dropdown
 */

import React from 'react';

const Select = ({
    label,
    name,
    value,
    onChange,
    options,
    placeholder,
    required = false,
    error,
    fullWidth = true,
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
        select: {
            width: '100%',
            padding: '10px 14px',
            border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '8px',
            fontSize: '14px',
            background: '#ffffff',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 200ms ease'
        },
        errorText: {
            fontSize: '12px',
            color: '#ef4444',
            marginTop: '4px'
        }
    };

    return (
        <div style={styles.container}>
            {label && <label style={styles.label}>{label}{required && ' *'}</label>}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                style={styles.select}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1a56db'}
                onBlur={(e) => e.currentTarget.style.borderColor = error ? '#ef4444' : '#d1d5db'}
            >
                <option value="">{placeholder || 'Select...'}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div style={styles.errorText}>{error}</div>}
        </div>
    );
};

export default Select;