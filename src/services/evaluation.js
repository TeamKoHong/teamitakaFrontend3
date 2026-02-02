import { apiFetch } from './api';

/**
 * Maps frontend evaluation field names to backend Review model fields
 */
function mapEvaluationData(evaluationData, projectId, reviewerId, revieweeId) {
  const { categoryRatings, overallRating, roleDescription, encouragementMessage } = evaluationData;

  return {
    project_id: projectId,
    reviewer_id: reviewerId,
    reviewee_id: revieweeId,
    role_description: roleDescription || '',
    ability: categoryRatings.individualAbility,
    effort: categoryRatings.participation,
    commitment: categoryRatings.responsibility,
    communication: categoryRatings.communication,
    reflection: categoryRatings.collaboration,
    overall_rating: Math.max(1, overallRating),
    comment: encouragementMessage || '',
  };
}

/**
 * Submits team member evaluation to backend
 */
export async function submitEvaluation(projectId, reviewerId, revieweeId, evaluationData) {
  try {
    const mappedData = mapEvaluationData(evaluationData, projectId, reviewerId, revieweeId);

    const response = await apiFetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '평가 제출에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {

    throw error;
  }
}

/**
 * [복구 및 개선] 프로젝트의 모든 리뷰 목록을 가져옵니다.
 * 이 함수는 반드시 '배열'을 반환해야 다른 페이지가 터지지 않습니다.
 */
export async function fetchProjectReviews(projectId) {
  try {
    // 1. 프로필 페이지를 위해 '요약 데이터'만 몰래 따로 찌릅니다. (백그라운드 처리)
    // 이 요청은 실패해도 메인 로직에 영향을 주지 않습니다.
    apiFetch(`/api/reviews/project/${projectId}/summary`)
      .then(res => res.ok ? res.json() : null)
      .then(sData => {
        if (sData && sData.summary) {
          localStorage.setItem('cached_evaluation_summary', JSON.stringify(sData));

        }
      })
      .catch(() => { /* 요약본 조회 실패 시 조용히 무시 */ });

    // 2. 원래 RatingProjectPage 등이 기대하는 '리뷰 목록'을 가져옵니다.
    const response = await apiFetch(`/api/reviews/project/${projectId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '평가 조회에 실패했습니다.');
    }

    const reviews = await response.json();
    
    // 3. 반환값은 반드시 '배열' 형태여야 함 (.filter 에러 방지)
    const result = Array.isArray(reviews) ? reviews : (reviews.data || []);
    return result; 

  } catch (error) {

    throw error;
  }
}

/**
 * Fetches project team members
 */
export async function fetchProjectMembers(projectId) {
  try {
    const response = await apiFetch(`/api/projects/${projectId}/members`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '팀원 조회에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {

    throw error;
  }
}

/**
 * Determines evaluation targets and their completion status
 */
export async function fetchEvaluationTargets(projectId, currentUserId) {
  try {
    const [membersRes, reviewsRes] = await Promise.all([
      fetchProjectMembers(projectId),
      fetchProjectReviews(projectId),
    ]);

    const members = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
    const reviews = Array.isArray(reviewsRes) ? reviewsRes : (reviewsRes?.data || []);

    const targets = members.filter(member => member.user_id !== currentUserId);

    const reviewedMemberIds = new Set(
      reviews
        .filter(review => review.reviewer_id === currentUserId)
        .map(review => review.reviewee_id)
    );

    const targetsWithStatus = targets.map(member => ({
      id: member.user_id,
      name: member.User?.username || '알 수 없음',
      email: member.User?.email || '',
      role: member.role || '팀원',
      status: reviewedMemberIds.has(member.user_id) ? 'completed' : 'pending',
    }));

    const nextPending = targetsWithStatus.find(target => target.status === 'pending');

    return {
      targets: targetsWithStatus,
      nextPendingMember: nextPending || null,
      allCompleted: targetsWithStatus.every(target => target.status === 'completed'),
    };
  } catch (error) {

    throw error;
  }
}