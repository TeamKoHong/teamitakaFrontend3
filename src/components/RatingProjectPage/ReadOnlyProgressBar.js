import React from 'react';
import styles from './ReadOnlyProgressBar.module.scss';

/**
 * 상세 페이지용 읽기 전용 진행바
 * - 슬라이더 대신 진행바로 점수 표시
 * - 인터랙션 없이 읽기 전용
 * - 1-5 스케일 숫자 표시
 */
export default function ReadOnlyProgressBar({ label, value, maxValue = 5 }) {
  const percentage = (value / maxValue) * 100;
  const roundedValue = Math.round(value);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={styles.scale}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`${styles.scaleNum} ${num === roundedValue ? styles.active : ''}`}
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  );
}
