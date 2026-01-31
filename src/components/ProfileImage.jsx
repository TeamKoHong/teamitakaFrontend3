import React, { useState, useEffect } from "react";
import "./ProfileImage.css";
import PenIcon from "../assets/pen.png";
import PenBack from "../assets/penback.png";
import DefaultProfile from "../assets/profile_default.png"; // 기본 이미지 (감자)

// 💡 isEditable props를 추가했습니다 (기본값은 true)
export default function ProfileImage({ src, onChange, isEditable = true }) {
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(src || DefaultProfile);

  useEffect(() => {
    setProfileImage(src || DefaultProfile);
  }, [src]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    if (onChange) {
      onChange(file);
    }
    setShowModal(false);
  };

  const resetImage = () => {
    setProfileImage(DefaultProfile);
    setShowModal(false);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <>
      <div className="profile-wrapper">
        <img 
          src={profileImage} 
          className="profile-photo" 
          alt="profile" 
          onError={(e) => {
            e.target.src = DefaultProfile;
          }}
        />

        {/* 💡 isEditable이 true일 때만 수정 버튼(펜 아이콘)을 렌더링합니다 */}
        {isEditable && (
          <button className="edit-icon-btn" onClick={() => setShowModal(true)}>
            <img src={PenBack} className="edit-back" alt="edit-background" />
            <img src={PenIcon} className="edit-icon" alt="edit-icon" />
          </button>
        )}

        <input
          type="file"
          id="fileUpload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>

      {/* 💡 모달 역시 수정 가능할 때만 뜨도록 방어 로직 추가 */}
      {isEditable && showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-box">
              <div
                className="modal-item"
                onClick={() => document.getElementById("fileUpload").click()}
              >
                라이브러리에서 선택
              </div>
              <div className="modal-divider" />
              <div className="modal-item" onClick={resetImage}>
                현재 사진 삭제
              </div>
            </div>
            <div className="modal-cancel" onClick={() => setShowModal(false)}>
              취소
            </div>
          </div>
        </div>
      )}
    </>
  );
}