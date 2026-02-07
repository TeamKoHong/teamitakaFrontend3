/**
 * 본인인증 API 서비스 (Firebase Phone Auth 연동)
 * 
 * 기존 Mock API를 Firebase Phone Auth로 교체
 */

import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { verifyPhoneAuth } from './phoneAuth';

// 테스트 전화번호 목록 (Firebase 우회) — 개발 모드에서만 활성화
const IS_TEST_MODE = process.env.NODE_ENV !== 'production';
const TEST_PHONES = IS_TEST_MODE ? [
    '010-1234-5678',
    '010-0000-0000',
    '010-9999-9999'
] : [];
const TEST_CODE = IS_TEST_MODE ? '123456' : ''; // 테스트 인증코드
const REGISTERED_PHONE = IS_TEST_MODE ? '010-0000-0000' : null; // 이미 가입된 번호

// 전역 상태 (confirmationResult 저장용)
let confirmationResult = null;

/**
 * 테스트 번호 여부 확인
 * @param {string} phone - 010-XXXX-XXXX 형식
 * @returns {boolean}
 */
const isTestPhone = (phone) => {
    return TEST_PHONES.includes(phone);
};

/**
 * 휴대폰 번호 포맷팅 (010-XXXX-XXXX)
 * @param {string} value - 입력값
 * @returns {string} - 포맷팅된 번호
 */
export const formatPhoneNumber = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
};

/**
 * 휴대폰 번호를 E.164 형식으로 변환
 * @param {string} phone - 010-1234-5678 형식
 * @returns {string} - +821012345678 형식
 */
const toE164Format = (phone) => {
    const cleaned = phone.replace(/-/g, '');
    if (cleaned.startsWith('010')) {
        return '+82' + cleaned.substring(1);
    }
    if (cleaned.startsWith('+82')) {
        return cleaned;
    }
    return '+82' + cleaned;
};

/**
 * reCAPTCHA 초기화
 */
const setupRecaptcha = () => {
    // 1. Clear existing verifier if present
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch (e) {
            /* silent: recaptcha cleanup 실패 무시 */
        }
        window.recaptchaVerifier = null;
    }

    // 2. Check for container element
    const container = document.getElementById('recaptcha-container');
    if (!container) {

        return null;
    }

    // 3. Create new verifier
    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible', // invisible mode
            callback: () => {

            },
            'expired-callback': () => {

                if (window.recaptchaVerifier) {
                    try {
                        window.recaptchaVerifier.clear();
                    } catch (e) { /* silent: cleanup 실패 무시 */ }
                    window.recaptchaVerifier = null;
                }
            }
        });
    } catch (e) {

        return null;
    }

    return window.recaptchaVerifier;
};

/**
 * reCAPTCHA 정리
 */
export const cleanupRecaptcha = () => {
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
    }
};

/**
 * 본인인증 SMS 요청 (Firebase Phone Auth)
 * @param {Object} formData - 폼 데이터
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const requestPhoneVerification = async (formData) => {
    // 이미 가입된 번호 체크 (실제로는 백엔드에서 확인)
    if (REGISTERED_PHONE && formData.phone === REGISTERED_PHONE) {
        const error = new Error('이미 가입된 번호입니다.');
        error.code = 'ALREADY_REGISTERED';
        throw error;
    }

    // 필수 필드 검증
    if (!formData.carrier || !formData.phone || !formData.birthDate ||
        !formData.genderCode || !formData.name) {
        const error = new Error('모든 필드를 입력해주세요.');
        error.code = 'MISSING_FIELDS';
        throw error;
    }

    const formattedPhone = toE164Format(formData.phone);

    // 🧪 테스트 번호 체크 (Firebase 우회)
    if (isTestPhone(formData.phone)) {

        // 테스트용 가짜 confirmationResult
        confirmationResult = {
            confirm: async (code) => {
                if (code === TEST_CODE) {
                    return {
                        user: {
                            uid: 'test-user-' + Date.now(),
                            phoneNumber: toE164Format(formData.phone),
                            getIdToken: async () => 'dev-test-token-' + Date.now()
                        }
                    };
                } else {
                    throw new Error('인증 코드가 올바르지 않습니다.');
                }
            }
        };

        return {
            success: true,
            message: `인증번호가 전송되었습니다. (테스트: ${TEST_CODE})`
        };
    }

    // 🔥 Firebase Phone Auth
    try {
        const appVerifier = setupRecaptcha();
        if (!appVerifier) {
            throw new Error('reCAPTCHA initialization failed. Please refresh the page.');
        }
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        confirmationResult = result;

        return {
            success: true,
            message: '인증번호가 전송되었습니다.'
        };
    } catch (err) {

        cleanupRecaptcha();

        // 에러 처리
        let userMessage = 'SMS 전송에 실패했습니다.';
        if (err.code === 'auth/invalid-phone-number') {
            userMessage = '전화번호 형식 오류';
        } else if (err.code === 'auth/too-many-requests') {
            userMessage = '요청 한도 초과 (나중에 다시 시도)';
        } else if (err.code === 'auth/invalid-app-credential') {
            userMessage = '인증 설정 오류입니다. 관리자에게 문의해주세요.';
        }

        const error = new Error(userMessage);
        error.code = err.code;
        throw error;
    }
};

/**
 * 인증번호 확인 (Firebase + 백엔드)
 * @param {string} code - 6자리 인증번호
 * @param {Object} formData - 원본 폼 데이터
 * @returns {Promise<{success: boolean, ci: string, name: string, phone: string}>}
 */
export const verifyCode = async (code, formData = {}) => {
    if (!confirmationResult) {
        throw new Error('인증번호를 먼저 요청해주세요.');
    }

    try {

        // Firebase 인증 코드 확인
        const credential = await confirmationResult.confirm(code);
        const idToken = await credential.user.getIdToken();

        // 🧪 테스트 번호는 백엔드 검증 우회
        if (isTestPhone(formData.phone)) {

            // confirmationResult 정리
            confirmationResult = null;

            return {
                success: true,
                ci: 'TEST_CI_' + Date.now(),
                name: formData.name || '테스트사용자',
                phone: formData.phone,
                token: 'test-jwt-token-' + Date.now(),
                user: {
                    id: 'test-user-' + Date.now(),
                    name: formData.name || '테스트사용자',
                    phone: formData.phone,
                    ci: 'TEST_CI_' + Date.now()
                }
            };
        }

        // 백엔드 API로 검증 & 사용자 정보 획득
        const response = await verifyPhoneAuth(idToken);

        // confirmationResult 정리
        confirmationResult = null;

        return {
            success: true,
            ci: response.user?.ci || 'CI_' + Date.now(),
            name: formData.name || response.user?.name || '사용자',
            phone: formData.phone || credential.user.phoneNumber,
            token: response.token,
            user: response.user
        };
    } catch (err) {

        let userMessage = '인증번호가 일치하지 않습니다.';
        if (err.code === 'auth/invalid-verification-code') {
            userMessage = '인증코드 불일치';
        } else if (err.code === 'auth/code-expired') {
            userMessage = '인증코드 만료 (재발송 필요)';
        }

        const error = new Error(userMessage);
        error.code = err.code || 'INVALID_CODE';
        throw error;
    }
};

/**
 * 인증번호 재전송
 * @param {Object} formData - 폼 데이터
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resendVerificationCode = async (formData) => {
    // reCAPTCHA 정리 후 재요청
    cleanupRecaptcha();
    confirmationResult = null;

    // 새로운 SMS 전송
    return requestPhoneVerification(formData);
};
