import React from 'react';
import styles from './KeywordBubble.module.scss';

export default function KeywordBubble({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={styles.stack} aria-label="키워드 관련 코멘트">
      {items.map((t, i) => (
        <section key={i} className={styles.bubble}>
          <p className={styles.text}>{t}</p>
        </section>
      ))}
    </div>
  );
}


