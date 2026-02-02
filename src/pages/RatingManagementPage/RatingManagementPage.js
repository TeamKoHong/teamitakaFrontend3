// src/pages/RatingManagementPage/RatingManagementPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RatingManagementPage.module.scss';
import ProjectRatingCard from '../../components/RatingManagement/ProjectRatingCard/ProjectRatingCard';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import DefaultHeader from '../../components/Common/DefaultHeader';

// RatingTabs 컴포넌트 임포트
import RatingTabs from '../../components/RatingManagement/RatingTabs/RatingTabs';
import { fetchUserProjects } from '../../services/rating';

function RatingManagementPage() {
  const navigate = useNavigate();
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 탭 상태: 'received' (내가 받은 평가) 또는 'given' (내가 한 평가)
  const [activeTab, setActiveTab] = useState('received'); // 초기값: 내가 받은 평가

  // === 새로 추가된 정렬 관련 상태 ===
  const [sortBy] = useState('createdAt'); // 기본 정렬 기준: 생성일
  const [sortOrder, setSortOrder] = useState('desc'); // 기본 정렬 방향: 내림차순 (최신순)

  // '최신순' 버튼 클릭 시 정렬 방향을 토글하는 핸들러
  const handleSortToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        // 실제 API 연동 시 fetchUserProjects를 호출
        const projects = await fetchUserProjects(activeTab, sortBy, sortOrder);
        setUserProjects(projects);
      } catch (err) {
        setError("프로젝트 정보를 불러오는데 실패했습니다.");

      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, [activeTab, sortBy, sortOrder]);

  const handleCardClick = (projectId) => {
    navigate(`/project/${projectId}/rating-project`);
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <DefaultHeader title="프로젝트 평가" /> {/* 헤더 타이틀을 '프로젝트 평가'로 변경 */}
      <div className={styles.content}>
        {/* RatingTabs 컴포넌트에 정렬 관련 prop 전달 */}
        <RatingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortBy={sortBy} // RatingTabs로 prop 전달
          sortOrder={sortOrder} // RatingTabs로 prop 전달
          onSortToggle={handleSortToggle} // RatingTabs로 prop 전달
        />

        <div className={styles.projectList}>
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
              <ProjectRatingCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project.id, project.myRatingStatus || null)}
              />
            ))
          ) : (
            <p className={styles.noProjects}>
              {activeTab === 'received' ? "받은 평가가 없습니다." : "아직 평가할 프로젝트가 없습니다."}
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default RatingManagementPage;