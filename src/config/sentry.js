import * as Sentry from '@sentry/react';

export const initSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;

  if (process.env.NODE_ENV !== 'production' || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: 'production',
    sampleRate: 1.0,
    tracesSampleRate: 0.2,
    ignoreErrors: [
      'ResizeObserver loop',
      'Non-Error promise rejection',
      'Load failed',
      'Failed to fetch',
    ],
  });
};

export { Sentry };
