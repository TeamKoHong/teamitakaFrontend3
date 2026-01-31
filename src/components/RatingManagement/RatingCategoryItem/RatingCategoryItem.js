import React from 'react';
import RatingInputStars from '../RatingInputStars/RatingInputStars';
import styles from './RatingCategoryItem.module.scss';

const RatingCategoryItem = ({ category, description, onRatingChange, currentRating, readOnly = false }) => {
  return (
    <div className={styles.categoryItemContainer}>
      <h4 className={styles.categoryTitle}>{category}</h4>
      <p className={styles.categoryDescription}>{description}</p>
      <RatingInputStars
        initialRating={currentRating}
        onRatingChange={onRatingChange ? (rating) => onRatingChange(category, rating) : null}
        readOnly={readOnly}
      />
    </div>
  );
};

export default RatingCategoryItem;