import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectDetails } from "../../services/projects";
import MainFloatingBox from "../../components/ProjectDetailPage/MainFloatingBox";
import ProjectDetailHeader from "../../components/ProjectDetailPage/ProjectDetailHeader";
import TodoBox from "../../components/ProjectDetailPage/TodoBox";
import ProjectDetailSlideBox from "../../components/ProjectDetailPage/ProjectDetailSlideBox";
import "./ProjectDetailPage.scss";

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError("프로젝트 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 [ProjectDetailPage] Fetching project:", id);
        const data = await fetchProjectDetails(id);
        console.log("✅ [ProjectDetailPage] Project data:", data);
        setProject(data);
      } catch (err) {
        console.error("❌ [ProjectDetailPage] Error:", err);
        setError(err.message);
        if (err.code === "UNAUTHORIZED") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="project-detail-page-container loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page-container error">
        <p>에러: {error}</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  }

  return (
    <div className="project-detail-page-container">
      <ProjectDetailHeader projectName={project?.title || "프로젝트명"} />
      <MainFloatingBox projectId={id} />
      <ProjectDetailSlideBox project={project} />
      <TodoBox projectId={id} />
    </div>
  );
}

export default ProjectDetailPage;
