// src/constants/routes.js

// ===== 메인 페이지 라우트 =====
export const MAIN_ROUTES = {
  HOME: '/',
  MAIN: '/main',
  LOGIN: '/login',
  REGISTER: '/register',
};

// ===== 프로젝트 관리 라우트 =====
export const PROJECT_ROUTES = {
  MANAGEMENT: '/project-management',
  DETAIL: '/project/:id',
  MEMBER: '/project/:id/member',
  PROCEEDINGS: '/project/:id/proceedings',
  CREATE_MEETING: '/project/:id/proceedings/create',
  CALENDAR: '/project/:id/calender',
};

// ===== 평가 시스템 라우트 (새로운 구조) =====
export const EVALUATION_ROUTES = {
  MANAGEMENT: '/evaluation/management',
  PROJECT: '/evaluation/project/:projectId',
  PROJECT_GIVEN: '/evaluation/project/:projectId/given',
  FEEDBACK_DETAIL: '/evaluation/project/:projectId/feedback/:memberId',
  TEAM_MEMBER: '/evaluation/team-member/:projectId/:memberId',
  STATUS_GIVEN: '/evaluation/status/:projectId/given',
  STATUS_RECEIVED: '/evaluation/status/:projectId/received',
  STATUS: '/evaluation/status/:projectId',
};

// ===== 기존 URL 호환성 리다이렉트 =====
export const LEGACY_EVALUATION_ROUTES = {
  RATING_MANAGEMENT: '/project/rating-management',
  RATING_PROJECT: '/project/:projectId/rating-project',
  EVALUATE_MEMBER: '/project/:projectId/evaluate/:memberId',
  RATING_STATUS_GIVEN: '/project/:projectId/rating-status/given',
  RATING_STATUS_RECEIVED: '/project/:projectId/rating-status/received',
  RATING_STATUS: '/project/:projectId/rating-status',
};

// ===== 팀 매칭 및 기타 라우트 =====
export const OTHER_ROUTES = {
  TEAM_MATCHING: '/team-matching',
  RECRUITMENT: '/recruitment',
  SEARCH: '/search',
  TEAM: '/team',
  BOOKMARK: '/bookmark',
};

// ===== 프로필 라우트 =====
export const PROFILE_ROUTES = {
  MAIN: '/profile',
  EDIT: '/profile/edit',
  VERIFICATION: '/profile/verification',
  REGISTER_PROJECT: '/profile/register-project',
};

// ===== 데모 및 개발 도구 라우트 =====
export const DEMO_ROUTES = {
  CATEGORY_SLIDER: '/demo/category-slider',
};

// ===== 라우트 그룹별 분류 =====
export const ROUTE_GROUPS = {
  MAIN: Object.values(MAIN_ROUTES),
  PROJECT: Object.values(PROJECT_ROUTES),
  EVALUATION: Object.values(EVALUATION_ROUTES),
  LEGACY_EVALUATION: Object.values(LEGACY_EVALUATION_ROUTES),
  OTHER: Object.values(OTHER_ROUTES),
  PROFILE: Object.values(PROFILE_ROUTES),
  DEMO: Object.values(DEMO_ROUTES),
};

// ===== 라우트 메타데이터 =====
export const ROUTE_METADATA = {
  [MAIN_ROUTES.HOME]: {
    title: '온보딩',
    requiresAuth: false,
    showBottomNav: false,
  },
  [MAIN_ROUTES.MAIN]: {
    title: '메인',
    requiresAuth: true,
    showBottomNav: true,
  },
  [MAIN_ROUTES.LOGIN]: {
    title: '로그인',
    requiresAuth: false,
    showBottomNav: false,
  },
  [MAIN_ROUTES.REGISTER]: {
    title: '회원가입',
    requiresAuth: false,
    showBottomNav: false,
  },
  [PROJECT_ROUTES.MANAGEMENT]: {
    title: '프로젝트 관리',
    requiresAuth: true,
    showBottomNav: true,
  },
  [PROJECT_ROUTES.DETAIL]: {
    title: '프로젝트 상세',
    requiresAuth: true,
    showBottomNav: true,
  },
  [EVALUATION_ROUTES.MANAGEMENT]: {
    title: '평가 관리',
    requiresAuth: true,
    showBottomNav: true,
  },
  [EVALUATION_ROUTES.PROJECT]: {
    title: '프로젝트 평가',
    requiresAuth: true,
    showBottomNav: true,
  },
  [EVALUATION_ROUTES.TEAM_MEMBER]: {
    title: '팀원 평가',
    requiresAuth: true,
    showBottomNav: true,
  },
  [EVALUATION_ROUTES.STATUS_GIVEN]: {
    title: '평가 상태 (보낸 평가)',
    requiresAuth: true,
    showBottomNav: true,
  },
  [EVALUATION_ROUTES.STATUS_RECEIVED]: {
    title: '평가 상태 (받은 평가)',
    requiresAuth: true,
    showBottomNav: true,
  },
  [PROFILE_ROUTES.MAIN]: {
    title: '프로필',
    requiresAuth: true,
    showBottomNav: true,
  },
  [PROFILE_ROUTES.EDIT]: {
    title: '프로필 편집',
    requiresAuth: true,
    showBottomNav: false,
  },
  [PROFILE_ROUTES.VERIFICATION]: {
    title: '대학 인증 내역',
    requiresAuth: true,
    showBottomNav: false,
  },
};

// ===== 라우트 헬퍼 함수 =====

/**
 * 프로젝트 상세 페이지 URL 생성
 * @param {string} projectId - 프로젝트 ID
 * @returns {string} 프로젝트 상세 페이지 URL
 */
export const getProjectDetailUrl = (projectId) => 
  PROJECT_ROUTES.DETAIL.replace(':id', projectId);

/**
 * 프로젝트 평가 페이지 URL 생성
 * @param {string} projectId - 프로젝트 ID
 * @returns {string} 프로젝트 평가 페이지 URL
 */
export const getProjectEvaluationUrl = (projectId) => 
  EVALUATION_ROUTES.PROJECT.replace(':projectId', projectId);

/**
 * 팀원 평가 페이지 URL 생성
 * @param {string} projectId - 프로젝트 ID
 * @param {string} memberId - 팀원 ID
 * @returns {string} 팀원 평가 페이지 URL
 */
export const getTeamMemberEvaluationUrl = (projectId, memberId) => 
  EVALUATION_ROUTES.TEAM_MEMBER
    .replace(':projectId', projectId)
    .replace(':memberId', memberId);

/**
 * 평가 상태 페이지 URL 생성
 * @param {string} projectId - 프로젝트 ID
 * @param {string} type - 상태 타입 ('given' | 'received')
 * @returns {string} 평가 상태 페이지 URL
 */
export const getEvaluationStatusUrl = (projectId, type) => {
  if (type === 'given') {
    return EVALUATION_ROUTES.STATUS_GIVEN.replace(':projectId', projectId);
  } else if (type === 'received') {
    return EVALUATION_ROUTES.STATUS_RECEIVED.replace(':projectId', projectId);
  }
  return EVALUATION_ROUTES.STATUS.replace(':projectId', projectId);
};

/**
 * 라우트가 평가 플로우에 속하는지 확인
 * @param {string} pathname - 현재 경로
 * @returns {boolean} 평가 플로우 여부
 */
export const isEvaluationRoute = (pathname) => 
  pathname.includes('/evaluation/');

/**
 * 라우트가 프로젝트 관련인지 확인
 * @param {string} pathname - 현재 경로
 * @returns {boolean} 프로젝트 관련 여부
 */
export const isProjectRoute = (pathname) => 
  pathname.includes('/project/') || pathname.includes('/evaluation/');

/**
 * 라우트 메타데이터 가져오기
 * @param {string} pathname - 현재 경로
 * @returns {object|null} 라우트 메타데이터
 */
export const getRouteMetadata = (pathname) => {
  // 정확한 매칭을 위해 패턴 매칭 로직 구현
  for (const [route, metadata] of Object.entries(ROUTE_METADATA)) {
    const pattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      return metadata;
    }
  }
  return null;
};
