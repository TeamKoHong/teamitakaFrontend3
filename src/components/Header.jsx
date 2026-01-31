import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import BackArrow from "./Common/UI/BackArrow";

export default function Header({ title = "프로필 편집", onBack, rightAction, backPath = -1 }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <button
          className="back-button"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <BackArrow />
        </button>
      </div>
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        {rightAction}
      </div>
    </div>
  );
}
