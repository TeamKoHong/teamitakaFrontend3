import React, { useEffect } from "react";
import "./CompletedComponent.scss";

import UnratedProjectCard from "../UnratedProjectCard/UnratedProjectCard";
import CompletedProjectSimpleCard from "../CompletedProjectSimpleCard/CompletedProjectSimpleCard";
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Common/AlertModal';
import { fetchEvaluationTargets } from '../../../services/rating';
import { useAuth } from '../../../contexts/AuthContext';
import { getMyProjects } from '../../../services/projects';
import { deriveCompletedProjects, splitByEvaluationStatus } from '../../../utils/projectFilters';
import { getTeamMemberEvaluationUrl } from '../../../constants/routes';
import { transformProjectForEvaluation } from '../../../utils/projectTransform';

const CompletedComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Single source of truth: server response
  const [serverProjects, setServerProjects] = React.useState([]);

  const [page, setPage] = React.useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalProject] = React.useState(null);

  // SINGLE PIPELINE: Derive UI list from server data
  const completedProjects = deriveCompletedProjects(serverProjects, { sortOrder: 'latest' });

  // Split for display sections
  const { pending: pendingProjects, completed: completedProjectsDisplay } = splitByEvaluationStatus(completedProjects);

  const handleCompletedItemClick = (project) => {
    // 평가 완료 프로젝트는 평가 결과 조회 페이지로 이동
    // API 데이터를 UI 형식으로 변환
    const transformedProject = transformProjectForEvaluation(project);

    navigate(`/evaluation/project/${project.project_id}`, {
      state: { projectSummary: transformedProject, from: { path: '/project-management', tab: 'completed' } },
    });
  };

  const handleEvaluateClick = async (project) => {
    // 평가 대기 프로젝트는 팀원 평가 페이지로 이동
    try {
      if (!user || !user.userId) {
        console.error('사용자 정보 없음');
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const evalData = await fetchEvaluationTargets(project.project_id, user.userId);

      if (evalData.nextPendingMember) {
        // 평가할 팀원이 있음 → 평가 폼으로 이동
        navigate(getTeamMemberEvaluationUrl(project.project_id, evalData.nextPendingMember.id), {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else if (evalData.allCompleted) {
        // 모든 평가 완료 → 프로젝트 평가 결과 페이지로
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else if (evalData.targets && evalData.targets.length === 0) {
        // 평가할 팀원이 없음 (1인 프로젝트) → 결과 페이지로
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else {
        // 예상치 못한 상태 - 평가 상태 페이지로 이동
        navigate(`/evaluation/status/${project.project_id}/received`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      }
    } catch (error) {
      console.error('❌ 평가 대상 조회 실패:', error);
      // 에러 발생 시 사용자에게 알림
      alert('평가 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const load = async (nextOffset = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await getMyProjects({
        status: 'completed',
        limit: page.limit || 10,
        offset: nextOffset
      });

      if (res?.success) {
        const newItems = res.items || [];

        // Update server projects (single source of truth)
        if (nextOffset === 0) {
          setServerProjects(newItems);
        } else {
          setServerProjects(prev => [...prev, ...newItems]);
        }

        setPage(res.page || { total: 0, limit: 10, offset: nextOffset });
      } else {
        throw new Error('SERVER_ERROR');
      }
    } catch (e) {
      if (e?.code === 'UNAUTHORIZED') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      setError('일시적인 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(0); // eslint-disable-next-line
  }, []);

  const canLoadMore = serverProjects.length < (page.total || 0);

  const hasNoProjects = !isLoading && !error && serverProjects.length === 0;
  // const hasProjects = pendingProjects.length > 0 || completedProjectsDisplay.length > 0;

  return (
    <div className="completed-container">
      {/* 로딩 상태 */}
      {isLoading && serverProjects.length === 0 && (
        <div className="loading-state">불러오는 중...</div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="error-state">
          <p style={{ color: '#F76241', marginBottom: '12px' }}>{error}</p>
          <button onClick={() => load(page.offset || 0)}>다시 시도</button>
        </div>
      )}

      {/* 빈 상태 */}
      {hasNoProjects && (
        <div className="empty-state">
          <h3 className="empty-title">완료된 프로젝트가 없어요</h3>
          <p className="empty-description">
            프로젝트를 완료하면 여기에 표시됩니다.
          </p>
          <button className="create-project-btn" onClick={() => navigate('/recruit')}>
            프로젝트 모집하기
          </button>
        </div>
      )}

      {/* 평가 대기 프로젝트 섹션 */}
      {pendingProjects.length > 0 && (
        <div className="project-section pending-section">
          {/* Header removed as per Figma/Instruction if not explicitly requested, or adding simplistic header */}
          <h4 className="section-header-title">
            팀원 평가가 이뤄지지 않은 <br />
            프로젝트가 {pendingProjects.length}개 있어요!
          </h4>

          <div className="project-list-grid">
            {pendingProjects.map((project) => (
              <UnratedProjectCard
                key={project.project_id}
                project={project}
                onClick={() => handleEvaluateClick(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 완료 프로젝트 섹션 */}
      {completedProjectsDisplay.length > 0 && (
        <div className="project-section completed-list-section">
          <h4 className="section-header-title">완료 프로젝트</h4>

          <div className="project-list-grid">
            {completedProjectsDisplay.map((project) => (
              <CompletedProjectSimpleCard
                key={project.project_id}
                project={project}
                onClick={() => handleCompletedItemClick(project)}
              />
            ))}
          </div>
        </div>
      )}

      {canLoadMore && !isLoading && (
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <button onClick={() => load((page.offset || 0) + (page.limit || 10))} className="load-more-btn">
            더 보기
          </button>
        </div>
      )}

      <AlertModal
        isOpen={isModalOpen}
        title="상호평가 완료 후 열람 가능해요"
        description="지금 상호 평가를 작성하시겠어요?"
        primaryLabel="작성하기"
        secondaryLabel="나중에 하기"
        onPrimary={async () => {
          if (!modalProject || !user || !user.userId) return;
          try {
            const evalData = await fetchEvaluationTargets(modalProject.id, user.userId);
            if (evalData.nextPendingMember) {
              navigate(getTeamMemberEvaluationUrl(modalProject.id, evalData.nextPendingMember.id), {
                state: { projectSummary: modalProject, from: { path: '/project-management', tab: 'completed' } },
              });
            } else {
              navigate(`/evaluation/project/${modalProject.id}`, {
                state: { projectSummary: modalProject, from: { path: '/project-management', tab: 'completed' } },
              });
            }
          } finally {
            setModalOpen(false);
          }
        }}
        onSecondary={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CompletedComponent;
