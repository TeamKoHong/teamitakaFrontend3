import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/user";
import { logoutUser } from "../services/auth";
import AlertModal from "./Common/AlertModal";
import "./Withdrawal.css";

export default function Withdrawal() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdrawalClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowPasswordModal(true);
    setPassword("");
    setError("");
  };

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await deleteAccount(password);
      logoutUser();
      localStorage.removeItem('user_mbti_type');
      localStorage.removeItem('tokenExpiry');
      setShowPasswordModal(false);
      navigate("/login", { replace: true });
    } catch (err) {
      if (err.code === "INVALID_PASSWORD") {
        setError("비밀번호가 일치하지 않습니다.");
      } else {
        setError(err.message || "회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="withdrawal-container">
      <span className="withdrawal-text" onClick={handleWithdrawalClick}>
        탈퇴하기
      </span>

      <AlertModal
        isOpen={showConfirm}
        title="정말 탈퇴하시겠습니까?"
        description="탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
        primaryLabel="탈퇴"
        secondaryLabel="취소"
        onPrimary={handleConfirm}
        onSecondary={() => setShowConfirm(false)}
        onClose={() => setShowConfirm(false)}
      />

      {showPasswordModal && (
        <div className="withdrawal-dim" role="dialog" aria-modal="true" onClick={() => setShowPasswordModal(false)}>
          <div className="withdrawal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="withdrawal-card-title">비밀번호 확인</h2>
            <p className="withdrawal-card-desc">
              본인 확인을 위해 비밀번호를 입력해주세요.
            </p>
            <input
              type="password"
              className="withdrawal-input"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDelete()}
              autoFocus
            />
            {error && <p className="withdrawal-error">{error}</p>}
            <div className="withdrawal-actions">
              <button
                className="withdrawal-btn-cancel"
                onClick={() => setShowPasswordModal(false)}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                className="withdrawal-btn-confirm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
