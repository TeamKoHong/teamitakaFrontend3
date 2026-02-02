import { formatDateRange } from './dateFormat';
import { calculateProgress, calculateRemainingDays } from './calculateProgress';

/**
 * API 프로젝트 데이터를 평가 페이지 UI 형식으로 변환
 * @param {Object} apiProject - API에서 받은 프로젝트 데이터
 * @param {string} apiProject.project_id - 프로젝트 ID
 * @param {string} apiProject.title - 프로젝트 제목
 * @param {string} apiProject.start_date - 시작일 (ISO 문자열)
 * @param {string} apiProject.end_date - 종료일 (ISO 문자열)
 * @param {Array} apiProject.members - 팀원 배열
 * @param {string} [apiProject.meeting_schedule] - 회의 일정 (선택사항)
 * @returns {Object} 변환된 프로젝트 데이터
 *
 * @example
 * const apiData = {
 *   project_id: 123,
 *   title: "팀이타카 프로젝트",
 *   start_date: "2024-01-01T00:00:00.000Z",
 *   end_date: "2024-06-30T00:00:00.000Z",
 *   members: [{ avatar: "/path/to/avatar.jpg", ... }],
 *   meeting_schedule: "매주 월요일 14:00"
 * };
 *
 * const transformed = transformProjectForEvaluation(apiData);
 * // {
 * //   id: 123,
 * //   name: "팀이타카 프로젝트",
 * //   period: "2024.01.01 ~ 2024.06.30",
 * //   meetingTime: "매주 월요일 14:00",
 * //   avatars: ["/path/to/avatar.jpg"],
 * //   dday: { value: "D-15", percent: 75 }
 * // }
 */
export function transformProjectForEvaluation(apiProject) {
  if (!apiProject) {

    return null;
  }

  const {
    project_id,
    title,
    start_date,
    end_date,
    members = [],
    meeting_schedule
  } = apiProject;

  // 프로젝트 이름 변환
  const name = title || '프로젝트명 없음';

  // 프로젝트 기간 포맷팅
  const period = formatDateRange(start_date, end_date, 'dot') || '기간 미정';

  // 회의 시간 (없으면 빈 문자열)
  const meetingTime = meeting_schedule || '';

  // 팀원 아바타 배열 추출
  // avatar가 null인 경우 기본 이미지 사용 (회색 원 SVG)
  const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23DADADA"/%3E%3Cpath d="M50 45c8.284 0 15-6.716 15-15s-6.716-15-15-15-15 6.716-15 15 6.716 15 15 15zm0 7.5c-10 0-30 5.03-30 15v7.5h60v-7.5c0-9.97-20-15-30-15z" fill="%23fff"/%3E%3C/svg%3E';
  const avatars = members
    .filter(member => member)
    .map(member => member.avatar || defaultAvatar);

  // D-day 계산
  let dday = null;
  if (end_date) {
    try {
      const remainingDays = calculateRemainingDays(end_date);
      const progress = parseFloat(calculateProgress(start_date, end_date));

      dday = {
        value: remainingDays === 0 ? 'D-Day' : `D-${remainingDays}`,
        percent: Math.round(progress)
      };
    } catch (error) {

      dday = { value: 'D-?', percent: 0 };
    }
  }

  // 변환된 데이터 반환
  return {
    id: project_id,
    name,
    period,
    meetingTime,
    avatars,
    dday,
    // 원본 데이터도 포함 (필요한 경우 사용)
    _original: apiProject
  };
}

/**
 * 프로젝트 배열을 일괄 변환
 * @param {Array} projects - API 프로젝트 배열
 * @returns {Array} 변환된 프로젝트 배열
 */
export function transformProjectsForEvaluation(projects) {
  if (!Array.isArray(projects)) {

    return [];
  }

  return projects
    .map(project => transformProjectForEvaluation(project))
    .filter(project => project !== null);
}
