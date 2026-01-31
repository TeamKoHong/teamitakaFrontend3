import { apiFetch } from './api';

/**
 * Verifies Firebase ID token with backend and gets JWT token
 * @param {string} idToken - Firebase ID Token
 * @returns {Promise<Object>} Response with JWT token and user info
 */
export const verifyPhoneAuth = async (idToken) => {
    const res = await apiFetch('/api/auth/verify-phone', {
        method: 'POST',
        credentials: 'include', // HttpOnly 쿠키 수신
        body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Phone auth verification failed:', errorData);
        const err = new Error(errorData.error || 'Phone authentication failed');
        err.code = 'PHONE_AUTH_ERROR';
        err.details = errorData.details;
        throw err;
    }

    return res.json();
};
