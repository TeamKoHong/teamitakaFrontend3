import React, { useState } from 'react';
import Button from '../../../components/DesignSystem/Button/Button';
import { requestPasswordReset } from '../../../services/findAccount';
import styles from '../FindPasswordPage.module.scss';

/**
 * 비밀번호 찾기 Step 1 - 이메일 입력
 */
function FindPwStep1({ email: initialEmail, onComplete }) {
    const [email, setEmail] = useState(initialEmail || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    // 인증번호 전송
    const handleSubmit = async () => {
        if (!isEmailValid || isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            await requestPasswordReset(email);
            onComplete(email);
        } catch (err) {
            setError(err.message || '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.description}>
                <p>찾으시려는 계정의</p>
                <p>이메일 주소를 입력해주세요.</p>
            </div>

            {/* 이메일 입력 */}
            <div className={styles.formSection}>
                <label className={styles.label}>이메일 입력</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    className={styles.input}
                />
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isEmailValid || isLoading}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                >
                    재설정 메일 보내기
                </Button>
            </div>
        </div>
    );
}

export default FindPwStep1;
