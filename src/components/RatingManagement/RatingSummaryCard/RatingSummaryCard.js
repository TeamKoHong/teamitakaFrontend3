import React from 'react';
import styles from './RatingSummaryCard.module.scss';

const RatingSummaryCard = ({ totalScore, categories }) => {
  // 방어 코드: totalScore가 undefined이면 0으로 처리
  const safeTotalScore = totalScore || 0;
  
  return (
    <div className={styles.summaryCardContainer}>
      <h3 className={styles.summaryTitle}>프로젝트 평균 별점</h3>
      <div className={styles.totalScore}>
        <span className={styles.scoreNumber}>{safeTotalScore.toFixed(1)}</span>
        <span className={styles.maxScore}> / 5.0</span>
      </div>
      <div className={styles.categoryScores}>
        {categories?.map((cat, index) => {
          // 방어 코드: cat.score가 undefined이면 0으로 처리
          const safeScore = cat.score || 0;
          return (
            <div key={index} className={styles.categoryItem}>
              <span className={styles.categoryName}>{cat.name}</span>
              <div className={styles.categoryProgressBar}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(safeScore / 5) * 100}%` }}
                ></div>
              </div>
              <span className={styles.categoryScore}>{safeScore.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummaryCard;