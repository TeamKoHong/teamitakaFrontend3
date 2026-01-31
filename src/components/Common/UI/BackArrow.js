function BackArrow({ color = "#140805", width = 6, height = 12 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 6 12"
      fill="none"
    >
      <path
        d="M5 1L1 6L5 11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default BackArrow;
