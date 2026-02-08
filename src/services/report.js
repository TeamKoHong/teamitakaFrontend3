import { apiFetch } from './api';

/**
 * 신고 사유 목록
 */
export const REPORT_REASONS = [
    { value: 'inappropriate', label: '부적절한 콘텐츠' },
    { value: 'spam', label: '스팸/광고' },
    { value: 'fraud', label: '사기/허위 정보' },
    { value: 'harassment', label: '괴롭힘/욕설' },
    { value: 'other', label: '기타' },
];

/**
 * 콘텐츠 신고
 * @param {'user'|'project'|'recruitment'} targetType - 신고 대상 유형
 * @param {string|number} targetId - 신고 대상 ID
 * @param {string} reason - 신고 사유 코드
 * @param {string} [detail] - 상세 설명 (선택)
 */
export const reportContent = async (targetType, targetId, reason, detail = '') => {
    const res = await apiFetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify({ targetType, targetId, reason, detail }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409) {
            const err = new Error('이미 신고한 콘텐츠입니다.');
            err.code = 'ALREADY_REPORTED';
            throw err;
        }
        const err = new Error(errorData.message || '신고에 실패했습니다.');
        err.code = errorData.code || 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 사용자 차단
 * @param {string|number} userId - 차단할 사용자 ID
 */
export const blockUser = async (userId) => {
    const res = await apiFetch(`/api/users/${userId}/block`, {
        method: 'POST',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.message || '차단에 실패했습니다.');
        err.code = errorData.code || 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 사용자 차단 해제
 * @param {string|number} userId - 차단 해제할 사용자 ID
 */
export const unblockUser = async (userId) => {
    const res = await apiFetch(`/api/users/${userId}/block`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.message || '차단 해제에 실패했습니다.');
        err.code = errorData.code || 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 차단 목록 조회
 */
export const getBlockedUsers = async () => {
    const res = await apiFetch('/api/users/blocked');

    if (!res.ok) {
        const err = new Error('차단 목록을 불러올 수 없습니다.');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};
