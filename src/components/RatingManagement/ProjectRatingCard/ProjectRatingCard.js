// src/components/RatingManagement/ProjectRatingCard/ProjectRatingCard.js
import React from 'react';
import styles from './ProjectRatingCard.module.scss';
import RatingInputStars from '../RatingInputStars/RatingInputStars'; // 별점 컴포넌트 임포트
import { PiCalendarBlankDuotone } from "react-icons/pi"; // 달력 아이콘 임포트 추가

// RatingStatusDisplay는 현재 사용되지 않으므로, 이 import 문은 제거합니다.
// import RatingStatusDisplay from './RatingStatusDisplay/RatingStatusDisplay';

const ProjectRatingCard = ({ project, onClick }) => {
  const { name, period, imageUrl, myRatingStatus, myScore } = project;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getRatingStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '아직 별점을 남기지 않았어요.';
      case 'COMPLETED':
        // 목업의 "내 별점 평균" 부분과 연관되므로, 여기서는 텍스트만 반환하거나 다른 상태 텍스트를 반환할 수 있습니다.
        // 현재는 COMPLETED 상태일 때 별점과 점수가 직접 렌더링되므로, 이 텍스트는 보이지 않을 수 있습니다.
        return '평가 완료'; // 목업과 일치하도록 "별점 평가 완료" -> "평가 완료" 로 변경
      case 'VIEW_ONLY':
        return '팀원 평가 확인';
      default:
        return '알 수 없는 상태';
    }
  };

  const getRatingStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'COMPLETED':
        return styles.statusCompleted;
      case 'VIEW_ONLY':
        return styles.statusViewOnly;
      default:
        return '';
    }
  };

  return (
    <div className={styles.cardContainer} onClick={handleCardClick}>
      <div className={styles.cardHeader}>
        <div className={styles.projectNameAndPeriod}>
          <h3 className={styles.projectName}>{name}</h3>
          <span className={styles.projectPeriod}>
            {/* 달력 아이콘을 img 태그 대신 react-icons 컴포넌트로 변경 */}
            <PiCalendarBlankDuotone className={styles.calendarIcon} />
            {period}
          </span>
        </div>
        <div className={styles.projectImageWrapper}>
          {/* 목업과 유사한 사람 그룹 아이콘을 원하시면 실제 이미지 파일로 교체해주세요. */}
          {/* 예: src="/icons/team-avatar.svg" 또는 "https://api.adorable.io/avatars/80/some-team-name.png" */}
          {/* 현재는 일반적인 플레이스홀더를 사용합니다. */}
          <img src={imageUrl || "https://via.placeholder.com/80/cccccc/ffffff?text=P"} alt={`${name} thumbnail`} className={styles.projectImage} />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.ratingInfo}>
          {myRatingStatus === 'COMPLETED' && myScore !== null ? (
            <div className={styles.myRatingRow}>
              <span className={styles.myRatingLabel}>내 별점 평균</span>
              <div className={styles.myRatingStars}>
                <RatingInputStars initialRating={myScore} maxStars={5} readOnly={true} />
              </div>
              <span className={styles.myRatingScore}>{myScore.toFixed(1)}</span>
            </div>
          ) : (
            // PENDING, VIEW_ONLY 상태일 때 텍스트 표시
            <span className={`${styles.statusText} ${getRatingStatusClass(myRatingStatus)}`}>
              {getRatingStatusText(myRatingStatus)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectRatingCard;