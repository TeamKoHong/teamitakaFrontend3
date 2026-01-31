import React, { useState } from 'react';
import Button from '../../../components/DesignSystem/Button/Button';
import useTimer from '../../../hooks/useTimer';
import { verifyFindIdCode, requestFindIdSms } from '../../../services/findAccount';
import styles from '../FindIdPage.module.scss';

/**
 * 아이디 찾기 Step 2 - 인증번호 입력
 */
function FindIdStep2({ formData, onComplete, onBack }) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('인증번호가 전송되었습니다');

    // 타이머 (3분)
    const { formatted, isExpired, reset: resetTimer } = useTimer(180);

    // 폼 유효성
    const isCodeValid = code.length === 6;

    // 인증번호 변경
    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
    };

    // 인증번호 확인
    const handleVerify = async () => {
        if (!isCodeValid || isExpired || isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await verifyFindIdCode({
                name: formData.name,
                phone: formData.phone,
                code
            });

            if (result.success) {
                onComplete({
                    email: result.email,
                    joinDate: result.joinDate
                });
            }
        } catch (err) {
            setError(err.message || '인증번호가 일치하지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 인증번호 재전송
    const handleResend = async () => {
        setIsLoading(true);
        setError('');

        try {
            await requestFindIdSms(formData);
            resetTimer();
            setCode('');
            setSuccessMessage('인증번호가 재전송되었습니다');
        } catch (err) {
            setError(err.message || '재전송에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.description}>
                <p>문자로 전송된</p>
                <p>인증번호를 입력해주세요.</p>
            </div>

            {/* 인증번호 입력 */}
            <div className={styles.formSection}>
                {/* 성공/에러 메시지 */}
                {error ? (
                    <div className={styles.errorMessage}>{error}</div>
                ) : successMessage && (
                    <div className={styles.successMessage}>{successMessage}</div>
                )}

                <div className={styles.codeInputWrapper}>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="인증번호 6자리"
                        className={styles.codeInput}
                        maxLength={6}
                    />
                    <span className={`${styles.timer} ${isExpired ? styles.expired : ''}`}>
                        {formatted}
                    </span>
                </div>

                {/* 다시 보내기 */}
                <div className={styles.resendText}>
                    인증 문자를 받지 못하셨나요?{' '}
                    <button
                        type="button"
                        className={styles.resendButton}
                        onClick={handleResend}
                        disabled={isLoading}
                    >
                        다시 보내기
                    </button>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isCodeValid || isExpired || isLoading}
                    onClick={handleVerify}
                    isLoading={isLoading}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}

export default FindIdStep2;
