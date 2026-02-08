import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const DEEP_LINK_ROUTES = [
  { pattern: /\/recruitment\/(\d+)/, path: (m) => `/recruitment/${m[1]}` },
  { pattern: /\/project\/(\d+)/, path: (m) => `/project/${m[1]}/detail` },
  { pattern: /\/profile/, path: () => '/profile' },
  { pattern: /\/team-matching/, path: () => '/team-matching' },
];

const resolveDeepLink = (url) => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname || parsed.host + (parsed.pathname || '');

    for (const route of DEEP_LINK_ROUTES) {
      const match = pathname.match(route.pattern);
      if (match) return route.path(match);
    }
  } catch {
    // URL parsing failed
  }
  return null;
};

export const useDeepLink = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = App.addListener('appUrlOpen', ({ url }) => {
      const path = resolveDeepLink(url);
      if (path) {
        navigate(path);
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [navigate]);
};

export default useDeepLink;
