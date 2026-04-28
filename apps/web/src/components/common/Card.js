/**
 * CARD COMPONENT - Reusable card with consistent styling
 */

import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    actions,
    padding = 'large',
    hover = false,
    className = ''
}) => {
    const paddingSizes = {
        small: '16px',
        medium: '20px',
        large: '24px',
        xlarge: '32px'
    };

    const styles = {
        card: {
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            transition: 'box-shadow 200ms ease, transform 200ms ease',
            ...(hover && {
                cursor: 'pointer',
                ':hover': {
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                }
            })
        },
        header: {
            padding: `${paddingSizes[padding]} ${paddingSizes[padding]}`,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
        },
        title: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px'
        },
        subtitle: {
            fontSize: '13px',
            color: '#6b7280'
        },
        body: {
            padding: paddingSizes[padding]
        }
    };

    return (
        <div style={styles.card} className={className}>
            {(title || subtitle || actions) && (
                <div style={styles.header}>
                    <div>
                        {title && <div style={styles.title}>{title}</div>}
                        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div style={styles.body}>
                {children}
            </div>
        </div>
    );
};

export default Card;