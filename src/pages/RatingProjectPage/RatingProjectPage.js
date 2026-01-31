import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './RatingProjectPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';
import TeamMemberAvatars from '../../components/RatingProjectPage/TeamMemberAvatars';
import ProjectResultCard from '../../components/RatingProjectPage/ProjectResultCard';
import ProsConsCards from '../../components/RatingProjectPage/ProsConsCards';
import CategorySlidersGroup from '../../components/RatingProjectPage/CategorySlidersGroup';
import EvaluationCommentCard from '../../components/RatingProjectPage/EvaluationCommentCard';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import MyRatingSection from '../../components/RatingProjectPage/MyRatingSection';
import { fetchRatingProjectData } from '../../services/rating';
// Fixture import removed

function RatingProjectPage(props) {
  const { projectId: propProjectId, mode = 'received' } = props;
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId;
  const location = useLocation();
  const navigate = useNavigate();

  // useAuth 훅으로 인증 상태 확인
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증되지 않은 경우 (ProtectedRoute가 처리하지만 안전장치)
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // AuthContext에서 사용자 정보 가져오기 (더 신뢰할 수 있음)
        // 백엔드에서 올 수 있는 모든 필드명 체크: user_id, userId, id
        const currentUserId = authUser?.user_id || authUser?.userId || authUser?.id;

        if (!currentUserId) {
          // fallback: localStorage에서 가져오기
          const userStr = localStorage.getItem('user');
          const user = userStr ? JSON.parse(userStr) : null;
          const fallbackUserId = user?.user_id || user?.userId || user?.id;

          if (!fallbackUserId) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
          }

          // 실제 API 호출 (fallback userId 사용)
          const result = await fetchRatingProjectData(projectId, fallbackUserId);
          setData(result);
        } else {
          // 실제 API 호출
          const result = await fetchRatingProjectData(projectId, currentUserId);
          setData(result);
        }
      } catch (err) {
        console.error('API 호출 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, isAuthenticated, authLoading, authUser]);

  // "내가 한 평가" 모드 여부 (useEffect 의존성으로 사용되므로 여기서 계산)
  const isGivenMode = mode === 'given';

  // 초기 선택 설정 (첫 번째 평가 대상자) - early return 이전에 위치해야 함
  useEffect(() => {
    if (isGivenMode && data?.myGivenRatings?.length > 0 && !selectedMemberId) {
      setSelectedMemberId(data.myGivenRatings[0].targetMember?.id);
    }
  }, [isGivenMode, data, selectedMemberId]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // location.state로 전달된 데이터가 있으면 우선 사용
  const stateProject = location.state?.projectSummary;

  // dday 값을 객체 형식으로 통일 (DdayProgress 컴포넌트가 { value, percent } 형식 기대)
  const rawDday = stateProject?.dday ?? data?.dDay ?? 0;
  const ddayObj = typeof rawDday === 'object'
    ? rawDday
    : { value: rawDday, percent: 0 }; // API에서 숫자로 올 경우 객체로 변환

  const project = {
    id: data?.id || projectId,
    name: stateProject?.name ?? data?.name ?? '프로젝트',
    period: stateProject?.period ?? data?.period ?? '',
    meetingTime: stateProject?.meetingTime ?? data?.meetingTime ?? '',
    dday: ddayObj,
  };
  const members = data?.members || [];
  const sliders = data?.sliders || [];
  const comments = data?.comments || [];
  const summary = stateProject?.summary ?? data?.summary ?? { good: [], improve: [] };
  const ratingSummary = stateProject?.ratingSummary ?? data?.ratingSummary ?? { average: 0 };
  const myGivenRatings = data?.myGivenRatings || [];

  // 선택된 팀원의 평가 데이터 찾기
  const givenRating = isGivenMode && myGivenRatings.length > 0
    ? (selectedMemberId
      ? myGivenRatings.find(r => r.targetMember?.id === selectedMemberId)
      : myGivenRatings[0])
    : null;

  const handleNavigateToGiven = () => {
    navigate(`/evaluation/project/${projectId}/given`);
  };

  const handleNavigateToReceived = () => {
    navigate(`/evaluation/project/${projectId}`);
  };

  const handleBack = () => {
    const from = location.state?.from;
    const searchParams = new URLSearchParams(location.search);
    const tab = from?.tab || searchParams.get('tab');
    if (from?.path === '/project-management' || tab === 'completed') {
      navigate('/project-management?tab=completed', { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.pageBg}>
      {/* 헤더: 완료된 프로젝트 + 내가 한 평가 버튼 */}
      <DefaultHeader
        title={isGivenMode ? '내가 한 평가지' : '완료된 프로젝트'}
        onBack={handleBack}
        rightElement={
          isGivenMode ? (
            <button className={styles.headerBtn} onClick={handleNavigateToReceived}>
              내가 받은 평가
            </button>
          ) : (
            <button className={styles.headerBtn} onClick={handleNavigateToGiven}>
              내가 한 평가
            </button>
          )
        }
      />

      <div className={styles.scrollArea}>
        {/* 1. 프로젝트 카드 (배경 이미지 + D-Day) */}
        <div className={styles.projectCardSection}>
          <ProjectInfoCard
            name={project.name}
            period={project.period}
            meetingTime={project.meetingTime}
            dday={project.dday}
          />
        </div>

        {/* 2. 팀원 아바타 목록 */}
        <div className={styles.membersSection}>
          <TeamMemberAvatars
            members={isGivenMode
              ? [...new Map(myGivenRatings.map(r => [r.targetMember?.id, r.targetMember])).values()]
              : members}
            selectedId={isGivenMode ? selectedMemberId : null}
            onSelect={isGivenMode ? setSelectedMemberId : null}
            selectable={isGivenMode}
          />
        </div>

        {/* 3. 프로젝트 결과물 */}
        <div className={styles.resultSection}>
          <ProjectResultCard resultLink={data?.resultLink} />
        </div>

        {/* 4. 별점 섹션 */}
        <div className={styles.ratingSection}>
          <MyRatingSection
            score={isGivenMode && givenRating ? givenRating.overallScore : (ratingSummary?.average ?? 0)}
            showTitle={true}
            title={isGivenMode
              ? `내가 ${givenRating?.targetMember?.name || '팀원'}님에게 준 별점`
              : '내가 받은 별점'}
          />
        </div>

        {/* 5. 한 줄 요약 (장점/개선점) */}
        <div className={styles.summarySection}>
          <div className={styles.sectionLabel}>한 줄 요약</div>
          <ProsConsCards
            good={summary?.good || []}
            improve={summary?.improve || []}
          />
        </div>

        {/* 6. 능력 별 점수 (내가 한 평가 모드에서만 표시) */}
        {isGivenMode && (
          <div className={styles.slidersSection}>
            <div className={styles.sectionLabel}>능력 별 점수</div>
            <CategorySlidersGroup
              items={givenRating ? givenRating.categoryScores : sliders}
              readOnly
              hideDescription={false}
            />
          </div>
        )}

        {/* 7. 평가 코멘트 */}
        <div className={styles.commentsSection}>
          <div className={styles.sectionLabel}>팀원 평가지</div>
          <div className={styles.sectionSubLabel}>
            업무 분담 및 구체적인 역할은 무엇이었나요?
          </div>
          {isGivenMode && givenRating ? (
            <EvaluationCommentCard
              avatar={givenRating.targetMember.avatar}
              text={givenRating.comment}
            />
          ) : (
            comments.length > 0 ? (
              comments.map((c, i) => (
                <EvaluationCommentCard
                  key={i}
                  avatar={c.avatar}
                  text={c.text}
                  onClick={() => navigate(`/evaluation/project/${projectId}/feedback/${c.memberId || i}`)}
                />
              ))
            ) : (
              <div className={styles.emptyComments}>
                받은 평가가 없습니다
              </div>
            )
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default RatingProjectPage;