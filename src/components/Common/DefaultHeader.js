import React from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../Common/UI/BackArrow";
import GroupChatIcon from "../Common/UI/GroupChatIcon";
import "./DefaultHeader.scss";

export default function DefaultHeader({
  title,
  showChat = false,
  onChatClick,
  backPath = -1, // useNavigate() 에 넘길 값을 기본으로
  onBack, // 슬라이드 닫기
  rightElement, // Custom right element (e.g., Close button)
  className = "",
  style = {},
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className={`member-header-container ${className}`} style={style}>
      {(onBack !== undefined || (backPath !== undefined && backPath !== null)) && (
        <button
          className="member-header-back"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <BackArrow />
        </button>
      )}
      <h1 className="member-header-title">{title}</h1>
      {rightElement ? (
        <div className="member-header-chat--placeholder">
          {rightElement}
        </div>
      ) : showChat ? (
        <button
          className="member-header-chat"
          onClick={onChatClick}
          aria-label="채팅열기"
        >
          <GroupChatIcon />
        </button>
      ) : (
        <div className="member-header-chat--placeholder" />
      )}
    </div>
  );
}
