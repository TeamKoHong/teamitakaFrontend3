import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ReceivedFeedbackDetailPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import DetailCommentCard from '../../components/RatingProjectPage/DetailCommentCard';
import ReadOnlyProgressBar from '../../components/RatingProjectPage/ReadOnlyProgressBar';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import { fetchProjectReviews, mapCategoryScores } from '../../services/rating';

/**
 * 내가 받은 평가지 상세 페이지
 * - 특정 팀원이 남긴 평가 상세 정보를 표시
 * - 코멘트와 카테고리별 점수를 함께 표시
 */
export default function ReceivedFeedbackDetailPage() {
  const { projectId, memberId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReviewDetail() {
      setLoading(true);
      try {
        // Since we don't have a single review fetch endpoint yet, fetches all and filters
        const reviews = await fetchProjectReviews(projectId);

        if (!Array.isArray(reviews)) {
          throw new Error('평가 데이터 형식이 올바르지 않습니다.');
        }

        // Find the specific review where the reviewer is 'memberId'
        // Note: memberId param seems to be reviewer's ID based on previous usage
        const foundReview = reviews.find(r => r.reviewer_id === memberId);

        if (foundReview) {
          setReview(foundReview);
        } else {
          setError('해당 평가를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('평가 상세 조회 실패:', err);
        setError('평가 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadReviewDetail();
  }, [projectId, memberId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigateToGiven = () => {
    navigate(`/evaluation/project/${projectId}/given`);
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!review) return <div className={styles.error}>평가 데이터가 없습니다.</div>;

  // Transform backend data to frontend format
  const categoryScores = mapCategoryScores(review);
  const sliders = [
    { name: '참여도', value: categoryScores.participation },
    { name: '소통', value: categoryScores.communication },
    { name: '책임감', value: categoryScores.responsibility },
    { name: '협력', value: categoryScores.collaboration },
    { name: '개인 능력', value: categoryScores.individualAbility }
  ];

  return (
    <div className={styles.pageBg}>
      <DefaultHeader
        title="내가 받은 평가지"
        onBack={handleBack}
        rightElement={
          <button className={styles.headerBtn} onClick={handleNavigateToGiven}>
            내가 한 평가
          </button>
        }
      />

      <div className={styles.scrollArea}>
        {/* 평가자 코멘트 */}
        <section className={styles.commentSection}>
          <DetailCommentCard
            avatar={null} // Avatar might need to be fetched separately if not in review object
            text={review.comment || '남겨진 코멘트가 없습니다.'}
            reviewerName={review.reviewer_username}
          />
        </section>

        {/* 카테고리별 점수 */}
        <section className={styles.slidersSection}>
          <h2 className={styles.sectionLabel}>카테고리별 점수</h2>
          <div className={styles.sliderCards}>
            {sliders.map((item, i) => (
              <div key={i} className={styles.sliderCard}>
                <ReadOnlyProgressBar label={item.name} value={item.value} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
