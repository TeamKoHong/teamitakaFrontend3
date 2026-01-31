import React from 'react';
import Button from '../../../components/DesignSystem/Button/Button';
import styles from '../FindIdPage.module.scss';

/**
 * 아이디 찾기 결과 페이지
 */
function FindIdResult({ email, joinDate, onGoToLogin }) {
    return (
        <div className={styles.resultContainer}>
            <div className={styles.resultMessage}>
                입력하신 정보와 일치하는<br />
                이메일 주소입니다.
            </div>

            <div className={styles.resultCard}>
                <div className={styles.resultCardInner}>
                    <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>이메일</span>
                        <span className={styles.resultValue}>{email}</span>
                    </div>
                    <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>가입일</span>
                        <span className={styles.resultValue}>{joinDate}</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    onClick={onGoToLogin}
                >
                    로그인 하기
                </Button>
            </div>
        </div>
    );
}

export default FindIdResult;
