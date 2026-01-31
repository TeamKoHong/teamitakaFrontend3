import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './ProjectRecruitImage.scss';
import { loadRecruitDraft, saveRecruitDraft } from '../../../api/recruit';
import { useNavigate } from 'react-router-dom';

import addImageIcon from '../../../assets/icons/add_image.png';

export default function ProjectRecruitImage() {
  const nav = useNavigate();
  const fileRef = useRef(null);

  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => setSheetOpen(false);

  const triggerPick = () => {
    closeSheet();
    fileRef.current?.click();
  };

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      e.target.value = '';
      return alert('이미지 파일만 업로드할 수 있어요.');
    }
    if (file.size > 10 * 1024 * 1024) {
      e.target.value = '';
      return alert('10MB 이하 이미지만 업로드할 수 있어요.');
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result);
    reader.onerror = () => alert('이미지를 불러오지 못했어요. 다시 시도해주세요.');
    reader.readAsDataURL(file);

    // 같은 파일 다시 선택 가능하게
    e.target.value = '';
  };

  const removeImage = () => {
    setImageDataUrl(null);
    closeSheet();
  };

  const saveDraft = () => {
    const base = loadRecruitDraft() || {};
    saveRecruitDraft({ ...base, coverImage: imageDataUrl ? { dataUrl: imageDataUrl } : null });
    alert('임시 저장되었어요.');
  };

  const goNext = () => nav('/recruit/preview');

  // 시트 열릴 때 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!sheetOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.documentElement.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.touchAction = prevTouch;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sheetOpen]);

  const keyActivate = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
    }
  };

  return (
    <div className="page recruit-image-page">
      {/* 상단바 */}
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <button className="save-text" onClick={saveDraft}>임시 저장</button>
      </div>

      <div className="container">
        <h2 className="h2">모집글의 대표 이미지를 {'\n'} 추가해주세요!</h2>

        {/* 업로드 카드 */}
        <button
          type="button"
          className="cover-card"
          onClick={openSheet}
          aria-label="대표 이미지 업로드"
        >
          {imageDataUrl ? (
            <img src={imageDataUrl} alt="대표 이미지 미리보기" />
          ) : (
            <img
              className="add-image-icon"
              src={addImageIcon}
              alt=""
              aria-hidden="true"
            />
          )}
        </button>

        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
      </div>

      {/* 하단 CTA (✅ 시트 열리면 숨김) */}
      <div className={`footer ${sheetOpen ? 'is-hidden' : ''}`}>
        {imageDataUrl ? (
          <button type="button" className="next-btn on" onClick={goNext}>다음</button>
        ) : (
          <button type="button" className="skip-btn" onClick={goNext}>건너뛰기</button>
        )}
      </div>

      {/* 바텀시트: Portal 로 body에 렌더 */}
      {sheetOpen && createPortal(
        <>
          <div className="recruit-action-sheet__backdrop" onClick={closeSheet} />

          <div
            className="recruit-action-sheet"
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              top: 'auto',
              transform: 'none',
              margin: 0,
              width: '100%',
              maxWidth: 'none',
            }}
          >
            <div className="recruit-action-sheet__panel">
              <div
                className="recruit-action-sheet__item"
                role="button"
                tabIndex={0}
                onClick={triggerPick}
                onKeyDown={keyActivate(triggerPick)}
              >
                라이브러리에서 선택
              </div>

              {imageDataUrl && (
                <div
                  className="recruit-action-sheet__item"
                  role="button"
                  tabIndex={0}
                  onClick={removeImage}
                  onKeyDown={keyActivate(removeImage)}
                >
                  현재 사진 삭제
                </div>
              )}
            </div>

            <div
              className="recruit-action-sheet__cancel"
              role="button"
              tabIndex={0}
              onClick={closeSheet}
              onKeyDown={keyActivate(closeSheet)}
            >
              취소
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
