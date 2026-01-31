import React from 'react';
import styles from './Tag.module.scss';

const Tag = ({
  children,
  variant = 'default', // 'default', 'primary', 'gray', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  ...props
}) => {
  return (
    <span
      className={[
        styles.tag,
        styles[variant],
        styles[size]
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag; 