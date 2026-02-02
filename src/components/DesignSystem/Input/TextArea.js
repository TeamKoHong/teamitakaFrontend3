import React from 'react';
import styles from './TextArea.module.scss';

const TextArea = ({
    label,
    value,
    onChange,
    placeholder,
    maxLength,
    showCount = false,
    error = false,
    variant = 'default', // 'default' | 'transparent'
    className,
    ...props
}) => {
    const currentLength = String(value || '').length;

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {label && <label className={styles.label}>{label}</label>}

            <div className={`${styles.inputWrapper} ${error ? styles.error : ''} ${variant === 'transparent' ? styles.transparent : ''}`}>
                <textarea
                    className={styles.textarea}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    {...props}
                />

                {showCount && maxLength && (
                    <div className={styles.counter}>
                        {currentLength}/{maxLength}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextArea;
