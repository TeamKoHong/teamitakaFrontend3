import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/DesignSystem/Button/Button';
import styles from './WelcomePage.module.scss';

/**
 * 가입 완료 환영 페이지
 */
function WelcomePage() {
    const navigate = useNavigate();
    const { registration, user } = useAuth();

    // 본인인증 미완료 시 이전 단계로 리다이렉트
    useEffect(() => {
        if (!registration?.phoneVerified) {
            navigate('/phone-verify');
        }
    }, [registration, navigate]);

    // 시작하기 버튼 클릭
    const handleStart = () => {
        navigate('/main');
    };

    // 사용자 이름 (본인인증에서 받은 이름 또는 기본값)
    const userName = registration?.verifiedName || user?.name || '사용자';

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

                {/* 환영 메시지 */}
                <h1 className={styles.title}>
                    가입이 완료되었습니다!
                </h1>

                <p className={styles.subtitle}>
                    <span className={styles.userName}>{userName}</span>님,<br />
                    팀이타카에 오신 것을 환영합니다.
                </p>

                {/* 서비스 소개 */}
                <div className={styles.featureList}>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>🎯</span>
                        <span>팀 프로젝트 관리를 한 곳에서</span>
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>👥</span>
                        <span>팀원들과 원활한 협업</span>
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>⭐</span>
                        <span>공정한 팀원 평가 시스템</span>
                    </div>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button fullWidth onClick={handleStart}>
                    시작하기
                </Button>
            </div>
        </div>
    );
}

export default WelcomePage;
