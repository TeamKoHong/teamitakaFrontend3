import React from 'react';
import styles from './DetailCommentCard.module.scss';

/**
 * 상세 페이지 전용 코멘트 카드
 * - 아바타가 중앙에 배치
 * - 텍스트가 아래에 카드 형태로 표시
 */
export default function DetailCommentCard({ avatar, text }) {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img src={avatar} alt="평가자" className={styles.avatar} />
      </div>
      <div className={styles.textBox}>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
