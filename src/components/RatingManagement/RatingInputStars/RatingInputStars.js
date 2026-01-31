import React, { useState } from 'react';
import styles from './RatingInputStars.module.scss';

const RatingInputStars = ({ initialRating = 0, onRatingChange, maxStars = 5, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  // initialRating prop이 변경될 때 내부 currentRating 상태 동기화
  React.useEffect(() => {
    setCurrentRating(initialRating);
  }, [initialRating]);

  const handleMouseEnter = (index) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (readOnly) return;
    setCurrentRating(index);
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={styles.starRating}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={`${styles.star} ${starValue <= (hoverRating || currentRating) ? styles.filled : ''} ${readOnly ? styles.readOnly : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            role={readOnly ? "img" : "button"} // readOnly일 때 role 변경
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            &#9733; {/* Unicode star character */}
          </span>
        );
      })}
    </div>
  );
};

export default RatingInputStars;