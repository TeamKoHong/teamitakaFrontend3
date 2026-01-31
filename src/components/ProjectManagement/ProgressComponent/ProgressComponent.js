import React, { useEffect, useState } from "react";
import ProjectCard from "../Common/ProjectCard";
import SectionHeader from "../Common/SectionHeader";
import { getMyProjects } from "../../../services/projects";
import { useNavigate } from "react-router-dom";
import "./ProgressComponent.scss";

function ProgressComponent() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyProjects({ status: 'ongoing', limit: page.limit || 10, offset: nextOffset });
      if (res?.success) {
        setItems(nextOffset === 0 ? res.items : [...items, ...res.items]);
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
    load(0); // 최초 로드
    // eslint-disable-next-line
  }, []);

  const canLoadMore = items.length < (page.total || 0);

  return (
    <div className="progress-container">
      {isLoading && items.length === 0 && (
        <div className="loading-state">불러오는 중...</div>
      )}
      
      {error && (
        <div className="error-state">
          <p style={{ color: '#F76241', marginBottom: '12px' }}>{error}</p>
          <button onClick={() => load(page.offset || 0)}>다시 시도</button>
        </div>
      )}
      
      {!isLoading && !error && items.length === 0 && (
        <div className="empty-state">
          <h3 className="empty-title">진행 중인 프로젝트가 없어요</h3>
          <p className="empty-description">
            모집글을 작성하고 프로젝트를 시작해보세요.
          </p>
          <button className="create-project-btn" onClick={() => navigate('/recruit')}>
            프로젝트 모집하기
          </button>
        </div>
      )}
      
      {!isLoading && !error && items.length > 0 && (
        <>
          <section className="project-info">
            <SectionHeader
              explainText={`팀원들과 함께 프로젝트를 공유하고\n티미타카 해보세요!`}
              highlightText="티미타카"
              filterOptions={[
                { value: "latest", label: "최신순" },
                { value: "date", label: "날짜순" },
                { value: "meeting", label: "회의 빠른 순" },
              ]}
              onFilterChange={(e) => console.log(e.target.value)}
            />
          </section>
          
          <section className="project-list">
            {items.map((p) => (
              <ProjectCard key={p.project_id} project={p} type="project" />
            ))}
          </section>
          
          {canLoadMore && !isLoading && (
            <div className="load-more-wrapper">
              <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>더 보기</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProgressComponent;
