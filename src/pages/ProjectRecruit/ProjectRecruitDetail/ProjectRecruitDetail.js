import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProjectRecruitDetail.scss';
import {
  loadRecruitDraft,
  saveRecruitDraft,
  saveDraftToList,
  getCurrentDraftId,
} from '../../../api/recruit';
import { showSuccessToast, showWarningToast } from '../../../utils/toast';

function TagInput({ value, onChange, placeholder, max = 5 }) {
  const [text, setText] = useState('');

  const isHash = (s) => /^#[^\s#]+$/.test((s || '').trim());

  const addTag = () => {
    const v = text.trim();
    // #해시태그 형태만 추가
    if (!isHash(v)) return;
    if (value.includes(v) || value.length >= max) return;

    onChange([...value, v]);
    setText('');
  };

  const onKeyDown = (e) => {
    // Enter / Space로 태그 확정
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag();
      return;
    }

    // 입력이 비어있을 때 Backspace → 마지막 태그 삭제
    if (e.key === 'Backspace' && text.length === 0 && value.length > 0) {
      const next = value.slice(0, -1);
      onChange(next);
    }
  };

  return (
    <div className={`tag-input-inline ${isHash(text) ? 'is-hash-input' : ''}`}>
      <div className="tag-line">
        {value.map((t, i) => (
          <span className="inline-tag" key={t + i}>
            {t}
          </span>
        ))}

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={value.length ? '' : placeholder}
          aria-label="해시태그 입력"
        />
      </div>

      {/* 필요하면 안내문(선택)
      <div className="hint">#해시태그를 입력 후 스페이스/엔터로 추가</div>
      */}
    </div>
  );
}

export default function ProjectRecruitDetail() {
  const nav = useNavigate();
  const location = useLocation();

  const [detail, setDetail] = useState('');
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    const d = loadRecruitDraft();
    if (d) {
      setDetail(d.detail || '');
      setKeywords(d.keywords || []);
    }
  }, []);

  useEffect(() => {
    const draft = location.state?.draft;
    if (draft?.data) {
      const d = draft.data;
      setDetail(d.detail || '');
      setKeywords(d.keywords || []);
    }
  }, [location.state]);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (detail || keywords.length > 0) {
        const base = loadRecruitDraft() || {};
        const single = { ...base, detail, keywords };
        saveRecruitDraft(single);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [detail, keywords]);

  const maxLen = 400;

  // 상세글 + 키워드 1개 이상일 때만 활성화
  const canNext = detail.trim().length > 0 && keywords.length > 0;

  const saveDraft = () => {
    const base = loadRecruitDraft() || {};
    const single = { ...base, detail, keywords };
    saveRecruitDraft(single);

    saveDraftToList({
      id: getCurrentDraftId(),
      title: base.title || (detail.split('\n')[0] || '제목 없음'),
      type: base.type || '',
      data: single,
    });

    showSuccessToast('임시 저장되었어요.');
  };

  const goNext = () => {
    if (!detail.trim()) return;
    if (keywords.length === 0) {
      showWarningToast('키워드를 최소 1개 이상 설정해주세요.');
      return;
    }

    const base = loadRecruitDraft() || {};
    const single = { ...base, detail, keywords };
    saveRecruitDraft(single);
    nav('/recruit/image');
  };

  return (
    <div className="page recruit-detail-page">
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <button className="save-text" onClick={saveDraft}>
          임시 저장
        </button>
      </div>

      <div className="container">
        <h2 className="h2">
          모집 내용을 상세하게{'\n'}작성해주세요
        </h2>

        <div className={`field ${detail ? 'field--active' : ''}`}>
          <textarea
            rows={10}
            maxLength={maxLen}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="글 작성하기 (400자 제한)"
          />
          <div className="counter">{`${detail.length}/${maxLen}`}</div>
        </div>

        <div className="label-row">
          <div className="label-bold">키워드 설정</div>
          <div className="label-desc">최대 5개 태그 설정</div>
        </div>

        <TagInput
          value={keywords}
          onChange={setKeywords}
          placeholder="해시태그 설정"
          max={5}
        />
      </div>

      <div className="footer">
        <button
          className={`next-btn ${canNext ? 'on' : 'off'}`}
          disabled={!canNext}
          onClick={goNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}
