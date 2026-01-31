import React, { useState, useRef, useCallback } from 'react';
import { useNativeApp } from '../../hooks/useNativeApp';
import './PullToRefresh.css';

const PullToRefresh = ({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
}) => {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const containerRef = useRef(null);
  const startY = useRef(0);
  const triggeredHaptic = useRef(false);

  const { hapticFeedback, hapticNotification } = useNativeApp();

  const handleTouchStart = useCallback((e) => {
    if (disabled || refreshing) return;
    if (containerRef.current?.scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    setPulling(true);
    triggeredHaptic.current = false;
  }, [disabled, refreshing]);

  const handleTouchMove = useCallback(async (e) => {
    if (!pulling || disabled || refreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      const distance = Math.min(diff * 0.5, threshold * 1.5);
      setPullDistance(distance);

      if (distance >= threshold && !triggeredHaptic.current) {
        triggeredHaptic.current = true;
        await hapticFeedback('medium');
      }
    }
  }, [pulling, disabled, refreshing, threshold, hapticFeedback]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;

    if (pullDistance >= threshold && onRefresh) {
      setRefreshing(true);
      setPullDistance(threshold * 0.6);

      try {
        await onRefresh();
        await hapticNotification('success');
      } catch (e) {
        await hapticNotification('error');
      } finally {
        setRefreshing(false);
      }
    }

    setPulling(false);
    setPullDistance(0);
  }, [pulling, pullDistance, threshold, onRefresh, hapticNotification]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className="pull-to-refresh"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`pull-indicator ${refreshing ? 'refreshing' : ''}`}
        style={{
          transform: `translateY(${pullDistance - 40}px)`,
          opacity: progress,
        }}
      >
        <div
          className="pull-spinner"
          style={{
            transform: refreshing ? 'rotate(360deg)' : `rotate(${progress * 180}deg)`,
          }}
        />
      </div>

      <div
        className="pull-content"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
