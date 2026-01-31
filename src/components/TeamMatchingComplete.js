import React, { useState } from "react";
import "./TeamMatchingComplete.scss";
import DefaultHeader from "./Common/DefaultHeader";
import userDefaultImg from "../assets/icons/user_default_img.svg";
import KickoffSlide from "./Kickoff/KickoffSlide";

export default function TeamMatchingComplete({ open, onClose, selectedMembers, recruitmentId }) {
  const [kickoffOpen, setKickoffOpen] = useState(false);

  const handleNext = () => {
    // 킥오프 슬라이드 열기
    setKickoffOpen(true);
  };

  const handleKickoffClose = () => {
    setKickoffOpen(false);
    // 킥오프가 닫히면 팀 매칭 완료도 닫기
    onClose();
  };

  return (
    <>
      <div className={`tmc-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`tmc-panel ${open ? "open" : ""}`}>
        <DefaultHeader title="팀 매칭 완료" onBack={onClose} />
        
        <div className="tmc-content">
          <div className="tmc-members">
            {selectedMembers && selectedMembers.length > 0 ? (
              selectedMembers.map((member) => (
                <div key={member.id} className="tmc-member-card">
                  <img 
                    src={member.img || userDefaultImg} 
                    alt={member.name} 
                    className="tmc-member-avatar"
                  />
                </div>
              ))
            ) : (
              <p className="tmc-empty">선택된 팀원이 없습니다.</p>
            )}
          </div>

          <div className="tmc-message">
            <div className="tmc-title">
              팀 매칭이 <span className="highlight">완료</span>되었어요!
            </div>
            <p className="tmc-subtitle">
              킥오프를 작성해 팀원을 시작해보세요.
            </p>
          </div>
        </div>
        <div className="tmc-footer">
          <button 
            className="tmc-button active"
            onClick={handleNext}
          >
            킥오프 작성하기
          </button>
        </div>
      </div>

      {/* 킥오프 작성 슬라이드 */}
      <KickoffSlide
        open={kickoffOpen}
        onClose={handleKickoffClose}
        selectedMembers={selectedMembers}
        recruitmentId={recruitmentId}
      />
    </>
  );
}

