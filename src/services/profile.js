import { apiFetch } from './api';

/**
 * 프로필 상세 정보 조회
 */
export const getProfileDetail = async () => {
    try {
        const res = await apiFetch('/api/profile/detail');

        if (res.ok) {
            return res.json(); // ✅ 실제 백엔드 데이터 반환
        }

        // API 호출 실패 시 (데이터가 없을 때)
        return {
            success: true,
            data: {
                currentProjects: 0,
                totalTeamExperience: 0,
                tags: [],
                skills: {},
                feedback: { positive: [], negative: [] },
                projects: []
            }
        };
    } catch (err) {

        return { success: false, data: null };
    }
};

/**
 * 대학 인증 정보 조회
 */
export const getVerificationInfo = async () => {
    try {
        const res = await apiFetch('/api/profile/verification');
        if (res.ok) return res.json();
        
        return { success: false, data: null };
    } catch (err) {
        return { success: false, data: null };
    }
};