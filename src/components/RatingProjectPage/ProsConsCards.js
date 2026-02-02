import React from 'react';
import styles from './ProsConsCards.module.scss';

export default function ProsConsCards({ good = [], improve = [] }) {
  const renderList = (items) => (
    <ul className={styles.list}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );

  return (
    <section className={styles.wrap} aria-label="한 줄 요약">
      <div className={`${styles.card} ${styles.good}`}>
        <div className={styles.badge}>이런 점이 좋아요 👍</div>
        {good.length > 0 ? (
          renderList(good)
        ) : (
          <p className={styles.empty}>아직 평가가 없습니다</p>
        )}
      </div>
      <div className={`${styles.card} ${styles.improve}`}>
        <div className={styles.badge}>이런 점은 개선이 필요해요 🚨</div>
        {improve.length > 0 ? (
          renderList(improve)
        ) : (
          <p className={styles.empty}>아직 평가가 없습니다</p>
        )}
      </div>
    </section>
  );
}

