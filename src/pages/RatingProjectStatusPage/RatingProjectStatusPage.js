import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import styles from './RatingProjectStatusPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import { fetchProjectStatus } from '../../services/rating';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';

import RatingSummaryCard from '../../components/RatingManagement/RatingSummaryCard/RatingSummaryCard';
import ProjectSummaryCard from '../../components/RatingProjectPage/ProjectSummaryCard';
import ProjectResultCard from '../../components/RatingProjectPage/ProjectResultCard';
import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import EvaluationCompletedInfoCard from '../../components/RatingProjectPage/EvaluationCompletedInfoCard';

function RatingProjectStatusPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isGiven = location.pathname.endsWith('/given');
  const isReceived = location.pathname.endsWith('/received');
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllRoles, setShowAllRoles] = React.useState(false);

  useEffect(() => {
    const getProjectStatus = async () => {
      setLoading(true);
      try {
        const status = await fetchProjectStatus(projectId);
        setProjectStatus(status);
      } catch (err) {
        setError("평가 현황을 불러오는데 실패했습니다.");
        console.error("Failed to fetch project status:", err);
      } finally {
        setLoading(false);
      }
    };
    getProjectStatus();
  }, [projectId]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  if (!projectStatus) {
    return <div className={styles.noData}>평가 현황 데이터를 찾을 수 없습니다.</div>;
  }

  const projectSummary = location.state && location.state.projectSummary ? location.state.projectSummary : null;
  const meta = {
    name: projectSummary?.name ?? projectStatus.name,
    period: projectSummary?.period ?? projectStatus.period ?? '기간 정보 없음',
    meetingTime: projectSummary?.meetingTime ?? projectStatus.meetingTime ?? '미팅 정보 없음',
    avatars: projectSummary?.avatars ?? projectStatus.avatars ?? [],
    dday: projectSummary?.dday ?? projectStatus.dday ?? { value: 0, percent: 0 },
    resultLink: projectSummary?.resultLink ?? projectStatus.resultLink ?? '',
  };

  return (
    <div className={styles.container}>
      <DefaultHeader title="평가 현황" />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>{projectStatus.name}</h1>
        {/* 탭은 given일 때만 노출 */}
        {isGiven && (
          <div className={styles.detailTabs}>
            <button
              className={isReceived ? styles.active : ''}
              onClick={() => { navigate(`/project/${projectId}/rating-status/received`); }}
            >
              내가 받은 평가
            </button>
            <button
              className={isGiven ? styles.active : ''}
              onClick={() => { navigate(`/project/${projectId}/rating-status/given`); }}
            >
              내가 한 평가
            </button>
          </div>
        )}
        {/* 받은 평가만 보여줌 */}
        {isReceived && (
          <div className={styles.receivedDetailPage}>
            {/* 프로젝트 정보 카드 (상단) */}
            <div style={{ marginBottom: 24 }}>
              <ProjectInfoCard
                name={meta.name}
                period={meta.period}
                meetingTime={meta.meetingTime}
                avatars={meta.avatars}
                dday={meta.dday}
                id={projectStatus.id}
              />
            </div>

            {/* 프로젝트 결과물 */}
            {meta.resultLink && (
              <div className={styles.sectionCard + ' ' + styles.card}>
                <ProjectResultCard resultLink={meta.resultLink} />
              </div>
            )}

            {/* 내가 받은 별점 */}
            <div className={styles.sectionCard + ' ' + styles.card}>
              <h2 className={styles.sectionTitle}>내가 받은 별점</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <RatingInputStars initialRating={projectStatus.averageRating ?? 0} maxStars={5} readOnly />
                <span style={{ color: '#f76241', fontWeight: 700 }}>
                  {(projectStatus.averageRating ?? 0).toFixed(1)}
                </span>
              </div>
            </div>
            {/* 카테고리별 평균/총점 카드: 재사용 컴포넌트로 대체 */}
            <div className={styles.sectionCard + ' ' + styles.card + ' ' + styles.categorySummaryCard}>
              <h2 className={styles.sectionTitle}>카테고리별 평균</h2>
              <RatingSummaryCard
                totalScore={projectStatus.averageRating}
                categories={(projectStatus.categories || []).map(c => ({ name: c.name, score: c.average }))}
              />
            </div>
            {/* 팀원별 평가 상세 카드 */}
            <div className={styles.sectionCard + ' ' + styles.card + ' ' + styles.memberReviewCardSection}>
              <h2 className={styles.sectionTitle}>팀원별 평가 상세</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {(projectStatus.individualReviews || []).map((review, idx) => (
                  <EvaluationCompletedInfoCard
                    key={review.id || idx}
                    reviewerName={review.reviewerName || `익명${idx + 1}`}
                    categories={review.categories || []}
                    averageScore={review.averageScore}
                    comment={review.comment}
                    reviewId={review.id}
                  />
                ))}
              </div>
            </div>

            {/* 한 줄 요약 */}
            {(projectStatus.summary?.good?.length || projectStatus.summary?.improve?.length) && (
              <div className={styles.sectionCard + ' ' + styles.card}>
                <h2 className={styles.sectionTitle}>한 줄 요약</h2>
                <ProjectSummaryCard
                  good={projectStatus.summary?.good ?? []}
                  improve={projectStatus.summary?.improve ?? []}
                />
              </div>
            )}

            {/* 팀원 평가지 - 역할 */}
            {(projectStatus.roles?.length) && (
              <div className={styles.sectionCard + ' ' + styles.card}>
                <h2 className={styles.sectionTitle}>팀원 평가지</h2>
                <div className={styles.sectionSubTitle}>업무 분담 및 구체적인 역할은 무엇이었나요?</div>
                {(projectStatus.roles ?? []).slice(0, showAllRoles ? undefined : 2).map((role, idx) => (
                  <div className={styles.roleCard} key={idx}>{role}</div>
                ))}
                {(projectStatus.roles?.length ?? 0) > 2 && (
                  <button className={styles.showMoreBtn} onClick={() => setShowAllRoles(v => !v)}>
                    {showAllRoles ? '상세 내용 접기 ▲' : '상세 내용 더보기 ▼'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {/* 내가 한 평가 탭 분기 */}
        {isGiven && (
          projectStatus.myRatingStatus === 'PENDING' ? (
            <Navigate to={`/project/${projectId}/rating-project`} replace />
          ) : (
            (() => {
              // 더미 데이터 예시 (실제 API 연동 시 서비스로 이동 예정)
              const myGiven = {
                good: [
                  "업무 능력이 뛰어나요.",
                  "열정이 넘치는 팀원이에요."
                ],
                improve: [
                  "의사 소통이 원활하면 좋겠어요.",
                  "열심히 성장하는 모습이 필요해요."
                ],
                roles: [
                  "구체적인 역할은 어쩌구어쩌구 입니다.",
                  "구체적인 역할은 어쩌구어쩌구 입니다."
                ]
              };
              const visibleRoles = showAllRoles ? myGiven.roles : myGiven.roles.slice(0, 2);
              return (
                <section className={styles.givenResultSection}>
                  <h2 className={styles.sectionTitle}>내가 남긴 평가</h2>
                  <ProjectSummaryCard good={myGiven.good} improve={myGiven.improve} />
                  <div className={styles.givenDetailSection}>
                    <h3 className={styles.sectionSubTitle}>업무 분담 및 구체적인 역할은 무엇이었나요?</h3>
                    {visibleRoles.map((role, idx) => (
                      <div className={styles.roleCard} key={idx}>{role}</div>
                    ))}
                    {myGiven.roles.length > 2 && (
                      <button className={styles.showMoreBtn} onClick={() => setShowAllRoles(v => !v)}>
                        {showAllRoles ? '상세 내용 접기 ▲' : '상세 내용 더보기 ▼'}
                      </button>
                    )}
                  </div>
                </section>
              );
            })()
          )
        )}
      </div>
    </div>
  );
}

export default RatingProjectStatusPage;