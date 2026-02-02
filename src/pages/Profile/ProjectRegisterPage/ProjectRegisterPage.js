import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileDetail } from '../../../services/profile';
import styles from './ProjectRegisterPage.module.scss';

// Assets
import BackArrow from '../../../components/Common/UI/BackArrow';
import draftInactive from '../../../assets/draft_inactive.png'; 
import draftActive from '../../../assets/draft_active.png';     

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ProjectRegisterPage() {
  const navigate = useNavigate();
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await getProfileDetail();
        
        if (response.success && response.data && response.data.projects) {
          const allProjects = response.data.projects;

          // 1. 로컬스토리지에서 이미 등록된 ID 목록 가져오기
          const savedIds = JSON.parse(localStorage.getItem('registered_project_ids') || '[]');

          // 2. 필터링 로직
          // 조건 1: 제목에 "[상호평가 완료]" 포함
          // 조건 2: 이미 등록된 ID 목록(savedIds)에 포함되지 않음 (🔥 추가된 로직)
          const validProjects = allProjects.filter(project => {
             const title = String(project.title || "");
             const pId = project.projectId || project.id || project._id;

             const isCompleted = title.includes("[상호평가 완료]");
             const isNotRegistered = !savedIds.includes(pId); // 이미 등록된건 제외

             return isCompleted && isNotRegistered;
          });

          setAvailableProjects(validProjects);
        }
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSelect = (id) => {
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(id);
    }
  };

  const handleSubmit = () => {
    if (!selectedProjectId) return;
    
    try {
        const savedIds = JSON.parse(localStorage.getItem('registered_project_ids') || '[]');
        
        // 중복 체크 후 저장 (혹시 모를 에러 방지)
        if (!savedIds.includes(selectedProjectId)) {
            savedIds.push(selectedProjectId);
            localStorage.setItem('registered_project_ids', JSON.stringify(savedIds));
        }

        alert('프로젝트가 프로필에 등록되었습니다.');
        navigate('/profile'); 
    } catch (error) {

        alert("오류가 발생했습니다.");
    }
  };

  const getProjectType = (type) => {
    if (!type) return "프로젝트"; 
    const upperType = String(type).toUpperCase();
    
    if (upperType.includes('SIDE')) return '사이드 프로젝트';
    if (upperType.includes('CLASS') || upperType.includes('LECTURE')) return '수업 프로젝트';
    if (upperType.includes('TEAM')) return '팀 프로젝트';
    
    return type; 
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <BackArrow />
        </button>
        <div className={styles.headerTitle}>완료된 프로젝트 불러오기</div>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>로딩 중...</div>
        ) : availableProjects.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            불러올 수 있는 프로젝트가 없습니다.<br/>
            <span style={{fontSize: '12px'}}>(불러올 수 있는 프로젝트를 모두 등록했거나 없습니다)</span>
          </div>
        ) : (
          availableProjects.map((project) => {
            const projectId = project.projectId || project.id || project._id;
            const isSelected = selectedProjectId === projectId;
            const displayTitle = (project.title || "").replace("[상호평가 완료]", "").trim();

            return (
              <div 
                key={projectId} 
                className={`${styles.projectCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleSelect(projectId)}
              >
                <div className={styles.cardIconWrapper}>
                  {/* 인라인 스타일 제거 (SCSS 적용을 위해) */}
                  <img 
                    src={isSelected ? draftActive : draftInactive} 
                    alt="문서" 
                  />
                </div>
                
                <div className={styles.cardInfo}>
                  <span className={styles.cardType}>
                    {getProjectType(project.projectType || project.category)}
                  </span>
                  <span className={styles.cardTitle}>{displayTitle}</span>
                </div>

                {isSelected && <CheckIcon className={styles.checkIcon} />}
              </div>
            );
          })
        )}
      </div>

      <div className={styles.bottomButtonContainer}>
        <button 
          className={`${styles.loadButton} ${selectedProjectId ? styles.active : ''}`}
          disabled={!selectedProjectId}
          onClick={handleSubmit}
        >
          불러오기
        </button>
      </div>
    </div>
  );
}