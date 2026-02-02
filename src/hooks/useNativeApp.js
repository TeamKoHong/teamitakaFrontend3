import { useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

const isNative = Capacitor.isNativePlatform();

export const useNativeApp = () => {
  useEffect(() => {
    if (!isNative) return;

    const initNative = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      } catch (e) {

      }
    };

    initNative();

    // Keyboard listeners
    const showListener = Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
      document.body.classList.add('keyboard-visible');
    });

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      document.body.style.setProperty('--keyboard-height', '0px');
      document.body.classList.remove('keyboard-visible');
    });

    // App state listener
    const stateListener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        document.body.classList.remove('app-inactive');
      } else {
        document.body.classList.add('app-inactive');
      }
    });

    // Back button handler (Android)
    const backListener = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    return () => {
      showListener.then(l => l.remove());
      hideListener.then(l => l.remove());
      stateListener.then(l => l.remove());
      backListener.then(l => l.remove());
    };
  }, []);

  const hapticFeedback = useCallback(async (style = 'medium') => {
    if (!isNative) return;

    const styles = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };

    try {
      await Haptics.impact({ style: styles[style] || ImpactStyle.Medium });
    } catch (e) {

    }
  }, []);

  const hapticSelection = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch (e) {

    }
  }, []);

  const hapticNotification = useCallback(async (type = 'success') => {
    if (!isNative) return;

    const types = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };

    try {
      await Haptics.notification({ type: types[type] || NotificationType.Success });
    } catch (e) {

    }
  }, []);

  const hideKeyboard = useCallback(async () => {
    if (!isNative) return;
    try {
      await Keyboard.hide();
    } catch (e) {

    }
  }, []);

  return {
    isNative,
    hapticFeedback,
    hapticSelection,
    hapticNotification,
    hideKeyboard,
  };
};

export default useNativeApp;
