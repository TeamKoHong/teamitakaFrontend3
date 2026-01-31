// 원형 프로그레스 바
const CircularProgress = ({ percentage, children }) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="60" height="60" viewBox="0 0 44 44">
      {/* 배경 원 */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#eee"
        strokeWidth={strokeWidth}
      />
      {/* 진행 바 */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#F76241"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={isNaN(offset) ? 0 : offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      {/* 중앙 텍스트(children) */}
      {children && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fontFamily="Pretendard, 'SF Pro Text', 'Inter', sans-serif"
          fontStyle="normal"
          dy=".3em"
          fontSize="11px"
          fontWeight="500"
          fill="#F76241"
        >
          {children}
        </text>
      )}
    </svg>
  );
};

export default CircularProgress;
