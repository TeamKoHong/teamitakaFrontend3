import { useState, useEffect, useCallback } from 'react';

/**
 * 재전송 타이머 관리 Hook
 * @param {number} initialCooldown - 초기 쿨다운 시간 (초)
 * @param {number} maxAttempts - 최대 재전송 횟수
 */
const useResendTimer = (initialCooldown = 60, maxAttempts = 5) => {
    const [cooldown, setCooldown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [maxResendCount] = useState(maxAttempts);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    const startCooldown = useCallback((seconds = initialCooldown) => {
        setCooldown(seconds);
    }, [initialCooldown]);

    const incrementResendCount = useCallback(() => {
        setResendCount(prev => prev + 1);
    }, []);

    const canResend = cooldown === 0 && resendCount < maxResendCount;

    return {
        cooldown,
        resendCount,
        maxResendCount,
        canResend,
        startCooldown,
        incrementResendCount
    };
};

export default useResendTimer;
