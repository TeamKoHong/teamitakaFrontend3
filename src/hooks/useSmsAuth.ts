import { useState, useEffect, useCallback } from 'react';
import { getApiConfig } from '../services/auth';

type SmsAuthStep = 'INPUT_PHONE' | 'INPUT_CODE' | 'VERIFIED';

interface UseSmsAuthOptions {
    initialSessionId?: string;
    initialTimerStart?: number;
    initialPhone?: string;
}

interface UseSmsAuthReturn {
    phone: string;
    code: string;
    step: SmsAuthStep;
    timer: number;
    isLoading: boolean;
    error: string | null;
    sessionId: string | null;
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sendSms: () => Promise<string | undefined>;
    verifySms: () => Promise<void>;
    reset: () => void;
}

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

export const useSmsAuth = (options?: UseSmsAuthOptions): UseSmsAuthReturn => {
    // Calculate remaining timer from initialTimerStart
    const calculateInitialTimer = () => {
        if (options?.initialTimerStart) {
            const elapsed = Math.floor((Date.now() - options.initialTimerStart) / 1000);
            return Math.max(0, 180 - elapsed);
        }
        return 0;
    };

    const [phone, setPhone] = useState(options?.initialPhone || '');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<SmsAuthStep>(
        options?.initialSessionId ? 'INPUT_CODE' : 'INPUT_PHONE'
    );
    const [timer, setTimer] = useState(calculateInitialTimer);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(
        options?.initialSessionId || null
    );

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
        setError(null);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
        setCode(val);
        setError(null);
    };

    const sendSms = async (): Promise<string | undefined> => {
        const plainPhone = phone.replace(/-/g, '');
        const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

        if (!phoneRegex.test(plainPhone)) {
            setError('올바른 전화번호를 입력해주세요 (010-XXXX-XXXX).');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { API_BASE_URL, headers } = getApiConfig();

            const response = await fetch(`${API_BASE_URL}/api/auth/sms/send`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ phone: plainPhone }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 409) {
                    // 전화번호 중복 (백엔드에서 체크)
                    setError(errorData.message || '이미 가입된 전화번호입니다.');
                } else if (response.status === 429) {
                    setError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
                } else if (response.status === 400) {
                    setError(errorData.message || '입력값 오류입니다.');
                } else {
                    setError('서버 오류입니다. 인증번호 전송에 실패했습니다.');
                }
                return;
            }

            const data = await response.json();
            const newSessionId = data.data?.sessionId;

            setSessionId(newSessionId);
            setStep('INPUT_CODE');
            setTimer(180);

            return newSessionId;
        } catch (err) {
            setError('네트워크 오류입니다. 연결 상태를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifySms = async () => {
        if (code.length !== 4) {
            setError('4자리 인증번호를 입력해주세요.');
            return;
        }

        if (!sessionId) {
            setError('인증 세션이 만료되었습니다. 다시 시도해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { API_BASE_URL, headers } = getApiConfig();

            const response = await fetch(`${API_BASE_URL}/api/auth/sms/verify`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ sessionId, code }),
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 401) {
                    setError('인증번호가 일치하지 않습니다.');
                } else {
                    setError('인증에 실패했습니다. 다시 시도해주세요.');
                }
                return;
            }

            setStep('VERIFIED');
            setTimer(0);
        } catch (err) {
            setError('네트워크 오류입니다. 연결 상태를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const reset = useCallback(() => {
        setPhone('');
        setCode('');
        setStep('INPUT_PHONE');
        setTimer(0);
        setError(null);
        setSessionId(null);
    }, []);

    return {
        phone,
        code,
        step,
        timer,
        isLoading,
        error,
        sessionId,
        handlePhoneChange,
        handleCodeChange,
        sendSms,
        verifySms,
        reset,
    };
};
