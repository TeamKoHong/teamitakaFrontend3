import React from 'react';
import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import styles from './CategoryRatingRow.module.scss';

export default function CategoryRatingRow({ label, value, stars, bold }) {
  return (
    <div className={styles.categoryRow + (bold ? ' ' + styles.bold : '')}>
      <span className={styles.categoryName}>{label}</span>
      <div className={styles.starsAndScore}>
        <RatingInputStars initialRating={stars} readOnly />
        <span className={styles.categoryScore}>{value}</span>
      </div>
    </div>
  );
} 