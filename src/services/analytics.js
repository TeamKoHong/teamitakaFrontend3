import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

const isDev = process.env.NODE_ENV === 'development';

/**
 * screen_view 이벤트 전송
 * @param {string} screenName - 화면 이름 (예: '메인', '프로젝트 관리')
 */
export const logScreenView = async (screenName) => {
  try {
    await FirebaseAnalytics.logEvent({
      name: 'screen_view',
      params: {
        screen_name: screenName,
        screen_class: screenName,
      },
    });
    if (isDev) {
      console.debug('[Analytics] screen_view:', screenName);
    }
  } catch (error) {
    if (isDev) {
      console.debug('[Analytics] screen_view failed:', error);
    }
  }
};

/**
 * 커스텀 이벤트 전송
 * @param {string} name - 이벤트 이름
 * @param {object} [params] - 이벤트 파라미터
 */
export const logEvent = async (name, params = {}) => {
  try {
    await FirebaseAnalytics.logEvent({ name, params });
    if (isDev) {
      console.debug('[Analytics] event:', name, params);
    }
  } catch (error) {
    if (isDev) {
      console.debug('[Analytics] event failed:', name, error);
    }
  }
};

/**
 * 사용자 ID 설정 (로그인/로그아웃 시)
 * @param {string|null} userId - 사용자 ID (null이면 해제)
 */
export const setUserId = async (userId) => {
  try {
    await FirebaseAnalytics.setUserId({ userId });
    if (isDev) {
      console.debug('[Analytics] setUserId:', userId);
    }
  } catch (error) {
    if (isDev) {
      console.debug('[Analytics] setUserId failed:', error);
    }
  }
};
