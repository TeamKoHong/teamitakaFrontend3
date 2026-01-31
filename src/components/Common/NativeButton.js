import React from 'react';
import { useNativeApp } from '../../hooks/useNativeApp';
import './NativeButton.css';

const NativeButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  haptic = 'medium',
  className = '',
  ...props
}) => {
  const { hapticFeedback } = useNativeApp();

  const handleClick = async (e) => {
    if (disabled) return;

    await hapticFeedback(haptic);
    onClick?.(e);
  };

  return (
    <button
      className={`native-button native-button--${variant} native-button--${size} ${fullWidth ? 'native-button--full' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default NativeButton;
