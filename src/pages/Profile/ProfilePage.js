import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getMe } from "../../services/user";

import defaultProfileImage from "../../images/profileImage.png";
import gearIcon from "../../images/gear.png";
import linkIcon from "../../images/link.png";
import tagIcon from "../../images/tag.png";
import trophyIcon from "../../images/trophy.png";
import schoolIcon from "../../images/school.png";
import BottomNav from "../../components/Common/BottomNav/BottomNav";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // state로 전달받은 user가 있으면 우선 사용 (프로필 편집 후 돌아온 경우)
    if (location.state?.user) {
      setUser(location.state.user);
      return;
    }

    // 없으면 API 호출
    const load = async () => {
      try {
        const res = await getMe();
        if (res?.success && res.user) {
          setUser(res.user);
        } else {
          throw new Error("SERVER_ERROR");
        }
      } catch (e) {
        if (e?.code === "UNAUTHORIZED") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }
        // Error silently handled - user will see empty state
      }
    };
    load();
    // eslint-disable-next-line
  }, [location.state]);

  const onLogout = () => {
    // 수동 로그아웃에서는 세션 만료 모달을 띄우지 않도록 suppress 플래그 설정
    try { sessionStorage.setItem('suppress-session-expired', '1'); } catch (e) { /* silent: sessionStorage 접근 불가 무시 */ }
    // 컨텍스트 로그아웃으로 상태까지 정리
    try { logout(); } catch (e) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    navigate("/login", { replace: true });
  };

  return (
    <div style={{
      fontFamily: 'sans-serif',
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto',
      backgroundColor: '#F5F5F5',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h2 style={{ color: '#f76241', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>프로필</h2>
        <img
          src={gearIcon}
          alt="설정"
          style={{ width: 24, height: 24, objectFit: 'contain', display: 'block', cursor: 'pointer' }}
          onClick={() => navigate('/my/edit', { state: { user } })}
          title="프로필 편집"
        />
      </div>

      {/* 프로필 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: 12, borderRadius: 8 }}>
        <img src={user?.profileImage || defaultProfileImage} alt="프로필" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }} />
        <div>
          <div style={{
            backgroundColor: '#f76241', color: 'white', fontSize: 12, padding: '2px 8px', borderRadius: 12, display: 'inline-block', marginBottom: 6
          }}>
            {user?.username || '사용자'}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: 15 }}>{user?.username || '사용자 닉네임'}</div>
          <div style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <img src={schoolIcon} alt="school" style={{ width: 14, height: 14, objectFit: 'contain' }} />
            <span>{user?.university ? `${user.university}` : '소속 미등록'}</span>
          </div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{user?.email}</div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div style={{ marginTop: 12, fontSize: 13, color: '#333', background: '#fff', padding: 12, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <img src={tagIcon} alt="#" style={{ width: 16, height: 16, marginRight: 6 }} />
          <span>#보유 스킬 #보유 스킬</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <img src={linkIcon} alt="link" style={{ width: 16, height: 16, marginRight: 6 }} />
          <span>any_link.com</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={trophyIcon} alt="수상" style={{ width: 16, height: 16, marginRight: 6 }} />
          <span>수상이력 1</span>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <button onClick={onLogout} style={{ padding: '10px 16px' }}>로그아웃</button>
      </div>
      <div style={{ height: 56 }} />
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
