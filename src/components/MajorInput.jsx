import React, { useState } from "react";
import "./MajorInput.css";

export default function MajorInput({ value, onChange }) {
  // 내부 상태 (props 없을 때 사용 - 기존 동작 유지)
  const [internalValue, setInternalValue] = useState("");

  // controlled vs uncontrolled 모드 판단
  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (isControlled) {
      onChange(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  };

  return (
    <div className="major-container">

      <div className="major-header">
        <div className="major-label-wrapper">
          <span className="major-label">학과</span>
          <span className="major-required-dot"></span>
        </div>

        <button className="major-add-btn">+ 전공 추가</button>
      </div>

      <div className="major-input-wrapper">
        <input
          type="text"
          className="major-input"
          placeholder="전공을 입력해주세요."
          value={currentValue}
          onChange={handleChange}
        />
      </div>

    </div>
  );
}
