import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import Button from '../../../components/DesignSystem/Button/Button';
import BottomCTA from '../../../components/DesignSystem/Layout/BottomCTA';
import RatingStars from '../../../components/DesignSystem/Input/RatingStars';
import { formatDate } from '../../../utils/dateFormat';

const EvaluationStep3 = ({
  memberData,
  evaluationData,
  nextPendingMember,
  onGoNext,
  onGoHome,
  onClose
}) => {
  const today = formatDate(new Date().toISOString(), 'dot');

  return (
    <div className={styles.stepContainer}>
      {/* White Section - Header + Card + Date */}
      <div className={styles.topSection}>
        {/* Integrated Modal Header */}
        <div className={styles.modalHeader}>
          <span className={styles.headerTitle}>팀원 평가</span>
          <button className={styles.closeButton} onClick={onClose || onGoHome}>
            ✕
          </button>
        </div>

        {memberData && (
          <>
            <div className={styles.completedMemberCard}>
              <img src={memberData.avatar} alt={memberData.name} className={styles.memberAvatar} />
              <div className={styles.memberTextContainer}>
                {/* Role Label / Role */}
                <div className={styles.roleTag}>담당 업무</div>
                <div className={styles.memberName}>{memberData.name}</div>
                <div className={styles.starRating}>
                  <RatingStars value={evaluationData?.overallRating || 0} readOnly size="md" />
                </div>
              </div>
            </div>

            <div className={styles.evaluationDate}>
              {today} (평가날짜)
            </div>
          </>
        )}
      </div>

      {/* Gray Section - Check Icon + Message + Buttons */}
      <BottomCTA>
        <div className={styles.bottomSection}>
          {/* Centered content: Check Icon and Message */}
          <div className={styles.centeredContent}>
            <div className={styles.checkIconCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.successMessage}>팀원 평가를 완료했어요!</div>
          </div>

          {/* Bottom buttons */}
          <div className={styles.buttonGroup}>
            {nextPendingMember ? (
              <Button
                variant="primary"
                fullWidth
                layout="navigation"
                onClick={onGoNext}
                rightIcon={<span>→</span>}
              >
                다음 팀원 평가하러 가기
              </Button>
            ) : (
              <Button
                variant="primary"
                fullWidth
                onClick={onGoHome}
              >
                완료
              </Button>
            )}

            <button
              className={styles.homeLink}
              onClick={onGoHome}
            >
              프로젝트 관리 홈으로
            </button>
          </div>
        </div>
      </BottomCTA>
    </div>
  );
};

export default EvaluationStep3;