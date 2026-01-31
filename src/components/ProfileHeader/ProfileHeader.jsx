import './ProfileHeader.css';
import settingIcon from '../../assets/setting.png';
import defaultProfile from '../../assets/profile_default.png';
import verifiedBadge from '../../assets/university_verified.png';
import { useNativeApp } from '../../hooks/useNativeApp';

// 부모 컴포넌트에서 userData와 isVerified를 넘겨준다고 가정합니다.
export default function ProfileHeader({ userData, isVerified, onSettingClick }) {
  const { hapticFeedback } = useNativeApp();

  // 데이터가 없을 때를 대비한 기본값 설정 (ProfileMainPage와 동일한 로직)
  const university = userData?.university || '대학교 미인증';
  const department = userData?.major || userData?.department || '';
  const enrollmentStatus = userData?.enrollmentStatus || '재학 중';

  // 프로필이 비어있는지 확인 (이름, 학교 등이 없는 경우)
  const isProfileEmpty = !userData?.university && !userData?.major;

  const handleSettingClick = () => {
    hapticFeedback('light');
    onSettingClick?.();
  };

  return (
    <>
      {/* 상단 제목 + 설정 아이콘 영역 */}
      <div className="profile-header-top">
        <span className="title-text">티미타카</span>
        <img
          src={settingIcon}
          alt="설정 아이콘"
          className="setting-icon"
          onClick={handleSettingClick}
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* 프로필 카드 */}
      <div className="profile-header">
        <div className="profile-left">
          <div className="avatar-wrapper">
            {/* 실제 이미지가 있다면 userData.profileImage를 사용 */}
            <img
              src={userData?.profileImage || defaultProfile}
              alt="프로필 이미지"
              className="avatar-image"
            />
            {/* 인증 뱃지: 인증되었을 때만 노출 */}
            {isVerified && <img src={verifiedBadge} alt="인증 뱃지" className="verified-badge" />}
          </div>

          <div className="profile-text-group">
            <div className="profile-title">
              {isProfileEmpty ? (
                '프로필을 입력하세요.'
              ) : (
                <>
                  <span className="name-bold">{userData?.username}</span>
                  <span className="name-regular"> 티미님</span>
                </>
              )}
            </div>

            <p className="profile-sub">
              🎓
              {isProfileEmpty
                ? ' 대학교명 재학 중'
                : ` ${university} ${department} ${enrollmentStatus}`}
            </p>

            <p className="profile-project-bold">
              {isProfileEmpty
                ? '현재 진행중인 프로젝트가 없어요.'
                : `현재 진행중인 프로젝트 총 ${userData?.currentProjects || 0}건`}
            </p>
            <p className="profile-project-light">
              {isProfileEmpty
                ? '팀플 경험이 없어요.'
                : `전체 팀플 경험 ${userData?.teamExperience || 0}회`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
