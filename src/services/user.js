import { apiFetch } from './api';

export const getMe = async () => {
    const res = await apiFetch('/api/auth/me');

    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 프로필 이미지 업로드
 * @param {File} imageFile - 업로드할 이미지 파일
 * @returns {Promise<{success: boolean, data: {photo_url: string}}>}
 */
export const uploadProfileImage = async (imageFile) => {
    // 파일 유효성 검사
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP만 가능)');
    }
    if (imageFile.size > maxSize) {
        throw new Error('이미지 크기는 5MB 이하여야 합니다.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await apiFetch('/api/upload/profile-image', {
        method: 'POST',
        headers: { 'Content-Type': undefined }, // Let browser set multipart boundary
        body: formData
    });

    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 프로필 업데이트
 * @param {Object} profileData - 업데이트할 프로필 데이터
 * @returns {Promise<Object>} 업데이트된 사용자 정보
 */
export const updateProfile = async (profileData) => {
    const res = await apiFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });

    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 타입 테스트 결과 저장
 * @param {Object} resultData - { type: string, answers: boolean[] }
 * @returns {Promise<Object>}
 */
export const saveTypeResult = async (resultData) => {
    const res = await apiFetch('/api/user/type-result', {
        method: 'POST',
        body: JSON.stringify(resultData),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.message || 'SERVER_ERROR');
        err.code = errorData.code || 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};
