// 분기처리하는 페이지
import { useState, useEffect, useCallback } from 'react';
import NotificationsEmpty from './NotificationsEmpty';
import NotificationsList from './NotificationsList';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification
} from '../../services/dashboard';

export default function NotificationsPage() {
  const [items, setItems] = useState(null); // null = 로딩중
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications({ unreadOnly: false, limit: 50 });
      // API 응답: { success: true, data: [...], total: n, unreadCount: n }
      const notifications = Array.isArray(response.data) ? response.data : [];
      setItems(notifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      // 로컬 상태 업데이트
      setItems(prev =>
        prev.map(item =>
          item.id === notificationId ? { ...item, is_read: true } : item
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      // 로컬 상태 업데이트
      setItems(prev => prev.map(item => ({ ...item, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      // 로컬 상태에서 제거
      setItems(prev => prev.filter(item => item.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (loading) return null; // 로딩중일 때

  if (error) {
    return (
      <div className="page notifications-page">
        <div className="error-message">알림을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return items.length === 0
    ? <NotificationsEmpty />
    : <NotificationsList
        items={items}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
      />;
}
