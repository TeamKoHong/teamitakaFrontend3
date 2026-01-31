import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/DesignSystem/Button/Button';
import styles from './RegisterCompletePage.module.scss';

/**
 * 회원가입 완료 페이지
 */
function RegisterCompletePage() {
    const navigate = useNavigate();

    // 로그인 페이지로 이동
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* 체크 아이콘 */}
                <div className={styles.iconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="40" fill="#F76241" />
                        <path d="M24 40L35 51L56 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* 완료 메시지 */}
                <h1 className={styles.title}>
                    회원가입 완료!
                </h1>

                <p className={styles.subtitle}>
                    팀이타카에 오신 것을 환영합니다.<br />
                    로그인하여 서비스를 이용해보세요.
                </p>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button fullWidth onClick={handleLogin}>
                    로그인 하기
                </Button>
            </div>
        </div>
    );
}

export default RegisterCompletePage;
