import React, { useState } from "react";
import "./TeamExperience.css";
import MinusIcon from "../assets/minus.png";
import PlusIcon from "../assets/plus.png";

export default function TeamExperience({ value, onChange }) {
  // 내부 상태 (props 없을 때 사용 - 기존 동작 유지)
  const [internalCount, setInternalCount] = useState(0);

  // controlled vs uncontrolled 모드 판단
  const isControlled = value !== undefined && onChange !== undefined;
  const currentCount = isControlled ? value : internalCount;

  // 증가/감소 함수
  const increase = () => {
    const newValue = currentCount + 1;
    if (isControlled) {
      onChange(newValue);
    } else {
      setInternalCount(newValue);
    }
  };

  const decrease = () => {
    const newValue = currentCount > 0 ? currentCount - 1 : 0;
    if (isControlled) {
      onChange(newValue);
    } else {
      setInternalCount(newValue);
    }
  };

  return (
    <div className="team-exp-container">

      {/* 라벨 */}
      <div className="team-exp-label">나의 팀플 경험</div>

      {/* 입력 박스 */}
      <div className="team-exp-box">
        <span className="team-exp-text">팀플 경험 횟수</span>

        <div className="team-exp-counter">
          <img
            src={MinusIcon}
            alt="minus"
            className="team-exp-icon"
            onClick={decrease}
            style={{ cursor: 'pointer' }}
          />

          {/* 숫자 표시 (00 형태 유지) */}
          <span className="team-exp-value">
            {String(currentCount).padStart(2, "0")}
          </span>

          <img
            src={PlusIcon}
            alt="plus"
            className="team-exp-icon"
            onClick={increase}
            style={{ cursor: 'pointer' }}
          />
        </div>

      </div>

    </div>
  );
}
