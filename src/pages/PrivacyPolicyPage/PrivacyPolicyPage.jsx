import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-policy-page">
      <header className="privacy-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="header-title">개인정보 처리방침</h1>
        <div className="header-spacer" />
      </header>

      <main className="privacy-content">
        <p className="last-updated">최종 수정일: 2025년 2월 5일</p>

        <section className="policy-section">
          <h2>제1조 (개인정보의 처리목적)</h2>
          <p>회사는 다음의 목적을 위해 개인정보를 수집·이용합니다.</p>
          <ul>
            <li>회원 가입 및 본인 확인</li>
            <li>서비스 제공 및 맞춤형 기능 제공</li>
            <li>고객 문의 응대 및 공지사항 전달</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>제2조 (수집하는 개인정보 항목)</h2>
          <ul>
            <li><strong>필수</strong>: 이름, 이메일, 비밀번호, 학교 이메일 인증 값</li>
            <li><strong>선택</strong>: 프로필 사진</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>제3조 (개인정보의 보관 및 이용 기간)</h2>
          <ul>
            <li>회원 탈퇴 시 즉시 파기</li>
            <li>법령에서 정한 기간 동안 보존해야 하는 경우, 해당 기간 동안 보관</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>제4조 (개인정보 제3자 제공)</h2>
          <p>
            회사는 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 법령에 따라 요청이 있는 경우는 예외로 합니다.
          </p>
        </section>

        <section className="policy-section">
          <h2>제5조 (개인정보 처리 위탁)</h2>
          <p>
            서비스 운영을 위해 일부 업무를 외부에 위탁할 수 있으며,
            이 경우 이용자에게 고지합니다.
          </p>
        </section>

        <section className="policy-section">
          <h2>제6조 (이용자의 권리와 행사 방법)</h2>
          <p>
            이용자는 언제든지 자신의 개인정보를 열람·정정·삭제할 수 있습니다.
          </p>
          <p>
            문의: <a href="mailto:teamitaka.official@gmail.com">teamitaka.official@gmail.com</a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
