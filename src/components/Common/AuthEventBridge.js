import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toastBus } from './GlobalToastSystem';

let redirecting = false;

export default function AuthEventBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  React.useEffect(() => {
    const onExpired = () => {
      if (redirecting) return;
      redirecting = true;
      try { logout(); } catch (e) { }
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      setTimeout(() => { redirecting = false; }, 1000);
    };
    toastBus.addEventListener('login-expired', onExpired);
    return () => toastBus.removeEventListener('login-expired', onExpired);
  }, [logout, navigate, location.pathname]);

  return null;
}


