import React from 'react';
import styles from './StickyCTA.module.scss';

export default function StickyCTA({ label = '상세 내용 더보기', expanded = false, onClick, controlsId }) {
  return (
    <button
      type="button"
      className={styles.cta}
      onClick={onClick}
      aria-controls={controlsId}
      aria-expanded={expanded}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.caret} aria-hidden>⌃</span>
    </button>
  );
}

