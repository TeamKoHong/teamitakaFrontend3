import React, { useRef, useState, useCallback } from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';

const EvaluationRatingInput = ({ value = 1, onChange, min = 1, max = 5, disabled = false }) => {
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = (e) => {
        if (disabled) return;
        setIsDragging(true);
        updateValue(e.clientX);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging || disabled) return;
        updateValue(e.clientX);
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    const updateValue = useCallback((clientX) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = Math.round(percentage * (max - min)) + min;
        if (newValue !== value) {
            onChange(newValue);
        }
    }, [max, min, onChange, value]);

    // Calculate percentage for knob position
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={styles.ratingInputContainer}>
            <div
                className={styles.ratingTrackArea}
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <div className={styles.ratingTrackBackground} />
                <div
                    className={styles.ratingTrackFill}
                    style={{ width: `${percentage}%` }}
                />
                <div
                    className={styles.ratingKnob}
                    style={{ left: `${percentage}%` }}
                />
            </div>
            <div className={styles.ratingLabels}>
                {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(num => (
                    <div
                        key={num}
                        className={`${styles.ratingLabel} ${value === num ? styles.active : ''}`}
                        onClick={() => !disabled && onChange(num)}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvaluationRatingInput;
