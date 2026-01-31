import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DefaultHeader from '../../components/Common/DefaultHeader';
import StepIndicator from '../../components/DesignSystem/Feedback/StepIndicator';
import Button from '../../components/DesignSystem/Button/Button';
import { useSmsAuth } from '../../hooks/useSmsAuth';
import styles from './VerificationCodePage.module.scss';

/**
 * 휴대폰 본인인증 - 인증번호 입력 페이지 (Step 2)
 */
function VerificationCodePage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract state from navigation
    const { formData, sessionId, timerStart, isResend } = location.state || {};

    // Local state for immediate UI feedback on resend
    const [hasResent, setHasResent] = useState(isResend || false);

    // Initialize useSmsAuth with sessionId and timerStart
    const {
        code,
        step,
        timer,
        isLoading,
        error,
        handleCodeChange,
        verifySms,
        sendSms,
    } = useSmsAuth({
        initialSessionId: sessionId,
        initialTimerStart: timerStart,
        initialPhone: formData?.phone,
    });

    // Redirect if no sessionId (direct access without SMS)
    useEffect(() => {
        if (!sessionId) {
            navigate('/phone-verify');
        }
    }, [sessionId, navigate]);

    // Navigate on success
    useEffect(() => {
        if (step === 'VERIFIED') {
            navigate('/register', {
                state: { step: 2, formData },
            });
        }
    }, [step, navigate, formData]);

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleVerify = async () => {
        await verifySms();
    };

    const handleResend = async () => {
        if (timer > 150) return; // Cooldown (30s elapsed minimum)
        setHasResent(true); // Immediate UI feedback
        const newSessionId = await sendSms();
        if (newSessionId) {
            navigate('/phone-verify/code', {
                state: {
                    formData,
                    sessionId: newSessionId,
                    timerStart: Date.now(),
                    isResend: true,
                },
                replace: true,
            });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Don't render if no sessionId
    if (!sessionId) return null;

    return (
        <div className={styles.container}>
            {/* Header */}
            <DefaultHeader title="본인 인증" onBack={handleBack} />

            {/* Main Content */}
            <div className={styles.content}>
                <StepIndicator currentStep={2} totalSteps={5} />

                <div className={styles.description}>
                    <p>문자로 전송된</p>
                    <p>인증번호를 입력해주세요.</p>
                </div>

                {/* Code Input Section */}
                <div className={styles.formSection}>
                    <div className={styles.codeInputWrapper}>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="인증번호 4자리"
                            className={styles.codeInput}
                            maxLength={4}
                            autoFocus
                        />
                        <span className={styles.timerBadge}>
                            {formatTimer(timer)}
                        </span>
                    </div>

                    <div className={styles.statusMessage}>
                        {hasResent ? '인증번호가 재전송되었습니다.' : '인증번호가 전송되었습니다.'}
                        <button
                            type="button"
                            className={styles.resendLink}
                            onClick={handleResend}
                            disabled={timer > 150 || isLoading}
                        >
                            다시 보내기
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}
                </div>
            </div>

            {/* Bottom Button */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={code.length !== 4 || timer === 0 || isLoading}
                    onClick={handleVerify}
                    isLoading={isLoading}
                >
                    확인
                </Button>
            </div>
        </div>
    );
}

export default VerificationCodePage;
