// TodayIcon.tsx
function TodayIcon({ className, style, text }) {
  return (
    <div className={className} style={{ position: "absolute", ...style }}>
      <svg
        width="56"
        height="33"
        viewBox="0 0 56 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 2.5C0.5 1.39543 1.39543 0.5 2.5 0.5H53.5C54.6046 0.5 55.5 1.39543 55.5 2.5V22.5C55.5 23.6046 54.6046 24.5 53.5 24.5H44.75H34.1531C33.4394 24.5 32.7798 24.8803 32.4223 25.4979L29.1564 31.1389C28.4032 32.44 26.5374 32.4759 25.7346 31.2048L22.0886 25.432C21.7222 24.8518 21.0839 24.5 20.3977 24.5H10.25H2.5C1.39543 24.5 0.5 23.6046 0.5 22.5L0.5 2.5Z"
          fill="#F76241"
        />
      </svg>
      <span
        style={{
          position: "absolute",
          top: "5px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
          fontStyle: "normal",
          lineHeight: "normal",
          textTransform: "capitalize",
          textAlign: "center",
          textWrap: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default TodayIcon;
