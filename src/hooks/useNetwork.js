import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    if (isNative) {
      let listener;

      const init = async () => {
        try {
          const { Network } = await import('@capacitor/network');
          const status = await Network.getStatus();
          setIsOnline(status.connected);
          setConnectionType(status.connectionType);

          listener = await Network.addListener('networkStatusChange', (status) => {
            setIsOnline(status.connected);
            setConnectionType(status.connectionType);
          });
        } catch (e) {
          // Fallback to web API if native plugin fails
          setIsOnline(navigator.onLine);
        }
      };

      init();

      return () => {
        if (listener) listener.remove();
      };
    }

    // Web fallback
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};

export default useNetwork;
