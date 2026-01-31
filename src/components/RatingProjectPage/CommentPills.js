import React from 'react';
import styles from './CommentPills.module.scss';

export default function CommentPills({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={styles.wrap} aria-label="코멘트 칩">
      {items.map((it, idx) => (
        <div key={idx} className={`${styles.pill} ${it.tone === 'dark' ? styles.dark : styles.light}`}>{it.text}</div>
      ))}
    </div>
  );
}


