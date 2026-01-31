import React from 'react';
import styles from './ProgressBar.module.scss';

const ProgressBar = ({ percent = 0, color = 'primary', height = 8, label = '', ...props }) => {
  return (
    <div className={styles.progressBarWrapper} style={{ height }} {...props}>
      <div
        className={styles.track}
        style={{ height }}
      >
        <div
          className={styles.fill}
          style={{ width: `${percent}%`, height, backgroundColor: `var(--color-${color})` }}
        />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default ProgressBar; 