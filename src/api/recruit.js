// src/api/recruit.js
import { getApiConfig } from '../services/auth';

// ───────── 단일 진행중 드래프트(기존 호환) ─────────
const SINGLE_KEY = 'recruit.draft';

export const loadRecruitDraft = () => {
  try {
    const raw = localStorage.getItem(SINGLE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveRecruitDraft = (draft) => {
  localStorage.setItem(SINGLE_KEY, JSON.stringify(draft));
};

export const clearRecruitDraft = () => {
  localStorage.removeItem(SINGLE_KEY);
};

// ───────── 드래프트 리스트(여러 개 저장/불러오기) ─────────
const LIST_KEY = 'recruit.drafts';
const CURRENT_ID_KEY = 'recruit.currentDraftId';
const MAX_DRAFTS = 50;

export const loadDrafts = () => {
  try {
    return JSON.parse(localStorage.getItem(LIST_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getDraftById = (id) => loadDrafts().find((d) => d.id === id);

export const deleteDrafts = (ids) => {
  const next = loadDrafts().filter((d) => !ids.includes(d.id));
  localStorage.setItem(LIST_KEY, JSON.stringify(next));
};

export const saveDraftToList = (partial) => {
  const now = Date.now();
  const list = loadDrafts();

  // id 없으면 신규 발급
  let id = partial.id;
  if (!id) {
    id =
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : String(now) + Math.random().toString(36).slice(2, 8));
  }

  const item = {
    id,
    title: partial.title || '',
    type: partial.type || '', // 'course' | 'side' | ''
    updatedAt: now,
    data: partial.data || {},
  };

  const idx = list.findIndex((d) => d.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], ...item, updatedAt: now };
  else list.unshift(item);

  // 최대 개수 유지
  if (list.length > MAX_DRAFTS) list.length = MAX_DRAFTS;

  localStorage.setItem(LIST_KEY, JSON.stringify(list));
  localStorage.setItem(CURRENT_ID_KEY, id);
  return id;
};

export const getCurrentDraftId = () => localStorage.getItem(CURRENT_ID_KEY);
export const setCurrentDraftId = (id) => localStorage.setItem(CURRENT_ID_KEY, id);

// ───────── API 요청 함수들 ─────────

/**
 * Creates a new recruitment
 */
export const createRecruitment = async (recruitmentData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recruitmentData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
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
    const { API_BASE_URL } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
        const err = new Error('파일 크기는 5MB를 초과할 수 없습니다.');
        err.code = 'FILE_TOO_LARGE';
        throw err;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
        const err = new Error('허용되지 않는 파일 형식입니다. (jpeg, png, webp만 가능)');
        err.code = 'INVALID_FILE_TYPE';
        throw err;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await fetch(`${API_BASE_URL}/api/upload/recruitment-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

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
    const { API_BASE_URL, headers } = getApiConfig();

    const token = localStorage.getItem('authToken');
    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 404) {
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (res.status === 401 || res.status === 403) {
        const err = new Error('권한이 없습니다');
        err.code = 'UNAUTHORIZED';
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
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}/applications`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

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
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

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
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('로그인이 필요합니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/applications/${recruitmentId}`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
    });

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || '지원서 제출에 실패했습니다.');
        err.code = data.error || 'SERVER_ERROR';
        err.statusCode = res.status;
        throw err;
    }

    return data.data;
};

/**
 * Converts recruitment to project
 */
export const convertToProject = async (recruitmentId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/from-recruitment/${recruitmentId}`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

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
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const qs = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
    }).toString();

    const res = await fetch(`${API_BASE_URL}/api/recruitments/mine?${qs}`, {
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Gets all recruitments (Public, but returns is_scrapped if logged in)
 */
export const getAllRecruitments = async () => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    // 로그인한 경우 토큰 전달 (백엔드에서 is_scrapped 반환용)
    const requestHeaders = token
        ? { ...headers, Authorization: `Bearer ${token}` }
        : headers;

    const res = await fetch(`${API_BASE_URL}/api/recruitments`, {
        method: 'GET',
        headers: requestHeaders,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.message || 'Failed to fetch recruitments');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};