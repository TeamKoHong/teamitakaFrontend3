import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProjectInfoCard from './ProjectInfoCard';
import StepIndicator from '../../../components/DesignSystem/Feedback/StepIndicator';
import Button from '../../../components/DesignSystem/Button/Button';
import BottomCTA from '../../../components/DesignSystem/Layout/BottomCTA';
import RatingStars from '../../../components/DesignSystem/Input/RatingStars';
import TextArea from '../../../components/DesignSystem/Input/TextArea';

const EvaluationStep2 = ({
  projectData,
  memberData,
  evaluationData,
  onOverallRatingChange,
  onRoleDescriptionChange,
  onSubmit,
  onMemberSelect,
  isLocked
}) => {
  const isFormValid = evaluationData.overallRating > 0;

  return (
    <>
      <ProjectInfoCard projectData={projectData} memberData={memberData} onMemberSelect={onMemberSelect} isLocked={isLocked} />

      <div className={styles.stepIndicatorContainer}>
        <StepIndicator currentStep={2} totalSteps={2} variant="numbered" />
      </div>

      <div className={styles.categorySection}>
        {/* Overall Rating Section */}
        <div className={styles.overallRatingSection}>
          <div className={styles.overallLabel}>해당 팀원의 전체 총점은 몇 점인가요?</div>
          <div className={styles.overallSubtitle}>별점은 익명으로 전송되니 솔직하게 평가해주세요.</div>
          <div className={styles.starsWrapper}>
            <RatingStars
              value={evaluationData.overallRating}
              onChange={onOverallRatingChange}
              size="lg"
            />
          </div>
        </div>

        {/* Role Description Section */}
        <div className={styles.roleSection}>
          <TextArea
            label={<>해당 팀원의 업무 분담 및<br />구체적인 역할은 무엇이었나요?</>}
            placeholder="내용을 입력해주세요."
            value={evaluationData.roleDescription}
            onChange={(e) => onRoleDescriptionChange(e.target.value)}
            maxLength={100}
            showCount
            variant="transparent"
          />
        </div>
      </div>

      <BottomCTA>
        <Button
          variant="primary"
          fullWidth
          disabled={!isFormValid}
          onClick={onSubmit}
        >
          평가 보내기
        </Button>
      </BottomCTA>
    </>
  );
};

export default EvaluationStep2;
