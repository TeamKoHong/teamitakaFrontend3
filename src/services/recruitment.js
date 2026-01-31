import { apiFetch } from './api';

/**
 * Creates a new recruitment
 * @param {Object} recruitmentData - Recruitment data
 */
export const createRecruitment = async (recruitmentData) => {
    const res = await apiFetch('/api/recruitments', {
        method: 'POST',
        body: JSON.stringify(recruitmentData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Backend error response:', errorData);
        const err = new Error(errorData.error || 'Failed to create recruitment');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Uploads a recruitment image
 */
export const uploadRecruitmentImage = async (imageFile) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
        const err = new Error('파일 크기는 5MB를 초과할 수 없습니다.');
        err.code = 'FILE_TOO_LARGE';
        throw err;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
        const err = new Error('허용되지 않는 파일 형식입니다. (jpeg, png, webp만 가능)');
        err.code = 'INVALID_FILE_TYPE';
        throw err;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await apiFetch('/api/upload/recruitment-image', {
        method: 'POST',
        headers: { 'Content-Type': undefined }, // Let browser set multipart boundary
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || 'Failed to upload image');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    const result = await res.json();
    return result.data.photo_url;
};

/**
 * Gets a recruitment by ID
 */
export const getRecruitment = async (recruitmentId) => {
    const res = await apiFetch(`/api/recruitments/${recruitmentId}`);

    if (res.status === 404) {
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || 'Failed to fetch recruitment');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Gets applicants for a recruitment
 */
export const getRecruitmentApplicants = async (recruitmentId) => {
    const res = await apiFetch(`/api/recruitments/${recruitmentId}/applications`);

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to fetch applicants');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Approves an applicant
 */
export const approveApplicant = async (applicationId) => {
    const res = await apiFetch(`/api/applications/${applicationId}/approve`, {
        method: 'POST',
    });

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to approve applicant');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Submits an application to a recruitment
 */
export const submitApplication = async (recruitmentId, applicationData) => {
    const res = await apiFetch(`/api/applications/${recruitmentId}`, {
        method: 'POST',
        body: JSON.stringify(applicationData),
    });

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || '지원서 제출에 실패했습니다.');
        err.code = data.error || 'SERVER_ERROR';
        err.statusCode = res.status;
        throw err;
    }

    return data;
};

/**
 * Cancels an application
 * @param {string} applicationId - The application ID to cancel
 */
export const cancelApplication = async (applicationId) => {
    const res = await apiFetch(`/api/applications/${applicationId}/cancel`, {
        method: 'POST',
    });

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || '지원 취소에 실패했습니다.');
        err.code = data.error || 'SERVER_ERROR';
        err.statusCode = res.status;
        throw err;
    }

    return data;
};

/**
 * Gets user's own applications
 */
export const getMyApplications = async () => {
    const res = await apiFetch('/api/applications/mine');

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || '지원 목록 조회에 실패했습니다.');
        err.code = data.error || 'SERVER_ERROR';
        err.statusCode = res.status;
        throw err;
    }

    return data;
};

/**
 * Converts recruitment to project
 */
export const convertToProject = async (recruitmentId) => {
    const res = await apiFetch(`/api/projects/from-recruitment/${recruitmentId}`, {
        method: 'POST',
    });

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to convert to project');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Gets user's own recruitments
 */
export const getMyRecruitments = async ({ limit = 10, offset = 0 } = {}) => {
    const qs = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
    }).toString();

    const res = await apiFetch(`/api/recruitments/mine?${qs}`);

    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Updates a recruitment
 */
export const updateRecruitment = async (recruitmentId, recruitmentData) => {
    const res = await apiFetch(`/api/recruitments/${recruitmentId}`, {
        method: 'PUT',
        body: JSON.stringify(recruitmentData),
    });

    if (res.status === 403) {
        const err = new Error('권한이 없습니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Update recruitment error:', errorData);
        const err = new Error(errorData.error || '모집글 수정에 실패했습니다.');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Deletes a recruitment
 */
export const deleteRecruitment = async (recruitmentId) => {
    const res = await apiFetch(`/api/recruitments/${recruitmentId}`, {
        method: 'DELETE',
    });

    if (res.status === 403) {
        const err = new Error('권한이 없습니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Delete recruitment error:', errorData);
        const err = new Error(errorData.error || '모집글 삭제에 실패했습니다.');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

export const toggleRecruitmentScrap = async (recruitmentId) => {
    const res = await apiFetch(`/api/scraps/recruitment/${recruitmentId}/scrap`, {
        method: 'PUT',
    });

    if (!res.ok) throw new Error('북마크 변경 실패');

    // 백엔드가 plain text 반환 ("스크랩 추가" / "스크랩 취소")
    return res.text();
};

export const getBookmarkedRecruitments = async () => {
    const res = await apiFetch('/api/scraps/recruitments');

    if (!res.ok) throw new Error('북마크 목록 조회 실패');

    return res.json();
};

/**
 * Creates a project from recruitment (Kickoff)
 */
export const createProjectFromRecruitment = async (recruitmentId, kickoffData) => {
    const res = await apiFetch(`/api/projects/from-recruitment/${recruitmentId}`, {
        method: 'POST',
        body: JSON.stringify(kickoffData),
    });

    if (res.status === 403) {
        const err = new Error('권한이 없습니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 409) {
        const err = new Error('이미 프로젝트로 전환된 모집글입니다.');
        err.code = 'ALREADY_CONVERTED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Create project error:', errorData);
        const err = new Error(errorData.message || '프로젝트 생성에 실패했습니다.');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};
