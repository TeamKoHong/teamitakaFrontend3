import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Header from "../../../components/Header";
import ProfileImage from "../../../components/ProfileImage";
import BasicInfo from "../../../components/BasicInfo";
import MajorInput from "../../../components/MajorInput";
import TeamExperience from "../../../components/TeamExperience";
import InterestKeywords from "../../../components/InterestKeywords";
import Withdrawal from "../../../components/Withdrawal";
import Button from "../../../components/DesignSystem/Button/Button";
import { getMe, updateProfile, uploadProfileImage } from "../../../services/user";
import styles from "./ProfileEditPage.module.scss";

export default function ProfileEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 사용자 데이터 상태
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이미지 파일 상태 (업로드용)
  const [imageFile, setImageFile] = useState(null);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    major: "",
    teamExperience: 0,
    keywords: [],
  });

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // location.state에서 user 데이터 확인 (빠른 경로)
        if (location.state?.user) {
          const user = location.state.user;
          setUserData(user);
          setFormData({
            major: user.major || "",
            teamExperience: user.teamExperience || 0,
            keywords: user.keywords || [],
          });
          setIsLoading(false);
          return;
        }

        // state 없으면 API 호출 (새로고침 대응)
        const res = await getMe();
        if (res?.success && res.user) {
          const user = res.user;
          setUserData(user);
          setFormData({
            major: user.major || "",
            teamExperience: user.teamExperience || 0,
            keywords: user.keywords || [],
          });
        } else {
          throw new Error("사용자 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        if (err?.code === "UNAUTHORIZED") {
          navigate("/login", { replace: true });
          return;
        }
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [location.state, navigate]);

  // 이전 데이터와 비교를 위한 참조
  const prevDataRef = React.useRef(null);

  // 자동 저장 로직
  const saveData = React.useCallback(async (currentFormData, currentImageFile) => {
    // 저장 중이거나 데이터 로드 전이면 중단
    if (!userData) return;

    try {
      let profileImageUrl = userData.avatar || userData.profileImage;

      // 이미지가 변경되었다면 업로드
      if (currentImageFile) {
        // 이미 업로드 중인 경우 등 방어 로직이 필요할 수 있으나, 
        // 간단히 파일이 있을 때만 업로드 수행
        const uploadRes = await uploadProfileImage(currentImageFile);
        if (uploadRes?.success) {
          profileImageUrl = uploadRes.data.photo_url;
          setImageFile(null); // 업로드 완료 후 초기화하여 재업로드 방지
        }
      }

      // 프로필 데이터 구성
      const updatedData = {
        ...userData,
        profileImage: profileImageUrl,
        major: currentFormData.major,
        teamExperience: currentFormData.teamExperience,
        keywords: currentFormData.keywords,
      };

      // API 호출
      // 사용자 경험을 위해 백그라운드에서 조용히 처리 (에러만 표시)
      const res = await updateProfile(updatedData);

      if (res?.success) {
        // 성공 시 로컬 상태 동기화 (재저장 방지용)
        setUserData(updatedData);
        prevDataRef.current = updatedData;
        setError(null);
      } else {

      }
    } catch (err) {

      // 토큰 만료 등 치명적 에러 외에는 사용자에게 방해되지 않도록 조용히 처리하거나
      // 우측 상단에 작게 표시할 수 있음. 여기선 치명적 에러만 처리.
      if (err?.code === "UNAUTHORIZED") {
        navigate("/login", { replace: true });
      }
    }
  }, [userData, navigate]);

  // Debounce Effect
  useEffect(() => {
    // 초기 로딩 시 실행 방지
    if (isLoading || !userData) return;

    // 변경 사항 확인 (Simple Deep Compare or Field Check)
    // 실제 변경이 있을 때만 타이머 설정
    const timeoutId = setTimeout(() => {
      saveData(formData, imageFile);
    }, 1000); // 1초 디바운스

    return () => clearTimeout(timeoutId);
  }, [formData, imageFile, userData, isLoading, saveData]);

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate("/profile");
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    try { sessionStorage.setItem('suppress-session-expired', '1'); } catch (e) { /* silent: sessionStorage 접근 불가 무시 */ }
    try { logout(); } catch (e) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    navigate('/login', { replace: true });
  };

  // 이미지 변경 핸들러
  const handleImageChange = (file) => {
    setImageFile(file);
    // 이미지는 파일 선택 즉시 저장을 시도하거나, useEffect에 의해 감지됨.
  };

  // 로그아웃 버튼 컴포넌트
  const logoutButton = (
    <button className="header-logout-btn" onClick={handleLogout}>
      로그아웃
    </button>
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="프로필 편집" onBack={handleBack} rightAction={logoutButton} />
        <div className={styles.loadingContainer}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 (사용자 데이터 로드 실패)
  if (!userData && error) {
    return (
      <div className={styles.container}>
        <Header title="프로필 편집" onBack={handleBack} rightAction={logoutButton} />
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button onClick={() => navigate("/profile")}>돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="프로필 편집" onBack={handleBack} rightAction={logoutButton} />

      <div className={styles.content}>
        <ProfileImage
          src={userData?.avatar || userData?.profileImage}
          onChange={handleImageChange}
        />

        <BasicInfo
          name={userData?.username || "사용자"}
          email={userData?.email || ""}
          university={userData?.university || "소속 미등록"}
          showVerified={!!userData?.university}
        />

        <MajorInput
          value={formData.major}
          onChange={(value) => setFormData(prev => ({ ...prev, major: value }))}
        />

        <TeamExperience
          value={formData.teamExperience}
          onChange={(value) => setFormData(prev => ({ ...prev, teamExperience: value }))}
        />

        <InterestKeywords
          value={formData.keywords}
          onChange={(value) => setFormData(prev => ({ ...prev, keywords: value }))}
        />

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>

      {/* 하단 영역: 저장 버튼 제거됨 */}
      <div className={styles.bottomSection}>
        {/* 탈퇴하기 */}
        <Withdrawal />
      </div>
    </div>
  );
}
