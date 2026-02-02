import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./NotificationBox.scss";
import { fetchProjectNotifications } from "../../services/notification";
import defaultAvatar from "../../assets/icons/default_avatar.png"; // Fallback avatar if needed

export default function NotificationBox({ projectName = "프로젝트명" }) {
  const { projectId } = useParams();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      if (!projectId) return;

      setLoading(true);
      try {
        const data = await fetchProjectNotifications(projectId);
        setAlerts(data);
      } catch (error) {

        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [projectId]);

  // Helper to format time (simple version, can be replaced with dayjs/moment)
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "방금 전";
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  return (
    <div className="notification-box-container">
      <div className="notification-header">
        <h2>[{projectName}] 알림</h2>
        {/* <button className="add-btn">+</button> */}
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="empty-message">로딩 중...</div>
        ) : alerts.length > 0 ? (
          alerts.map((alert) => (
            <div className="notification-item" key={alert.id}>
              <img
                className="avatar"
                src={alert.sender?.avatar || defaultAvatar}
                alt="avatar"
                onError={(e) => e.target.src = defaultAvatar}
              />
              <div className="notification-content">
                <span className="time">{formatTime(alert.createdAt)}</span>
                <p className="message">{alert.message || alert.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-message">새로운 알림이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
