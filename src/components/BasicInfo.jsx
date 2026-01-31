import React from "react";
import "./BasicInfo.css";
import verifiedIcon from "../assets/university_verified.png";   // ← 반드시 이 파일명과 일치해야 함

export default function BasicInfo({
  name = "김조형",
  email = "0000@school.com",
  university = "홍익대학교",
  showVerified = true
}) {
  return (
    <div className="basic-info-container">
      <div className="section-title">기본정보</div>

      <div className="info-row">
        <span className="info-label">이름
             <span className="required-dot" />
        </span>
        <span className="info-value">{name}</span>
      </div>

      <div className="info-row">
        <span className="info-label">이메일주소</span>
        <span className="info-value">{email}</span>
      </div>

      <div className="info-row">
        <span className="info-label">학교</span>
        <span className="info-value">
          {university}
          {showVerified && (
            <img src={verifiedIcon} alt="" className="verified-icon" />
          )}
        </span>
      </div>
    </div>
  );
}
