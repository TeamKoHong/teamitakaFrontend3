import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectRecruitPublish.scss";
import { loadRecruitDraft, clearRecruitDraft } from "../../../api/recruit";
import { createRecruitment, uploadRecruitmentImage } from "../../../services/recruitment";

// Helper function to convert dataURL to File
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function ProjectRecruitPublish() {
  const nav = useNavigate();
  const { state } = useLocation();
  const redirectTo = state?.redirectTo || "/recruit";
  const [error, setError] = useState(null);

  useEffect(() => {
    const publishProject = async () => {
      try {
        // 1. localStorage에서 draft 읽기
        const draft = loadRecruitDraft();
        if (!draft || !draft.title) {
          throw new Error("모집 정보가 없습니다. 다시 시도해주세요.");
        }

        // 2. 이미지가 있으면 먼저 업로드
        let photo_url = null;
        if (draft.coverImage?.dataUrl) {
          try {
            const imageFile = dataURLtoFile(draft.coverImage.dataUrl, 'recruitment-image.jpg');
            photo_url = await uploadRecruitmentImage(imageFile);
            console.log("✅ Image uploaded:", photo_url);
          } catch (imgErr) {
            console.warn("⚠️ Image upload failed, continuing without image:", imgErr);
            // 이미지 업로드 실패해도 모집공고는 생성 (이미지는 선택사항)
          }
        }

        // 3. 백엔드 API 형식으로 변환
        const recruitmentData = {
          title: draft.title,
          description: draft.desc || "",
          project_type: draft.type || null,
          recruitment_start: draft.start || null,
          recruitment_end: draft.end || null,
          photo: photo_url || null,
          max_applicants: 10, // 기본값
          hashtags: draft.keywords || [], // 해시태그 (백엔드가 # 자동 제거)
          // status는 백엔드 Model에서 defaultValue: 'ACTIVE'로 자동 설정됨
        };

        // 4. API 호출
        const result = await createRecruitment(recruitmentData);
        console.log("✅ Recruitment created:", result);

        // 5. localStorage draft 삭제
        clearRecruitDraft();

        // 6. 완료 페이지로 이동
        nav("/recruit/publish/done", {
          state: {
            redirectTo,
            recruitmentId: result.recruitment_id
          }
        });
      } catch (err) {
        console.error("🚨 Recruitment creation error:", err);

        // 에러 처리
        if (err.code === "UNAUTHORIZED") {
          alert("로그인이 필요합니다.");
          nav("/login", { state: { from: "/recruit/publish" } });
        } else {
          setError(err.message || "모집글 생성에 실패했습니다.");
        }
      }
    };

    publishProject();
  }, [nav, redirectTo]);

  // 에러 화면
  if (error) {
    return (
      <div className="publish-page">
        <div className="publish-body">
          <h1 className="loading-title">
            <span className="accent">오류가 발생했습니다</span>
          </h1>
          <p className="loading-sub">{error}</p>
          <button
            className="retry-btn"
            onClick={() => nav(-1)}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#ff6b35",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 화면
  return (
    <div className="publish-page">
      <div className="publish-body">
        <h1 className="loading-title">
          <span className="accent">팀원 모집글을</span><br />
          업로드 하고 있어요
        </h1>
        <p className="loading-sub">잠시만 기다려주세요!</p>

        <div className="dots" aria-label="로딩 중">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
