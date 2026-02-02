import React from 'react';
import styles from './StepIndicator.module.scss';

const StepIndicator = ({ currentStep, totalSteps = 2 }) => {
    return (
        <div className={styles.indicatorContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                const isPending = stepNum > currentStep;

                return (
                    <React.Fragment key={stepNum}>
                        {/* Step Circle */}
                        <div
                            className={`${styles.step} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''} ${isPending ? styles.pending : ''}`}
                        >
                            {isCompleted ? (
                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                    <path d="M1 3.5L3.25 5.75L8 1" stroke="#F76241" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <b className={styles.stepNumber}>{stepNum}</b>
                            )}
                        </div>

                        {/* Dashed Line (except after last step) */}
                        {stepNum < totalSteps && (
                            <div className={styles.dashedLine} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;
