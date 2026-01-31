import React from 'react';
import styles from './Button.module.scss';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        styles[size],
        disabled ? styles.disabled : ''
      ].join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 