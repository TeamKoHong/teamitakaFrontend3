import BackArrow from "../Common/UI/BackArrow";
import { useNavigate } from "react-router-dom";
import "./ProjectDetailHeader.scss";
import React, { useState, useRef } from "react"; // useRef 추가
import BottomSheet from "../Common/BottomSheet";

function ProjectDetailHeader({ projectName }) {
  const navigate = useNavigate();
  
  // 1. 파일 선택을 위한 Ref 생성
  const fileRef = useRef(null);
  
  const [sheetOpen, setSheetOpen] = useState(false);
  // 선택된 이미지 데이터를 저장할 state (필요하다면 상위 컴포넌트로 올리거나 API 연동)
  const [backgroundImage, setBackgroundImage] = useState(null); 

  const handleBack = () => {
    navigate("/project-management");
  };

  // 2. "라이브러리에서 선택" 클릭 시 실행
  const handleSelectLibrary = () => {
    setSheetOpen(false); // 바텀시트 닫기
    
    // 약간의 딜레이 후 파일 선택창 열기 (모바일 브라우저 호환성 및 UX)
    setTimeout(() => {
      fileRef.current?.click();
    }, 100);
  };

  // 3. 파일이 선택되었을 때 처리 (ProjectRecruitImage 로직 차용)
  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 유효성 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }

    // 파일 읽기
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setBackgroundImage(result); // 미리보기 state 업데이트
      
      // TODO: 여기서 서버로 이미지를 전송하거나 상위 컴포넌트에 전달하는 로직 추가
      console.log("선택된 이미지 데이터:", result); 
    };
    reader.onerror = () => alert('이미지를 불러오지 못했어요. 다시 시도해주세요.');
    reader.readAsDataURL(file);

    // 같은 파일을 다시 선택할 수 있도록 value 초기화
    e.target.value = '';
  };

  const handleDeletePhoto = () => {
    // 이미지 삭제 로직
    setBackgroundImage(null);
    setSheetOpen(false);
  };

  return (
    // 배경 이미지가 선택되면 보여주기 위한 스타일 적용 (예시)
    <div 
      className="project-detail-header-container"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* 4. 숨겨진 파일 입력창 (화면엔 안 보임) */}
      <input 
        ref={fileRef} 
        type="file" 
        accept="image/*" 
        hidden 
        onChange={onPick} 
      />

      {/* 실제 헤더 내용 */}
      <div className="project-detail-header">
        <div onClick={handleBack} style={{ cursor: 'pointer' }}>
          <BackArrow />
        </div>

        <p>{projectName}</p>
        <div className="header-spacer"></div>
      </div>

      {/* 이미지 클릭 영역 (바텀시트 열기) */}
      <div className="image-click-area" onClick={() => setSheetOpen(true)}></div>

      <BottomSheet
        open={sheetOpen}
        onDismiss={() => setSheetOpen(false)}
        blocking={true}
        snapPoints={({ maxHeight }) => [215]}
        className="offset-sheet"
      >
        <div className="sheet-body">
          <ul className="option-list">
            {/* 클릭 시 handleSelectLibrary 실행 */}
            <li onClick={handleSelectLibrary}>라이브러리에서 선택</li>
            <div className="divider" />
            <li onClick={handleDeletePhoto}>현재 사진 삭제</li>
          </ul>
          <ul className="cancel-list">
            <li onClick={() => setSheetOpen(false)}>취소</li>
          </ul>
        </div>
      </BottomSheet>
    </div>
  );
}

export default ProjectDetailHeader;