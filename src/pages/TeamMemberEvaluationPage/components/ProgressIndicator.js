import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';

const ProgressIndicator = ({ currentStep, totalSteps = 5, currentVariant = 'orange' }) => {
  return (
    <div className={styles.progressIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <div className={`${styles.progressStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''} ${isCurrent && currentVariant === 'gray' ? styles.currentGray : ''} ${!isCompleted && !isCurrent ? styles.upcoming : ''}`}>
              {isCompleted ? (
                <span className={styles.checkIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path d="M6 12l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              ) : (
                <span className={styles.stepNumber}>{stepNumber}</span>
              )}
            </div>
            {stepNumber < totalSteps && (
              <div className={`${styles.progressLine} ${isCompleted ? styles.completed : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressIndicator; 