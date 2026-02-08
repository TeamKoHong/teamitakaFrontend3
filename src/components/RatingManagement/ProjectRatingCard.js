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
          <img src={imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='%23fff' font-size='24' font-family='sans-serif'%3EP%3C/text%3E%3C/svg%3E"} alt={`${name} thumbnail`} className={styles.projectImage} />
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