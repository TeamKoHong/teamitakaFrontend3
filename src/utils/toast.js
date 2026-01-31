// src/utils/toast.js
// Toast notification utility using existing event-based system

/**
 * Toast types
 */
export const ToastType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (info, warning, error, success)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export const showToast = (message, type = ToastType.INFO, duration = 3000) => {
  const event = new CustomEvent('show-global-toast', {
    detail: {
      message,
      type,
      duration,
    },
  });
  window.dispatchEvent(event);
};

/**
 * Show info toast
 * @param {string} message
 */
export const showInfoToast = (message) => {
  showToast(message, ToastType.INFO);
};

/**
 * Show warning toast
 * @param {string} message
 */
export const showWarningToast = (message) => {
  showToast(message, ToastType.WARNING);
};

/**
 * Show error toast
 * @param {string} message
 */
export const showErrorToast = (message) => {
  showToast(message, ToastType.ERROR);
};

/**
 * Show success toast
 * @param {string} message
 */
export const showSuccessToast = (message) => {
  showToast(message, ToastType.SUCCESS);
};
