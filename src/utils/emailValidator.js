/**
 * 대학교 이메일 도메인 검증 유틸리티
 */

// 허용되는 대학교 이메일 도메인 접미사
const ALLOWED_DOMAIN_SUFFIXES = ['.ac.kr', '.edu'];

/**
 * 대학교 이메일인지 검증
 * @param {string} email - 검증할 이메일 주소
 * @returns {boolean} 대학교 이메일 여부
 */
export const isUniversityEmail = (email) => {
    if (!email || typeof email !== 'string') return false;

    const atIndex = email.indexOf('@');
    if (atIndex === -1) return false;

    const domain = email.slice(atIndex + 1).toLowerCase();
    return ALLOWED_DOMAIN_SUFFIXES.some(suffix => domain.endsWith(suffix));
};

/**
 * 이메일 도메인 추출
 * @param {string} email - 이메일 주소
 * @returns {string|null} 도메인 또는 null
 */
export const getEmailDomain = (email) => {
    if (!email || typeof email !== 'string') return null;

    const atIndex = email.indexOf('@');
    if (atIndex === -1) return null;

    return email.slice(atIndex + 1).toLowerCase();
};
