import { useEffect, useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

const isNative = Capacitor.isNativePlatform();

export const usePushNotifications = (options = {}) => {
  const { onNotificationReceived, onNotificationTapped, onTokenReceived } = options;
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [token, setToken] = useState(null);

  // 권한 요청
  const requestPermission = useCallback(async () => {
    if (!isNative) {
      console.log('Push notifications only work on native platforms');
      return false;
    }

    try {
      const result = await PushNotifications.requestPermissions();
      setPermissionStatus(result.receive);

      if (result.receive === 'granted') {
        await PushNotifications.register();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Push permission error:', e);
      return false;
    }
  }, []);

  // 권한 상태 확인
  const checkPermission = useCallback(async () => {
    if (!isNative) return 'denied';

    try {
      const result = await PushNotifications.checkPermissions();
      setPermissionStatus(result.receive);
      return result.receive;
    } catch (e) {
      console.error('Check permission error:', e);
      return 'denied';
    }
  }, []);

  // 리스너 설정
  useEffect(() => {
    if (!isNative) return;

    // 토큰 등록 성공
    const registrationListener = PushNotifications.addListener(
      'registration',
      (token) => {
        console.log('Push registration success:', token.value);
        setToken(token.value);
        onTokenReceived?.(token.value);
      }
    );

    // 토큰 등록 실패
    const registrationErrorListener = PushNotifications.addListener(
      'registrationError',
      (error) => {
        console.error('Push registration error:', error);
      }
    );

    // 포그라운드에서 알림 수신
    const pushReceivedListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push received:', notification);
        onNotificationReceived?.(notification);
      }
    );

    // 알림 탭 (앱이 백그라운드/종료 상태에서 알림 클릭)
    const pushActionListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action) => {
        console.log('Push action performed:', action);
        onNotificationTapped?.(action.notification, action.actionId);
      }
    );

    // 초기 권한 확인
    checkPermission();

    return () => {
      registrationListener.then(l => l.remove());
      registrationErrorListener.then(l => l.remove());
      pushReceivedListener.then(l => l.remove());
      pushActionListener.then(l => l.remove());
    };
  }, [onNotificationReceived, onNotificationTapped, onTokenReceived, checkPermission]);

  // 모든 알림 배지 제거
  const clearBadge = useCallback(async () => {
    if (!isNative) return;

    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch (e) {
      console.error('Clear badge error:', e);
    }
  }, []);

  return {
    isNative,
    permissionStatus,
    token,
    requestPermission,
    checkPermission,
    clearBadge,
  };
};

export default usePushNotifications;
