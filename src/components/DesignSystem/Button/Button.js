import React from 'react';
import styles from './Button.module.scss';

/**
 * Button Component
 * @param {string} variant - 'primary', 'secondary', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} layout - 'center', 'navigation'
 * @param {boolean} fullWidth - Whether to take full width
 * @param {boolean} isLoading - Loading state
 * @param {ReactNode} leftIcon - Icon on the left
 * @param {ReactNode} rightIcon - Icon on the right
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    layout = 'center',
    fullWidth = false,
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    className,
    ...props
}) => {
    const buttonClass = [
        styles.button,
        styles[variant],
        styles[size],
        layout === 'navigation' ? styles.navigation : '',
        fullWidth ? styles.fullWidth : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClass}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <div className={styles.spinner} />}
            {!isLoading && leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
            <span className={styles.content}>{children}</span>
            {!isLoading && rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
        </button>
    );
};

export default Button;
