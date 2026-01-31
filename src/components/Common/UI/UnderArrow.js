export default function UnderArrow({ onClick }) {
  return (
    <div className="under-arrow" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="7"
        viewBox="0 0 13 7"
        fill="none"
      >
        <path
          d="M0.90918 1L5.95733 5.58923C6.23936 5.84562 6.67006 5.84562 6.95209 5.58923L12.0002 1"
          stroke="#807C7C"
          strokeWidth="1.47881"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
}
