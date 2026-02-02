import React from 'react';
import styles from './CommentsBubble.module.scss';

export default function CommentsBubble({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={styles.stack} aria-label="요약 코멘트">
      {items.map((c, i) => (
        <section key={i} className={styles.bubble}>
          <p className={styles.text}>{typeof c === 'string' ? c : c.text}</p>
        </section>
      ))}
    </div>
  );
}

