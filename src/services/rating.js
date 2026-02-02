// src/services/rating.js
import { apiFetch } from './api';
import { formatDate } from '../utils/dateUtils';

// ========== 백엔드 → 프론트엔드 필드 매핑 ==========

/**
 * 백엔드 카테고리 점수를 프론트엔드 형식으로 변환
 */
export function mapCategoryScores(review) {
  return {
    individualAbility: review.ability,
    participation: review.effort,
    responsibility: review.commitment,
    communication: review.communication,
    collaboration: review.reflection,
  };
}

/**
 * 카테고리 평균을 슬라이더 형식으로 변환
 */
export function mapCategoryAveragesToSliders(categoryAverages) {
  return [
    { key: 'participation', name: '참여도', desc: '프로젝트 활동에 얼마나 적극적으로 참여했는지', value: categoryAverages?.effort || 0 },
    { key: 'communication', name: '소통', desc: '팀원들과 얼마나 원활하게 소통했는지', value: categoryAverages?.communication || 0 },
    { key: 'responsibility', name: '책임감', desc: '맡은 역할을 얼마나 책임감 있게 수행했는지', value: categoryAverages?.commitment || 0 },
    { key: 'collaboration', name: '협력', desc: '팀원들과 얼마나 잘 협력했는지', value: categoryAverages?.reflection || 0 },
    { key: 'individualAbility', name: '개인능력', desc: '개인의 역량을 얼마나 잘 발휘했는지', value: categoryAverages?.ability || 0 },
  ];
}

// ========== API 호출 함수 ==========

/**
 * 프로젝트 상세 정보 조회
 */
export async function fetchProjectDetails(projectId) {
  const response = await apiFetch(`/api/projects/${projectId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '프로젝트 조회에 실패했습니다.');
  }

  return response.json();
}

/**
 * 프로젝트 평가 요약 조회 (신규 API)
 */
export async function fetchReviewSummary(projectId) {
  const response = await apiFetch(`/api/reviews/project/${projectId}/summary`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '평가 요약 조회에 실패했습니다.');
  }

  return response.json();
}

/**
 * 내가 한 평가 조회 (신규 API)
 */
export async function fetchMyGivenReviews(projectId, userId) {
  const response = await apiFetch(`/api/reviews/project/${projectId}/reviewer/${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '내 평가 조회에 실패했습니다.');
  }

  return response.json();
}

/**
 * RatingProjectPage 전체 데이터 조회 (통합)
 */
export async function fetchRatingProjectData(projectId, currentUserId) {
  try {
    const { fetchProjectMembers, fetchProjectReviews } = await import('./evaluation');

    const [projectRes, membersRes, reviewsRes, summaryRes, myReviewsRes] = await Promise.all([
      fetchProjectDetails(projectId),
      fetchProjectMembers(projectId),
      fetchProjectReviews(projectId),
      fetchReviewSummary(projectId),
      fetchMyGivenReviews(projectId, currentUserId),
    ]);

    // 프로젝트 정보
    const project = projectRes.data || projectRes;
    const members = membersRes.data || membersRes;
    const allReviews = reviewsRes.data || reviewsRes;
    const summary = summaryRes.data || summaryRes;
    const myGivenReviewsRaw = myReviewsRes.data?.reviews || myReviewsRes.reviews || [];

    // 내가 받은 평가 필터링
    const myReceivedReviews = allReviews.filter(r => r.reviewee_id === currentUserId);

    // [New] 평가가 하나도 없으면 모든 수치를 0 또는 빈 값으로 강제 초기화
    let finalSliders = [];
    let finalRatingSummary = { average: 0, totalReviews: 0 };
    let finalSummary = { good: [], improve: [] };

    if (myReceivedReviews.length === 0) {
      // 평가 없음 -> 0점 처리
      finalSliders = mapCategoryAveragesToSliders({
        effort: 0,
        communication: 0,
        commitment: 0,
        reflection: 0,
        ability: 0,
      });
      finalRatingSummary = { average: 0, totalReviews: 0 };
      finalSummary = { good: [], improve: [] };
    } else {
      // 평가 있음 -> API 데이터 사용
      finalSliders = mapCategoryAveragesToSliders(summary.categoryAverages);
      finalRatingSummary = {
        average: summary.averageRating || 0,
        totalReviews: summary.totalReviews || 0,
      };
      finalSummary = {
        good: summary.summary?.strengths || [],
        improve: summary.summary?.improvements || [],
      };
    }

    // 받은 평가 코멘트
    const comments = myReceivedReviews.map(review => ({
      memberId: review.reviewer_id,
      avatar: null,
      text: review.comment || '',
      reviewerName: review.reviewer_username || '익명',
    }));

    // 내가 한 평가 매핑 (Figma 스펙: 배열 형식 + desc 포함)
    const myGivenRatings = myGivenReviewsRaw.map(review => ({
      targetMember: {
        id: review.reviewee_id,
        name: review.reviewee_username || '팀원',
        avatar: null,
        task: review.target_member_task || review.reviewee_task || null, // 담당 업무
      },
      overallScore: review.overall_rating,
      categoryScores: [
        { key: 'participation', name: '참여도', desc: '해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요', value: review.effort || 0 },
        { key: 'communication', name: '소통', desc: '해당 팀원과의 의사소통 태도를 점수로 평가 해주세요', value: review.communication || 0 },
        { key: 'responsibility', name: '책임감', desc: '해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요', value: review.commitment || 0 },
        { key: 'collaboration', name: '협력', desc: '해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요', value: review.reflection || 0 },
        { key: 'individualAbility', name: '개인 능력', desc: '해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요', value: review.ability || 0 },
      ],
      comment: review.comment || '',
    }));

    // D-day 계산 (양수: 남은 일수, 음수: 지난 일수)
    const endDate = new Date(project.end_date);
    const now = new Date();
    const dDay = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    // 진행률 계산 (0~100)
    const startDate = new Date(project.start_date);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
    const ddayPercent = totalDays > 0 ? Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100)) : 0;

    // ProjectMembers가 project 응답에 포함되어 있으면 우선 사용
    const projectMembers = project.ProjectMembers || members;

    return {
      id: projectId,
      name: project.title || project.name || '프로젝트',
      period: `${formatDate(project.start_date)} ~ ${formatDate(project.end_date)}`,
      meetingTime: project.meeting_time || '',
      dDay: { value: dDay, percent: ddayPercent },
      resultLink: project.result_link || project.resultLink || null,
      members: projectMembers.map(m => ({
        id: m.user_id || m.id,
        name: m.User?.username || '팀원',
        role: m.role || 'MEMBER',
        avatar: m.User?.avatar || null,
      })),
      sliders: finalSliders,
      comments,
      summary: finalSummary,
      ratingSummary: finalRatingSummary,
      myGivenRatings,
    };
  } catch (error) {
    console.error('RatingProjectPage 데이터 조회 오류:', error);
    throw error;
  }
}

// ========== 기존 더미 데이터 (하위 호환용) ==========

// 더미 데이터 (실제 API 연동 시 삭제/교체)
const allDummyProjects = [
  {
    id: 1,
    name: "신규 서비스 개발 프로젝트",
    description: "2024년 하반기 출시 예정 신규 웹 서비스 개발",
    period: "2024-07-01 ~ 2024-12-31",
    createdAt: "2024-07-01T09:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "PENDING",
    myScore: null,
    isRatedByMe: false,
  },
  {
    id: 2,
    name: "AI 기반 데이터 분석 시스템 구축",
    description: "사내 데이터 분석 효율성 증대를 위한 AI 시스템 개발",
    period: "2024-05-01 ~ 2024-11-15",
    createdAt: "2024-05-01T10:30:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "COMPLETED",
    myScore: 4.0,
    isRatedByMe: true,
  },
  {
    id: 5,
    name: "데이터베이스 시스템 구축",
    description: "새로운 서비스에 필요한 데이터베이스 시스템 설계 및 구현",
    period: "2023-11-01 ~ 2024-03-31",
    createdAt: "2023-11-01T15:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "COMPLETED",
    myScore: 4.2,
    isRatedByMe: true,
  },
  // 새 프로젝트 추가
  {
    id: 6,
    name: "연합동아리 부스전 기획 프로젝트",
    description: "2024년 상반기 연합동아리 부스전 행사 기획 및 운영",
    period: "2024-03-01 ~ 2024-06-30",
    createdAt: "2024-03-01T09:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "PENDING",
    myScore: null,
    isRatedByMe: false,
  },
];

export async function fetchUserProjects(tab = 'received', sortBy = 'createdAt', sortOrder = 'desc') {
  // 실제 API 연동 시 axios/fetch로 대체
  let filteredByTab = [];
  if (tab === 'received') {
    filteredByTab = allDummyProjects.filter(project =>
      project.myRatingStatus === 'COMPLETED' || project.myRatingStatus === 'VIEW_ONLY'
    );
  } else {
    filteredByTab = allDummyProjects.filter(project =>
      project.myRatingStatus === 'PENDING' || project.isRatedByMe === true
    );
  }
  const sorted = [...filteredByTab].sort((a, b) => {
    if (sortBy === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    }
    return 0;
  });
  // 네트워크 지연 시뮬레이션
  await new Promise(res => setTimeout(res, 300));
  return sorted;
}

export async function fetchProjectStatus(projectId) {
  // 실제 API 연동 시 axios/fetch로 대체
  const dummyStatus = {
    id: parseInt(projectId),
    name: `Project ${projectId} - 평가 현황`,
    myRatingStatus: "PENDING",
    status: "평가 완료",
    averageRating: 4.2,
    period: "2024-03-01 ~ 2024-06-30",
    meetingTime: "매주 수 19:00",
    avatars: [],
    dday: { value: 47, percent: 75 },
    resultLink: "any_link.com",
    totalMembers: 5,
    completedRatings: 3,
    categories: [
      { name: "협업 능력", average: 4.5 },
      { name: "문제 해결 능력", average: 4.0 },
      { name: "소통 능력", average: 4.1 },
    ],
    summary: {
      good: ["업무 능력이 뛰어나요.", "열정이 넘치는 팀원이에요."],
      improve: ["의사 소통이 원활하면 좋겠어요.", "열심히 성장하는 모습이 필요해요."],
    },
    roles: [
      "구체적인 역할은 어쩌구어쩌구 입니다.",
      "구체적인 역할은 어쩌구어쩌구 입니다.",
      "추가 역할 설명 예시입니다.",
    ],
    individualReviews: [
      {
        id: 1,
        reviewerName: "익명1",
        ratingDate: "2024-05-20",
        averageScore: 5,
        categories: [
          { name: "협업", score: 5 },
          { name: "문제 해결", score: 5 },
          { name: "소통", score: 5 },
        ],
        comment: "매우 협조적이고 탁월한 문제 해결 능력을 보여주었습니다."
      },
      {
        id: 2,
        reviewerName: "익명2",
        ratingDate: "2024-05-18",
        averageScore: 4,
        categories: [
          { name: "협업", score: 4 },
          { name: "문제 해결", score: 3.5 },
          { name: "소통", score: 4.5 },
        ],
        comment: "적극적으로 소통하며 팀에 기여했습니다."
      },
      {
        id: 3,
        reviewerName: "익명3",
        ratingDate: "2024-05-15",
        averageScore: 4.2,
        categories: [
          { name: "협업", score: 4 },
          { name: "문제 해결", score: 4 },
          { name: "소통", score: 4.5 },
        ],
        comment: "피드백을 잘 수용하고 발전하려는 의지가 강합니다."
      },
    ],
  };
  // 네트워크 지연 시뮬레이션
  await new Promise(res => setTimeout(res, 300));
  return dummyStatus;
}

// Re-export evaluation service functions for backward compatibility
// The real implementation is now in evaluation.js
export {
  fetchEvaluationTargets,
  submitEvaluation,
  fetchProjectMembers,
  fetchProjectReviews
} from './evaluation';
