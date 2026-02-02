import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecruitment } from "../../services/recruitment";
import RecruitingProject from "../../components/RecruitingProject";
import ApplicantListSlide from "../../components/ApplicantListSlide";
import "./TeamSelectPage.scss";

export default function TeamSelectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicantSlide, setShowApplicantSlide] = useState(false);

  useEffect(() => {
    const fetchRecruitment = async () => {
      if (!id) {
        setError("모집글 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {

        const data = await getRecruitment(id);

        setRecruitment(data);
      } catch (err) {

        setError(err.message);
        if (err.code === "UNAUTHORIZED") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitment();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="team-select-page loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-select-page error">
        <p>에러: {error}</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  }

  return (
    <div className="team-select-page">
      <RecruitingProject
        recruitment={recruitment}
        onSelectTeam={() => setShowApplicantSlide(true)}
      />
      <ApplicantListSlide
        open={showApplicantSlide}
        onClose={() => setShowApplicantSlide(false)}
        recruitmentId={id}
      />
    </div>
  );
}
