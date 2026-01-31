import React from 'react';
import styles from './StepIndicator.module.scss';

const StepIndicator = ({ currentStep, totalSteps = 5 }) => {
    return (
        <div className={styles.indicatorContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNum = index + 1;
                const isActive = stepNum <= currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                    <div
                        key={stepNum}
                        className={`${styles.dot} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
                    />
                );
            })}
        </div>
    );
};

export default StepIndicator;
