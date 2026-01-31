export default function AddFloatingButton({ onClick }) {
  return (
    <div
      className="add-floating-button"
      onClick={onClick}
      style={{
        background: "#403E3E",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        bottom: "19px",
        right: "14px",
      }}
    >
      <div className="add-icon" style={{ color: "#f2f2f2", fontSize: "22px" }}>
        +
      </div>
    </div>
  );
}
