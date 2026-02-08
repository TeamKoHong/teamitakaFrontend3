import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMetadata } from '../constants/routes';
import { logScreenView } from '../services/analytics';

/**
 * 라우트 변경 시 screen_view 이벤트를 자동 전송하는 훅.
 * Router 내부에서 한 번만 마운트해야 합니다.
 */
const useAnalytics = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    const metadata = getRouteMetadata(pathname);
    const screenName = metadata?.title ?? pathname;
    logScreenView(screenName);
  }, [pathname]);
};

export default useAnalytics;
