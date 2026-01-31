import React, { useState } from 'react';
import Button from '../../../components/DesignSystem/Button/Button';
import {
    resetPassword,
    validatePassword,
    validatePasswordConfirm
} from '../../../services/findAccount';
import styles from '../FindPasswordPage.module.scss';

/**
 * 비밀번호 찾기 Step 3 - 새 비밀번호 입력
 */
function FindPwStep3({ email, onComplete }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 실시간 유효성 검사
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordConfirm(password, confirmPassword);

    // 폼 유효성
    const isFormValid = passwordValidation.isValid && confirmValidation.isValid;

    // 비밀번호 재설정 완료
    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            await resetPassword({ email, newPassword: password });
            onComplete();
        } catch (err) {
            setError(err.message || '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.description}>
                <p>새롭게 사용할</p>
                <p>비밀번호를 재설정 해주세요.</p>
            </div>

            {/* 새 비밀번호 입력 */}
            <div className={styles.formSection}>
                <label className={styles.label}>새로운 비밀번호 입력</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 ( 8자 이상 , 영문 , 숫자 , 특수문자 )"
                    className={styles.input}
                />
                {passwordValidation.message && (
                    <div className={styles.errorMessage}>
                        {passwordValidation.message}
                    </div>
                )}
            </div>

            {/* 비밀번호 확인 */}
            <div className={styles.formSection}>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className={styles.input}
                />
                {confirmValidation.message && (
                    <div className={styles.errorMessage}>
                        {confirmValidation.message}
                    </div>
                )}
            </div>

            {/* 서버 에러 메시지 */}
            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isFormValid || isLoading}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                >
                    비밀번호 재설정 완료
                </Button>
            </div>
        </div>
    );
}

export default FindPwStep3;
