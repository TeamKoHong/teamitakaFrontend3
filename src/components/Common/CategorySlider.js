import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './CategorySlider.module.scss';

const CategorySlider = ({
  category,
  name,
  description,
  value = 1,
  onChange,
  min = 1,
  max = 5,
  disabled = false,
  compact = false,
  showDescription = true,
  showThumb = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const pointerIdRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const thresholdExceededRef = useRef(false);
  const downOnThumbRef = useRef(false);

  const DRAG_THRESHOLD_PX = 12;
  const DIRECTION_RATIO = 1.2; // horizontal must be 20% larger than vertical
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  // 값을 퍼센트로 변환
  const getPercentage = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  // 퍼센트를 값으로 변환
  const getValueFromPercentage = useCallback((percentage) => {
    const rawValue = (percentage / 100) * (max - min) + min;
    return Math.round(rawValue);
  }, [min, max]);

  // 위치에서 값 계산
  const getValueFromPosition = useCallback((clientX) => {
    if (!sliderRef.current) return value;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = getValueFromPercentage(percentage);

    return Math.max(min, Math.min(max, newValue));
  }, [value, min, max, getValueFromPercentage]);

  // 포인터 이벤트 핸들러로 통합
  const cleanupPointer = useCallback(() => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    pointerIdRef.current = null;
    thresholdExceededRef.current = false;
    downOnThumbRef.current = false;
    setIsPressed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (disabled) return;
    if (pointerIdRef.current == null || e.pointerId !== pointerIdRef.current) return;

    // Threshold 판단 전에는 스크롤을 우선시
    if (!downOnThumbRef.current) return; // 트랙에서 드래그 금지

    if (!thresholdExceededRef.current) {
      const dx = Math.abs(e.clientX - startXRef.current);
      const dy = Math.abs(e.clientY - startYRef.current);
      const horizontalLock = dx >= DRAG_THRESHOLD_PX && dx > dy * DIRECTION_RATIO;
      const verticalLock = dy >= DRAG_THRESHOLD_PX && dy > dx * DIRECTION_RATIO;
      if (horizontalLock) {
        thresholdExceededRef.current = true;
      } else if (verticalLock) {
        // 스크롤 우선: 아무것도 하지 않음
        return;
      } else {
        return;
      }
    }

    const newValue = getValueFromPosition(e.clientX);
    onChange(newValue);
  }, [disabled, getValueFromPosition, onChange]);

  const handlePointerUp = useCallback((e) => {
    if (pointerIdRef.current == null || e.pointerId !== pointerIdRef.current) return;
    // 트랙 탭: 드래그 확정되지 않았고, 시작이 썸이 아니면 탭으로 간주하여 점프
    if (!thresholdExceededRef.current && !downOnThumbRef.current) {
      const newValue = getValueFromPosition(e.clientX);
      onChange(newValue);
    }
    cleanupPointer();
  }, [cleanupPointer, getValueFromPosition, onChange]);

  const handlePointerDown = useCallback((e) => {
    if (disabled) return;
    // 썸에서 시작했는지 판별
    const path = e.composedPath ? e.composedPath() : [];
    downOnThumbRef.current = showThumb
      ? (path.includes(thumbRef.current) || e.target === thumbRef.current)
      : true; // 썸이 없으면 트랙에서 바로 드래그 허용
    setIsPressed(downOnThumbRef.current);
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    thresholdExceededRef.current = false;
    // 전역 리스너 등록
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [disabled, handlePointerMove, handlePointerUp, showThumb]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;

    let newValue = value;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(min, value - 1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(max, value + 1);
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      default:
        return;
    }

    onChange(newValue);
  }, [disabled, value, min, max, onChange]);

  // 라벨 클릭 핸들러
  const handleLabelClick = useCallback((labelValue) => {
    if (disabled) return;
    onChange(labelValue);
  }, [disabled, onChange]);

  // 언마운트/라우트 변경 시 클린업
  useEffect(() => cleanupPointer, [cleanupPointer]);

  const percentage = getPercentage(value);
  const labels = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className={`${styles.categorySlider} ${disabled ? styles.disabled : ''} ${compact ? styles.compact : ''} ${!showThumb ? styles.noThumb : ''}`}>
      <div className={styles.categoryHeader}>
        <div className={styles.categoryName}>{name}</div>
        {showDescription && description && (
          <div className={styles.categoryDescription}>{description}</div>
        )}
      </div>

      <div className={styles.sliderContainer}>
        <div
          ref={sliderRef}
          className={`${styles.sliderTrack} ${isPressed ? styles.pressed : ''}`}
          onPointerDown={handlePointerDown}
          role="slider"
          aria-label={`${name} 평가`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}점`}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          <div
            className={styles.sliderFill}
            style={{ width: `${percentage}%` }}
          />
          {showThumb && (
            <div
              ref={thumbRef}
              className={`${styles.sliderThumb} ${isPressed ? styles.pressed : ''}`}
              style={{ left: `${percentage}%` }}
            />
          )}
        </div>

        <div className={styles.sliderLabels}>
          {labels.map((labelValue) => (
            <button
              key={labelValue}
              type="button"
              className={`${styles.labelButton} ${value === labelValue ? styles.active : ''}`}
              onClick={() => handleLabelClick(labelValue)}
              disabled={disabled}
              style={{ left: `${getPercentage(labelValue)}%` }} // Absolute positioning
              aria-label={`${labelValue}점으로 설정`}
            >
              {labelValue}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CategorySlider;