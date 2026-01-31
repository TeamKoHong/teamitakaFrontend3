import React from 'react';
import { ReactComponent as FilledStar } from '../../../assets/icons/star1.svg';
import { ReactComponent as EmptyStar } from '../../../assets/icons/star2.svg';
import styles from './RatingStars.module.scss';

const RatingStars = ({
    value = 0,
    onChange,
    max = 5,
    size = 'md', // 'md', 'lg'
    readOnly = false,
    className
}) => {
    const handleStarClick = (rating) => {
        if (!readOnly && onChange) {
            onChange(rating);
        }
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {[...Array(max)].map((_, index) => {
                const ratingValue = index + 1;
                const isActive = ratingValue <= value;
                const StarIcon = isActive ? FilledStar : EmptyStar;

                return (
                    <StarIcon
                        key={index}
                        className={`
              ${styles.starIcon}
              ${isActive ? styles.active : ''}
              ${readOnly ? styles.readOnly : ''}
              ${styles[size]}
            `}
                        onClick={() => handleStarClick(ratingValue)}
                    />
                );
            })}
        </div>
    );
};

export default RatingStars;
