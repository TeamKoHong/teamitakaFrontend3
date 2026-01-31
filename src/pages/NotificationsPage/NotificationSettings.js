import { useState } from 'react';
import './NotificationsPage.scss';

export default function NotificationSettings() {
  const [appPush, setAppPush] = useState(true);
  const [adPush, setAdPush] = useState(false);

  return (
    <div className="page settings-page">
      <div className="topbar">
        {/* ✅ chevron span 사용 */}
        <button className="back" onClick={() => window.history.back()} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>

        <div className="title">알림</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="settings-list">
        <div className="setting-item">
          <span className="label">앱 알림 수신</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={appPush}
              onChange={(e) => setAppPush(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="setting-item">
          <span className="label">광고 수신</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={adPush}
              onChange={(e) => setAdPush(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
  );
}
