import React from "react";
import DefaultHeader from "./Common/DefaultHeader";
import RecruitingProject from "./RecruitingProject";
import "./RecruitingProjectSlide.scss";

export default function RecruitingProjectSlide({ open, onClose, recruitment, onSelectTeam }) {
  return (
    <>
      {/* 1) 오버레이 */}
      <div className={`rps-overlay ${open ? "open" : ""}`} onClick={onClose} />

      {/* 2) 오른쪽 패널 */}
      <div className={`rps-panel ${open ? "open" : ""}`}>
        {/* 헤더 (뒤로가기 → onClose 실행) */}
        <DefaultHeader
          title="모집 중인 프로젝트"
          showChat={false}
          onBack={onClose}
        />

        <RecruitingProject recruitment={recruitment} onSelectTeam={onSelectTeam} />
      </div>
    </>
  );
}
