import React, { useEffect, useState, useRef } from "react";
import "./Tab.scss";

function Tab({ onTabChange, activeTabIndex = 0, labels = ["진행 중", "모집중", "완료된"] }) {
  // 0: 진행 중, 1: 모집중, 2: 완료된
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef([]);

  // keep internal state in sync with external index
  useEffect(() => {
    setActiveTab(activeTabIndex);
  }, [activeTabIndex]);

  // Update indicator position based on active tab
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const textElement = activeTabElement.querySelector('.tab-text');
      if (textElement) {
        const textWidth = textElement.offsetWidth;
        const padding = 64; // 좌우 패딩 (총 32px 추가)
        const indicatorWidth = textWidth + padding;
        const tabLeft = activeTabElement.offsetLeft;
        const tabWidth = activeTabElement.offsetWidth;
        const indicatorLeft = tabLeft + (tabWidth - indicatorWidth) / 2;
        
        setIndicatorStyle({
          left: `${indicatorLeft}px`,
          width: `${indicatorWidth}px`,
        });
      }
    }
  }, [activeTab]);

  const handleTabClick = (index) => {
    setActiveTab(index);
    onTabChange(index); // 선택된 탭을 부모 컴포넌트로 전달
  };

  return (
    <div className="tab-container" role="tablist" aria-label="프로젝트 상태 탭">
      {labels.map((tab, index) => (
        <button
          key={tab}
          ref={(el) => (tabRefs.current[index] = el)}
          role="tab"
          aria-selected={activeTab === index}
          className={`tab-item ${activeTab === index ? "active" : ""}`}
          onClick={() => handleTabClick(index)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              handleTabClick(Math.max(0, activeTab - 1));
            } else if (e.key === 'ArrowRight') {
              handleTabClick(Math.min(labels.length - 1, activeTab + 1));
            }
          }}
        >
          <span className="tab-text">{tab}</span>
        </button>
      ))}
      {/* 반응형 인디케이터 바 */}
      <span
        className="indicator"
        aria-hidden="true"
        style={indicatorStyle}
      />
    </div>
  );
}

export default Tab;
