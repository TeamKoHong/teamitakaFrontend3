import React from "react";
import "./PentagonChart.scss";

// 위치 인덱스 기반 오프셋 (라벨명이 아닌 위치로 결정)
const POSITION_OFFSETS = [
  { dx: 0, dy: 0 },   // 상단
  { dx: 22, dy: 8 },   // 우상단
  { dx: 14, dy: 12 },   // 우하단
  { dx: -14, dy: 12 },  // 좌하단
  { dx: -15, dy: 8 }   // 좌상단
];

// 각 꼭짓점의 기본 좌표 (가장 큰 바깥 오각형 기준)
const BASE_POINTS = [
  { x: 74.5, y: 0.5 },     // 상단
  { x: 149.5, y: 62 },     // 우상단
  { x: 118.677, y: 147 },  // 우하단
  { x: 30, y: 147 },       // 좌하단
  { x: 1, y: 62.3403 }     // 좌상단
];

const PentagonChart = ({
  skills = {
    노력: 50,
    업무능력: 80,
    소통: 85,
    성장: 90,
    의지: 60
  }
}) => {
  // 1. 하위 2개 항목 추출 (다른 로직 건드리지 않음)
  const lowSkillLabels = Object.entries(skills)
    .sort(([, a], [, b]) => a - b) // 낮은 점수 순 정렬
    .slice(0, 2)                   // 상위 2개 추출
    .map(([label]) => label);

  // 스킬 값을 0-100 범위로 정규화
  const normalizeValue = (value) => Math.max(0, Math.min(100, value));

  // skills 객체에서 키(라벨)와 값 추출
  const skillEntries = Object.entries(skills);

  // skills 키 순서대로 라벨 동적 배치
  const points = BASE_POINTS.map((point, idx) => ({
    ...point,
    label: skillEntries[idx]?.[0] || '',
    value: skillEntries[idx]?.[1] || 0
  }));

  // 중심점 (격자선 교차 지점과 동일)
  const center = { x: 74.5, y: 85 };

  // 스킬 값에 따른 실제 좌표 계산
  const calculatePoint = (basePoint, skillValue) => {
    const ratio = normalizeValue(skillValue) / 100;
    return {
      x: center.x + (basePoint.x - center.x) * ratio,
      y: center.y + (basePoint.y - center.y) * ratio
    };
  };

  // 실제 데이터 포인트들 계산
  const dataPoints = points.map((point) => {
    return calculatePoint(point, point.value);
  });

  // SVG path 생성
  const createPath = (points) => {
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
  };

  return (
    <div className="pentagon-chart">
      <svg xmlns="http://www.w3.org/2000/svg" width="151" height="148" viewBox="0 0 151 148" fill="none">
        {/* 외곽 오각형 */}
        <path d="M150 61.8333L74.7424 1L1 61.8333L29.7898 147H118.685L150 61.8333Z" stroke="#515151"/>
        
        {/* 중간 오각형들 */}
        <path d="M129 69.1667L74.5 26L21 69.1667L41.8678 131H106.302L129 69.1667Z" stroke="#515151" strokeDasharray="2 2"/>
        <path d="M105 76.1667L74.5 51.5L45 76.1667L56.5932 110H92.3898L105 76.1667Z" stroke="#515151" strokeDasharray="2 2"/>
        
        {/* 격자선 */}
        <path d="M74.5 0.5V85M74.5 85L1 62.3403M74.5 85L30 147M74.5 85L118.677 147M74.5 85L149.5 62" stroke="#515151" strokeDasharray="2 2"/>
        
        {/* 실제 데이터 영역 */}
        <path 
          d={createPath(dataPoints)} 
          fill="rgba(247, 98, 65, 0.6)" 
          stroke="#F76241" 
          strokeWidth="2"
        />
      </svg>
      
      {/* 라벨들 (SVG 꼭짓점 + 위치 기반 오프셋) */}
      <div className="chart-labels">
        {points.map(({ x, y, label }, index) => {
          const offset = POSITION_OFFSETS[index] || { dx: 0, dy: 0 };

          // 2. 하위 2개 항목에 포함되는지 확인하여 하이라이트
          const isHighlighted = lowSkillLabels.includes(label);

          const style = {
            left: x + offset.dx,
            top: y + offset.dy,
            color: isHighlighted ? '#F76241' : '#3e3e3e',
            fontWeight: isHighlighted ? 600 : 500,
          };

          return (
            <div key={label || index} className="label" style={style}>{label}</div>
          );
        })}
      </div>
    </div>
  );
};

export default PentagonChart;