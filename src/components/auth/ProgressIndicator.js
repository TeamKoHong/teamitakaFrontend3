import React from 'react';
import styles from './ProgressIndicator.module.scss';

/**
 * 진행 표시 컴포넌트
 * @param {Object} props
 * @param {number} props.currentStep - 현재 단계 (1-based)
 * @param {number} props.totalSteps - 전체 단계 수
 */
const ProgressIndicator = ({ currentStep = 1, totalSteps = 5 }) => {
    return (
        <div className={styles.container}>
            {Array.from({ length: totalSteps }, (_, i) => {
                const stepNumber = i + 1;
                const isActive = stepNumber <= currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                    <React.Fragment key={i}>
                        <div
                            className={`${styles.step} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
                        />
                        {i < totalSteps - 1 && (
                            <div className={`${styles.line} ${stepNumber < currentStep ? styles.active : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ProgressIndicator;
