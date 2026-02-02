import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProjectDetailPage.module.scss';

// 서비스 함수 임포트
import { fetchProjectDetails, fetchReviewSummary, fetchProjectMembers } from '../../services/rating';

// Assets
import BackArrow from '../../components/Common/UI/BackArrow';

const formatDateWithDay = (dateString) => {
  if (!dateString) return '미정';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일(${days[date.getDay()]})`;
};

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [projectData, setProjectData] = useState(null);
  const [ratingData, setRatingData] = useState({ average: 0 }); 
  const [memberCount, setMemberCount] = useState(0); // 🔥 팀원 수 상태 추가
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        
        // 1. 상세정보, 리뷰요약, 팀원정보를 동시에 호출
        const [projectRes, reviewRes, membersRes] = await Promise.all([
          fetchProjectDetails(projectId),
          fetchReviewSummary(projectId).catch(() => ({ data: { averageRating: 0 } })),
          fetchProjectMembers(projectId).catch(() => []) // 🔥 팀원 정보 호출
        ]);
        
        const pData = projectRes.data || projectRes;
        const rData = reviewRes.data || reviewRes;
        const mData = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);

        setProjectData(pData);
        setRatingData({ average: rData.averageRating || rData.average || 0 });
        setMemberCount(mData.length); // 🔥 팀원 배열의 길이 저장

      } catch (err) {

      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) loadAllData();
  }, [projectId]);

  if (isLoading) return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  if (!projectData) return <div className={styles.error}>프로젝트 정보를 찾을 수 없습니다.</div>;

  // 🔥 이미지 존재 여부 확인
  const projectImg = projectData.photo_url || projectData.thumbnail;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <BackArrow />
        </button>
        <h1 className={styles.headerTitle}>나의 프로젝트</h1>
        <div style={{ width: '15px' }} /> 
      </header>

      {/* 🔥 4번 수정: 이미지 등록된 게 있을 때만 렌더링 (없으면 아예 삭제) */}
      {projectImg && (
        <div className={styles.mainImageArea}>
          <img 
            src={projectImg} 
            alt="프로젝트 이미지" 
            className={styles.mainImage} 
          />
        </div>
      )}

      <section className={styles.infoSection}>
        <h2 className={styles.projectTitle}>
          {projectData.title?.replace("[상호평가 완료]", "").trim()}
        </h2>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 기간</span>
            <span className={styles.value}>
              {formatDateWithDay(projectData.start_date)} - {formatDateWithDay(projectData.end_date)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 정보</span>
            {/* 🔥 프로젝트 정보 없으면 없다고 표시 */}
            <span className={styles.value}>
              {projectData.description || '등록된 프로젝트 정보가 없습니다.'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 유형</span>
            <span className={styles.value}>
              {projectData.project_type === 'side' ? '사이드 프로젝트' : '교내 프로젝트'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>참여인원</span>
            <span className={styles.value}>
               {/* 🔥 실시간으로 불러온 팀원 수 반영 */}
               {memberCount > 0 ? `${memberCount}명` : '정보 없음'}
            </span>
          </div>
        </div>

        <div className={styles.tagWrapper}>
          <div className={styles.keywordLabel}>키워드</div>
          <div className={styles.tags}>
            {(projectData.Hashtags || projectData.keywords || []).map((tag, i) => (
              <span key={i} className={styles.tag}>
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.thickDivider} />

      <section className={styles.ratingSection}>
        <h3 className={styles.ratingTitle}>내가 받은 별점</h3>
        <div className={styles.starContainer}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={star <= Math.round(ratingData.average) ? styles.starActive : styles.starInactive}
              >
                ★
              </span>
            ))}
          </div>
          <span className={styles.ratingScore}>
            {Number(ratingData.average).toFixed(1)}
          </span>
        </div>
      </section>
    </div>
  );
}