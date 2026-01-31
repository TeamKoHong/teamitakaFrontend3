import React from 'react';
import RatingInputStars from '../RatingInputStars/RatingInputStars'; // 별점 표시를 위해 재사용
import styles from './IndividualRatingReview.module.scss';

const IndividualRatingReview = ({ review }) => {
  // review 객체에서 필요한 속성들을 구조 분해 할당
  const { reviewerName, ratingDate, averageScore, categories, comment } = review;

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewerName}>{reviewerName}</span>
        {ratingDate && <span className={styles.ratingDate}>{ratingDate}</span>} {/* ratingDate가 있을 때만 표시 */}
      </div>
      {averageScore !== undefined && ( // averageScore가 정의되어 있을 때만 표시
        <div className={styles.averageScore}>
          <span className={styles.scoreLabel}>총 평균:</span>
          <span className={styles.scoreValue}>{averageScore.toFixed(1)}점</span>
        </div>
      )}
      {categories && categories.length > 0 && ( // categories 배열이 있고 비어있지 않을 때만 표시
        <ul className={styles.categoryRatings}>
          {categories.map((cat, index) => (
            <li key={index} className={styles.categoryItem}>
              <span className={styles.categoryName}>{cat.name}:</span>
              <div className={styles.categoryStars}>
                {/* RatingInputStars 컴포넌트에 initialRating과 readOnly 속성 전달 */}
                <RatingInputStars initialRating={cat.score} maxStars={5} readOnly={true} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {comment && ( // comment가 있을 때만 표시
        <div className={styles.reviewComment}>
          <p className={styles.commentText}>"{comment}"</p>
        </div>
      )}
    </div>
  );
};

export default IndividualRatingReview;