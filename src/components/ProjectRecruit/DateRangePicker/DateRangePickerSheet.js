// src/components/ProjectRecruit/DateRangePicker/DateRangePickerSheet.js
import React, { useEffect, useState } from "react";
import BottomSheet from "../../Common/BottomSheet";
import DateRangePicker from "./DateRangePicker";
import "./DateRangePickerSheet.scss";

export default function DateRangePickerSheet({
  open,
  onDismiss,
  onComplete,
  initialStart = null,
  initialEnd = null,
  maxRangeWeeks = 2,
  title = "모집 기간을 선택해주세요.", // 커스터마이징 가능한 타이틀
}) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  // ✅ 바텀시트가 다시 열릴 때 props 초기값과 동기화(재오픈 시 이전 선택값 잔상 방지)
  useEffect(() => {
    if (open) {
      setStartDate(initialStart);
      setEndDate(initialEnd);
    }
  }, [open, initialStart, initialEnd]);

  const handleDateSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleComplete = () => {
    if (startDate && endDate) {
      onComplete(startDate, endDate);
      onDismiss();
    }
  };

  const handleCancel = () => {
    // Reset to initial values on cancel
    setStartDate(initialStart);
    setEndDate(initialEnd);
    onDismiss();
  };

  const bothSelected = Boolean(startDate && endDate);

  return (
    <BottomSheet
      open={open}
      onDismiss={handleCancel}
      className="date-range-picker-sheet"
      blocking={false}
    >
      <div className="picker-sheet-container">
        {/* Header */}
        <div className="picker-sheet-header">
          <div className="title-wrap">
            <h3 className="picker-sheet-title">{title}</h3>
            <p className="picker-sheet-sub">
              기간은 최대 2주까지 설정할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            className={`complete-btn ${!bothSelected ? "disabled" : ""}`}
            onClick={handleComplete}
            disabled={!bothSelected}
            aria-label="완료"
          >
            완료
          </button>
        </div>

        {/* Calendar */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          maxRangeWeeks={maxRangeWeeks}
        />
      </div>
    </BottomSheet>
  );
}
