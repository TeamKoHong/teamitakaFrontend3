import React from 'react';
import styles from './EvaluationCompletedInfoCard.module.scss';
import CategoryRatingRow from './CategoryRatingRow';

/**
 * 평가 완료된 상세 정보를 보여주는 카드 컴포넌트
 */
export default function EvaluationCompletedInfoCard({
  reviewerName,   // 리뷰어 이름 (혹은 익명N)
  categories,     // [{ name, score }, ...]
  averageScore,   // 총점 (optional)
  comment,        // 코멘트 (optional)
  reviewId        // key용 id (optional)
}) {
  // 아바타 이니셜 (첫 글자)
  const initial = reviewerName ? reviewerName.charAt(0) : '?';

  return (
    <div className={styles.card}>
      {/* 아바타 */}
      <div className={styles.reviewerAvatar}>
        {initial}
      </div>

      {/* 이름 */}
      <h3 className={styles.reviewerName}>
        {reviewerName}
      </h3>

      {/* 평가 항목 테이블 */}
      <div className={styles.memberCategoryTable}>
        {categories && categories.map((cat) => (
          <div className={styles.categoryRow} key={cat.name}>
             <span className={styles.categoryName} title={cat.name}>{cat.name}</span>
             <div className={styles.starsAndScore}>
                 <CategoryRatingRow
                   label="" 
                   value=""
                   stars={cat.score ?? 0}
                   hideLabel={true} // Reusing CategoryRatingRow just for stars if possible, or we manually render stars
                 />
                 <span className={styles.categoryScore}>
                   {(cat.score ?? 0).toFixed(1)}
                 </span>
             </div>
          </div>
        ))}
        
        {/* 총점 (있을 경우) */}
        {averageScore !== undefined && (
           <div className={`${styles.categoryRow} ${styles.total}`}>
             <span className={styles.categoryName}>총점</span>
             <div className={styles.starsAndScore}>
                 <CategoryRatingRow
                   label=""
                   value=""
                   stars={averageScore ?? 0}
                   hideLabel={true}
                 />
                 <span className={styles.categoryScore}>
                   {(averageScore ?? 0).toFixed(1)}
                 </span>
             </div>
           </div>
        )}
      </div>

      {/* 코멘트 */}
      {comment && (
        <div className={styles.reviewComment}>
          <span>{/* Icon placeholder handled by CSS */}</span>
          <span>{comment}</span>
        </div>
      )}
    </div>
  );
}
