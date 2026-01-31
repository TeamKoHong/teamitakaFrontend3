// 알람이 없을 때 뜨는 페이지
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.scss';
import bellIcon from '../../assets/notification_off.png';

export default function NotificationsEmpty() {
  const nav = useNavigate();

  return (
    <div className="page notifications-page">
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <div className="title">알림</div>
        <button
          className="settings-text"
          onClick={() => nav('/notifications/settings')}
        >
          설정
        </button>
      </div>

      <div className="empty-wrap">
        <img src={bellIcon} alt="알림 아이콘" className="bell-icon" />
        <div className="empty-title">새로운 알림이 없습니다.</div>
        <div>새로운 소식이 있으면 알려드릴게요.</div>
      </div>
    </div>
  );
}
