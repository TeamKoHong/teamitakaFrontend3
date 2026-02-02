// src/Pages/ProjectApply/ProjectApplySelect.js
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ProjectApply.scss";

// ✅ 아이콘 추가
import selectIcon from "../../assets/select.png";

// ✅ API 추가
import { submitApplication } from "../../services/recruitment";
import { getMyProjects } from "../../services/projects";

export default function ProjectApplySelect() {
  const nav = useNavigate();
  const location = useLocation();

  // Get data from previous step
  const recruitmentId = location.state?.recruitmentId;
  const introduction = location.state?.introduction;

  // ✅ 변경: 하드코딩 제거, API로 실제 프로젝트 가져오기
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // ✅ 추가: 프로젝트 목록 가져오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);

        // 완료된 프로젝트만 가져오기 (포트폴리오용)
        const result = await getMyProjects({
          status: 'completed',
          limit: 20,
          offset: 0
        });

        // 백엔드 응답을 컴포넌트 형식으로 변환
        const formattedProjects = (result.items || result.projects || []).map(p => ({
          id: p.project_id,  // UUID 형식
          title: p.title,
          thumb: p.photo_url || null,
          description: p.description
        }));

        setProjects(formattedProjects);
      } catch (error) {

        alert('프로젝트 목록을 불러오는데 실패했습니다.');
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    // ✅ 프로젝트 선택은 선택사항 - selected.size === 0 체크 제거

    // Validation
    if (!recruitmentId) {
      alert('모집글 정보가 없습니다. 다시 시도해주세요.');
      nav(-1);
      return;
    }

    if (!introduction || introduction.trim().length === 0) {
      alert('자기소개를 작성해주세요.');
      nav(-1);
      return;
    }

    if (introduction.length > 500) {
      alert('자기소개는 500자 이하로 작성해주세요.');
      nav(-1);
      return;
    }

    try {
      setLoading(true);

      const application = await submitApplication(recruitmentId, {
        introduction: introduction,
        portfolio_project_ids: Array.from(selected)
      });

      nav('/apply2/complete', {
        state: {
          applicationId: application.application_id,
          recruitmentId: application.recruitment_id
        }
      });

    } catch (error) {

      // Handle specific error codes
      switch (error.code) {
        case 'ALREADY_APPLIED':
          alert('이미 지원한 모집글입니다.');
          nav(-1);
          break;
        case 'SELF_APPLICATION':
          alert('본인이 작성한 모집글에는 지원할 수 없습니다.');
          nav(-1);
          break;
        case 'RECRUITMENT_CLOSED':
          alert('마감된 모집글입니다.');
          nav(-1);
          break;
        case 'INVALID_PORTFOLIO':
          alert('유효하지 않은 포트폴리오 프로젝트가 포함되어 있습니다.');
          break;
        case 'UNAUTHORIZED':
          alert('로그인이 필요합니다.');
          nav('/login');
          break;
        case 'RECRUITMENT_NOT_FOUND':
          alert('모집글을 찾을 수 없습니다.');
          nav(-1);
          break;
        case 'INVALID_INPUT':
          alert(error.message || '입력 정보가 올바르지 않습니다.');
          break;
        default:
          alert('지원서 제출에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-page apply-select">
      <div className="topbar">
        <button className="link" onClick={() => nav(-1)}>취소</button>
        <div className="title">보여줄 프로젝트</div>
        <div className="spacer" />
      </div>

      <div className="container">
        <div className="section">
          <div className="eyebrow">보여줄 프로젝트</div>
          <h1 className="headline">
            나를 어필할 수 있는<br />프로젝트가 있다면 선택해주세요.
          </h1>
          <p className="sub">선택한 프로젝트는 팀장이 열람할 수 있어요. (선택사항)</p>

          <hr className="divider" />

          <div className="list-title">나의 프로젝트</div>

          {/* ✅ 로딩 상태 */}
          {loadingProjects ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p>프로젝트를 불러오는 중...</p>
            </div>
          ) : projects.length === 0 ? (
            /* ✅ 빈 상태 - 프로젝트 없이도 지원 가능 */
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p>완료된 프로젝트가 없습니다.</p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
                프로젝트가 없어도 지원할 수 있어요!
              </p>
            </div>
          ) : (
            /* ✅ 프로젝트 목록 */
            <div className="grid">
              {projects.map(p => {
                const isOn = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`card ${isOn ? "on" : ""}`}
                    onClick={() => toggle(p.id)}
                  >
                    <div className="thumb">
                      <div className="thumb-placeholder">
                        <span className="img-icon" aria-hidden />
                      </div>
                    </div>
                    <div className="title">{p.title}</div>

                    {/* ✅ 중앙 아이콘 */}
                    {isOn && (
                      <div className="center-icon">
                        <img src={selectIcon} alt="선택됨" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="footer footer--gray">
        <button
          className={`cta ${!loading ? "active" : "disabled"}`}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? '제출 중...' : '지원서 보내기'}
        </button>
      </div>
    </div>
  );
}
