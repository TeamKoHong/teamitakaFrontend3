import { useState, useEffect, useCallback } from 'react';

/**
 * 인증번호 타이머 Hook
 * @param {number} initialSeconds - 초기 시간 (기본 180초 = 3분)
 * @returns {{remaining: number, isExpired: boolean, reset: Function, formatted: string}}
 */
const useTimer = (initialSeconds = 180) => {
    const [remaining, setRemaining] = useState(initialSeconds);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (remaining <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [remaining]);

    const reset = useCallback(() => {
        setRemaining(initialSeconds);
        setIsExpired(false);
    }, [initialSeconds]);

    // MM:SS 형식으로 포맷팅
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return { remaining, isExpired, reset, formatted };
};

export default useTimer;
