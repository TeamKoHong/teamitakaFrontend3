import React from 'react';
import styles from './ProjectRatingCard.module.scss';
import RatingInputStars from '../RatingInputStars/RatingInputStars';
import Tag from '../../Common/Tag';
import { PiCalendarBlankDuotone } from "react-icons/pi";

const ProjectRatingCard = ({ project, onClick }) => {
  const { id, name, description, period, imageUrl, myRatingStatus, myScore } = project;

  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <div className={styles.cardHeader}>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>{name}</h3>
          <span className={styles.projectPeriod}>
            <PiCalendarBlankDuotone className={styles.calendarIcon} />
            {period}
          </span>
        </div>
        <div className={styles.projectImageWrapper}>
          <img src={imageUrl || "https://via.placeholder.com/80/cccccc/ffffff?text=P"} alt={`${name} thumbnail`} className={styles.projectImage} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.ratingInfo}>
          <span className={styles.myRatingLabel}>내 별점 평균</span>
          {myRatingStatus === 'COMPLETED' && myScore !== null ? (
            <div className={styles.myRatingStars}>
              <RatingInputStars initialRating={myScore} maxStars={5} readOnly={true} />
              <span className={styles.myRatingScore}>{myScore.toFixed(1)}</span>
            </div>
          ) : (
            <Tag variant={myRatingStatus === 'PENDING' ? 'default' : 'gray'} size="sm">
              {myRatingStatus === 'PENDING' ? '평가 대기' : '평가 확인'}
            </Tag>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectRatingCard; 