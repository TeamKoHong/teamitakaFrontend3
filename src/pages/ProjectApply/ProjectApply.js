// src/Pages/ProjectApply/ProjectApply.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ProjectApply.scss";

export default function ProjectApply() {
  const nav = useNavigate();
  const location = useLocation();
  const [text, setText] = useState("");

  // Get recruitmentId from RecruitmentViewPage
  const recruitmentId = location.state?.projectId;

  const MAX = 300;
  const len = text.trim().length;
  const isValid = len > 0 && len <= MAX;

  const handleNext = () => {
    if (!isValid) return;
    nav('/apply2/select', {
      state: {
        recruitmentId,
        introduction: text.trim()
      }
    });
  };

  return (
    <div className="apply-page">
      {/* 상단바 (항상 흰색) */}
      <div className="topbar">
        <button className="link" onClick={() => nav(-1)}>취소</button>
        <div className="title">자기소개</div>
        <div className="spacer" />
      </div>

      {/* 본문 */}
      <div className="container">
        <div className="section">
          <div className="eyebrow">자기소개</div>
          <h1 className="headline">
            팀장이 나를 뽑을 수 있도록<br />나에 대해 설명해주세요.
          </h1>
          <p className="sub">이력서의 하이라이트에요! 나를 표현해주세요.</p>

          <hr className="divider" />

          <div className={`editor ${isValid ? "filled" : ""}`}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={MAX}
              placeholder="300자 내외로 작성할 수 있어요."
            />
          </div>

          <div className="meta">
            <span className="count">{len}/{MAX}</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="footer">
        <button
          type="button"
          className={`cta ${isValid ? "active" : "disabled"}`}
          disabled={!isValid}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}
