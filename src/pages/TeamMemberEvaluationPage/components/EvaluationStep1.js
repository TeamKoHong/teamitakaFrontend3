import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss'; // Keep page styles for specific layout
import ProjectInfoCard from './ProjectInfoCard';
import StepIndicator from '../../../components/DesignSystem/Feedback/StepIndicator';
import Button from '../../../components/DesignSystem/Button/Button';
import EvaluationRatingInput from './EvaluationRatingInput';
import BottomCTA from '../../../components/DesignSystem/Layout/BottomCTA';

const EvaluationStep1 = ({
  projectData,
  memberData,
  evaluationData,
  onNext,
  onCategoryRatingChange,
  onMemberSelect,
  isLocked
}) => {
  const categories = [
    { id: 'participation', label: '참여도', description: '해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요' },
    { id: 'communication', label: '소통', description: '해당 팀원과의 의사소통 태도를 점수로 평가 해주세요' },
    { id: 'responsibility', label: '책임감', description: '해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요' },
    { id: 'collaboration', label: '협력', description: '해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요' },
    { id: 'individualAbility', label: '개인능력', description: '해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요' }
  ];

  const isAllRated = categories.every(cat => evaluationData.categoryRatings[cat.id] > 0);

  return (
    <>
      <ProjectInfoCard projectData={projectData} memberData={memberData} onMemberSelect={onMemberSelect} isLocked={isLocked} />

      <div className={styles.stepIndicatorContainer}>
        <StepIndicator currentStep={1} totalSteps={5} />
      </div>

      <div className={styles.questionText}>
        해당 팀원의 능력 별 점수는 몇 점인가요?
      </div>

      <div className={styles.categorySection}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryName}>{category.label}</span>
              <span className={styles.categoryDescription}>{category.description}</span>
            </div>
            <EvaluationRatingInput
              value={evaluationData.categoryRatings[category.id]}
              onChange={(val) => onCategoryRatingChange(category.id, val)}
            />
          </div>
        ))}
      </div>

      <BottomCTA>
        <Button
          variant="primary"
          fullWidth
          disabled={!isAllRated}
          onClick={onNext}
        >
          다음
        </Button>
      </BottomCTA>
    </>
  );
};

export default EvaluationStep1;