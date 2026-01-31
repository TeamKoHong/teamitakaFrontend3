import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useNativeApp } from '../hooks/useNativeApp';

const PushNotificationContext = createContext(null);

export const PushNotificationProvider = ({ children }) => {
  const { hapticNotification } = useNativeApp();

  // 알림 수신 핸들러
  const handleNotificationReceived = useCallback((notification) => {
    console.log('Notification received in foreground:', notification);
    // 포그라운드에서 알림 수신 시 햅틱 피드백
    hapticNotification('success');

    // 여기에 인앱 알림 UI 표시 로직 추가 가능
    // 예: toast.show(notification.title, notification.body);
  }, [hapticNotification]);

  // 알림 탭 핸들러
  const handleNotificationTapped = useCallback((notification, actionId) => {
    console.log('Notification tapped:', notification, actionId);

    // 알림 데이터에 따라 적절한 화면으로 네비게이션
    const data = notification.data;
    if (data?.type === 'project') {
      // navigate(`/project/${data.projectId}`);
    } else if (data?.type === 'message') {
      // navigate('/messages');
    }
  }, []);

  // 토큰 수신 핸들러
  const handleTokenReceived = useCallback((token) => {
    console.log('FCM Token received:', token);

    // 서버에 토큰 등록
    // await api.registerPushToken(token);
  }, []);

  const push = usePushNotifications({
    onNotificationReceived: handleNotificationReceived,
    onNotificationTapped: handleNotificationTapped,
    onTokenReceived: handleTokenReceived,
  });

  // 앱 시작 시 권한 요청 (선택적)
  useEffect(() => {
    // 자동 권한 요청을 원하면 아래 주석 해제
    // push.requestPermission();
  }, []);

  return (
    <PushNotificationContext.Provider value={push}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePush = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePush must be used within a PushNotificationProvider');
  }
  return context;
};

export default PushNotificationContext;
