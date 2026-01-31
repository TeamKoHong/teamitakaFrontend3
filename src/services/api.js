/**
 * API 호출 래퍼 - 전역 에러 처리 포함
 *
 * 사용법:
 * import { apiFetch } from './api';
 * const response = await apiFetch('/api/users', { method: 'GET' });
 */

import { getApiConfig } from './auth';
import { getAuthHeader } from '../utils/tokenManager';

/**
 * 전역 에러 처리가 포함된 fetch 래퍼
 * @param {string} endpoint - API 엔드포인트 (예: '/api/auth/login')
 * @param {RequestInit} options - fetch 옵션
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
    const { API_BASE_URL, headers: defaultHeaders } = getApiConfig();

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...getAuthHeader(),
            ...options.headers,
        },
    });

    // 응답 처리
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // 사용자 미발견 시 로그인 페이지로 리다이렉트
        if (errorData.message === '사용자를 찾을 수 없습니다.') {
            console.log('🔐 사용자 미발견 - 로그인 페이지로 이동');
            handleAuthError();
        }

        // 인증 실패 (401) 시 로그인 페이지로 리다이렉트
        if (response.status === 401) {
            console.log('🔐 인증 만료 - 로그인 페이지로 이동');
            handleAuthError();
        }
    }

    return response;
};

/**
 * 인증 에러 처리 - 토큰 제거 및 로그인 페이지 리다이렉트
 */
const handleAuthError = () => {
    // 저장된 인증 정보 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // 현재 페이지가 로그인/회원가입 관련 페이지가 아닌 경우에만 리다이렉트
    const currentPath = window.location.pathname;
    const authPaths = ['/login', '/register', '/phone-verify', '/forgot-password'];
    const isAuthPage = authPaths.some(path => currentPath.includes(path));

    if (!isAuthPage) {
        window.location.href = '/login?expired=true';
    }
};

/**
 * JSON 응답을 자동으로 파싱하는 fetch 래퍼
 * @param {string} endpoint - API 엔드포인트
 * @param {RequestInit} options - fetch 옵션
 * @returns {Promise<{response: Response, data: any}>}
 */
export const apiFetchJson = async (endpoint, options = {}) => {
    const response = await apiFetch(endpoint, options);
    const data = await response.json().catch(() => ({}));
    return { response, data };
};

export default apiFetch;
