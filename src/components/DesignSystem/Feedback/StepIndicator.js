import React from 'react';
import styles from './StepIndicator.module.scss';

/**
 * StepIndicator 컴포넌트
 * @param {number} currentStep - 현재 스텝 (1부터 시작)
 * @param {number} totalSteps - 총 스텝 수
 * @param {string} variant - 'pill' (회원가입용) | 'numbered' (팀원평가용)
 */
const StepIndicator = ({ currentStep, totalSteps = 5, variant = 'pill' }) => {
    if (variant === 'numbered') {
        // 팀원 평가용: 숫자/체크마크 + 점선
        return (
            <div className={styles.numberedContainer}>
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    const isPending = stepNum > currentStep;

                    return (
                        <React.Fragment key={stepNum}>
                            <div
                                className={`${styles.numberedStep} ${isCompleted ? styles.numberedCompleted : ''} ${isCurrent ? styles.numberedCurrent : ''} ${isPending ? styles.numberedPending : ''}`}
                            >
                                {isCompleted ? (
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                        <path d="M1 3.5L3.25 5.75L8 1" stroke="#F76241" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <b className={styles.stepNumber}>{stepNum}</b>
                                )}
                            </div>
                            {stepNum < totalSteps && (
                                <div className={styles.dashedLine} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    // 회원가입용: pill 스타일
    return (
        <div className={styles.pillContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                    <div
                        key={stepNum}
                        className={`${styles.dot} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                    />
                );
            })}
        </div>
    );
};

export default StepIndicator;
