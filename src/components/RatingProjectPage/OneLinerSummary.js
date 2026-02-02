import React from 'react';
import styles from './OneLinerSummary.module.scss';

export default function OneLinerSummary({ text }) {
  return (
    <section className={styles.card} aria-label="한 줄 요약">
      <div className={styles.badge}>이런 점이 좋아요</div>
      {text ? <p className={styles.text}>{text}</p> : null}
    </section>
  );
}

