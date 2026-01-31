import React from 'react';
import SessionExpiredModal from './SessionExpiredModal';
import './GlobalToastSystem.scss';

/**
 * Global Toast Notification System
 * - Replaces ToastHost to resolve HMR ghost issues
 */
export const toastBus = new EventTarget();

export function notifyLoginExpired(message = '로그인이 만료되었습니다. 다시 로그인해주세요.') {
  // 수동 로그아웃 등에서 suppress 플래그가 있으면 표시하지 않음
  const suppressed = sessionStorage.getItem('suppress-session-expired') === '1';
  if (suppressed) {
    sessionStorage.removeItem('suppress-session-expired');
    return;
  }
  toastBus.dispatchEvent(new CustomEvent('login-expired', { detail: { message } }));
}

export default function GlobalToastSystem() {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  // Toast notification state
  const [toast, setToast] = React.useState(null);
  const timeoutRef = React.useRef(null);

  // Session expired modal handler
  React.useEffect(() => {
    const handler = (e) => {
      setMsg(e.detail?.message || '로그인이 만료되었습니다. 다시 로그인해주세요.');
      setOpen(true);
    };
    toastBus.addEventListener('login-expired', handler);
    return () => toastBus.removeEventListener('login-expired', handler);
  }, []);

  // Generic toast handler
  React.useEffect(() => {
    // Nuclear Cleanup: Remove any existing ghost toasts from DOM
    const ghosts = document.querySelectorAll('.toast-notification, .toast-notification-v2');
    if (ghosts.length > 0) {
      console.warn('👻 Found ghost toasts in DOM. Removing them...', ghosts);
      ghosts.forEach(el => el.remove());
    }

    // Singleton Guard: Prevent multiple instances
    if (window.__GLOBAL_TOAST_SYSTEM_ACTIVE__) {
      console.warn('⚠️ Duplicate GlobalToastSystem detected! This instance will be ignored.');
      return; // Do not attach listeners
    }
    window.__GLOBAL_TOAST_SYSTEM_ACTIVE__ = true;
    if (process.env.NODE_ENV === 'development') {
      console.log('GlobalToastSystem mounted (Singleton Active)');
    }

    let lastToast = { message: '', timestamp: 0 };

    const handler = (e) => {
      const { message, type = 'info', duration = 3000 } = e.detail || {};
      console.log('GlobalToastSystem received event:', { message, type }); // Debug log

      if (!message) return; // Ignore empty messages

      // Debounce: ignore if same message within 500ms
      const now = Date.now();
      if (lastToast.message === message && now - lastToast.timestamp < 500) {
        console.log('GlobalToastSystem debounced duplicate:', message); // Debug log
        return;
      }
      lastToast = { message, timestamp: now };

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show toast with stable timestamp for React key
      const newToast = { message, type, timestamp: Date.now() };
      console.log('🔔 [DEBUG] Setting toast:', newToast);
      setToast(newToast);

      // Auto-dismiss
      timeoutRef.current = setTimeout(() => {
        setToast(null);
      }, duration);
    };

    window.addEventListener('show-global-toast', handler);
    return () => {
      window.removeEventListener('show-global-toast', handler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Reset singleton flag only if this was the active instance
      // (This is tricky with HMR, but safer to reset)
      window.__GLOBAL_TOAST_SYSTEM_ACTIVE__ = false;
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <SessionExpiredModal isOpen={open} message={msg} onClose={close} />

      {toast && toast.message && (
        <div
          key="global-toast"
          className={`toast-notification-v2 toast-${toast.type}`}
          ref={(el) => {
            if (el) {
              const allToasts = document.querySelectorAll('.toast-notification-v2');
              console.log(`🎯 [DEBUG] Toast rendered. Total in DOM: ${allToasts.length}`, { toast, allToasts });
            }
          }}
        >
          <div className="toast-icon">
            {toast.type === 'warning' && (
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10.5" cy="10.5" r="10.5" fill="#C01616" />
                <path d="M10.5 5.25V11.55" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M10.5 14.7V14.7105" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10.5" cy="10.5" r="10.5" fill="#FF3B30" />
                <path d="M6.3 6.3L14.7 14.7M6.3 14.7L14.7 6.3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {toast.type === 'success' && (
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10.5" cy="10.5" r="10.5" fill="#34C759" />
                <path d="M6.3 10.5L9.45 13.65L14.7 8.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {toast.type === 'info' && 'ℹ️'}
          </div>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}
    </>
  );
}


