import React from 'react';
import styles from './EvaluationCommentCard.module.scss';

/**
 * 평가 코멘트 카드 - 아바타 + 말풍선 스타일
 * @param {string} avatar - 아바타 이미지 경로
 * @param {string} text - 코멘트 텍스트
 * @param {function} onClick - 클릭 핸들러 (선택)
 */
export default function EvaluationCommentCard({ avatar, text, onClick }) {
  if (!text) return null;

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={`${styles.card} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img
        src={avatar || '/icons/default-avatar.svg'}
        alt="평가자"
        className={styles.avatar}
      />
      <div className={styles.bubble}>
        <p className={styles.text}>{text}</p>
      </div>
    </article>
  );
}
