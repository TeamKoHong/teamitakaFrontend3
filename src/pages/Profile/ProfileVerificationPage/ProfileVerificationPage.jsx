import React, { useState, useEffect } from 'react';
import { getMe } from '../../../services/user';
import DefaultHeader from '../../../components/Common/DefaultHeader';
import styles from './ProfileVerificationPage.module.scss';
// Using the university_verified.png from assets as the badge icon
import verificationBadge from '../../../assets/university_verified.png';
import profileDefault from '../../../assets/profile_default.png';

export default function ProfileVerificationPage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback date if not present in data
  const [authDate, setAuthDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getMe();
        if (res?.success) {
          setUserData(res.user);
          // Demo date formatting
          const date = new Date();
          const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
          setAuthDate(formattedDate);
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>로딩 중...</div>;
  }

  // Determine if verified.
  const isVerified = !!userData?.university;

  if (!isVerified) {
    return (
      <div className={styles.container}>
        <DefaultHeader title="대학 인증" className={styles.customHeader} />
        <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
          인증된 정보가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <DefaultHeader title="대학 인증 내역" className={styles.customHeader} />

      {/* Main Content */}
      <div className={styles.content}>
        {/* Certification Badge & Status */}
        <div className={styles.badgeSection}>
          <div className={styles.badgeIconWrapper}>
            <img src={verificationBadge} className={styles.badgeIcon} alt="인증 뱃지" />
          </div>
          <div className={styles.badgeText}>
            <div className={styles.badgeTitle}>대학교 인증 완료</div>
            <div className={styles.badgeDate}>{authDate} 부로 인증되었습니다.</div>
          </div>
        </div>

        {/* Bottom Sheet Card */}
        <div className={styles.bottomSheet}>
          <div className={styles.sheetTitle}>인증 정보</div>

          <div className={styles.profileSection}>
            <img
              // 1. profileImage가 없으면 avatar를 확인하고, 그것도 없으면 profileDefault 사용
              src={userData?.profileImage || userData?.avatar || profileDefault}
              alt="프로필 이미지"
              className={styles.profileImage}
              // 2. 만약 이미지 URL은 있지만 로딩에 실패(404 등)하면 default 이미지로 교체
              onError={(e) => { e.target.src = profileDefault; }}
            />
            <div className={styles.profileTexts}>
              <div className={styles.univText}>{userData?.university}</div>
              <div className={styles.nameText}>{userData?.username || '사용자'}</div>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.label}>인증 날짜</span>
              <span className={styles.value}>{authDate}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>인증 상태</span>
              <span className={styles.value}>인증 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}