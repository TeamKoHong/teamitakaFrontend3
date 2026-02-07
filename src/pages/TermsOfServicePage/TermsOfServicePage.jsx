import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsOfServicePage.css';

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <header className="terms-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="header-title">서비스 이용약관</h1>
        <div className="header-spacer" />
      </header>

      <main className="terms-content">
        <p className="last-updated">최종 수정일: 2025년 2월 5일</p>

        <section className="terms-section">
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 티미타카(이하 "회사")가 제공하는 서비스의 이용과 관련하여,
            회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="terms-section">
          <h2>제2조 (정의)</h2>
          <ol>
            <li>"서비스"라 함은 회사가 제공하는 모든 온라인/모바일 기반 기능을 말합니다.</li>
            <li>"이용자"라 함은 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제3조 (약관의 효력 및 변경)</h2>
          <ol>
            <li>본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 필요 시 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제4조 (회원가입 및 계정 관리)</h2>
          <ol>
            <li>이용자는 회사가 정한 절차에 따라 회원가입을 신청하고, 회사가 이를 승낙함으로써 회원이 됩니다.</li>
            <li>회원은 자신의 계정 정보를 정확히 관리해야 하며, 타인에게 양도·대여할 수 없습니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제5조 (서비스의 제공 및 변경)</h2>
          <ol>
            <li>회사는 안정적인 서비스를 제공하기 위해 노력합니다.</li>
            <li>회사는 서비스의 일부 또는 전부를 변경·중단할 수 있으며, 사전에 공지합니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제6조 (이용자의 의무)</h2>
          <ol>
            <li>타인의 계정을 도용하거나 허위 정보를 입력해서는 안 됩니다.</li>
            <li>서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제7조 (회사의 책임 제한)</h2>
          <ol>
            <li>회사는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            <li>회사는 이용자의 귀책 사유로 발생한 손해에 대해서는 책임을 지지 않습니다.</li>
          </ol>
        </section>

        <section className="terms-section">
          <h2>제8조 (준거법 및 관할법원)</h2>
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 회사 본점 소재지를
            관할하는 법원을 전속 관할법원으로 합니다.
          </p>
        </section>

        <section className="terms-section">
          <h2>문의</h2>
          <p>
            서비스 이용 관련 문의사항은 아래로 연락해주세요.
          </p>
          <p>
            이메일: <a href="mailto:teamitaka.official@gmail.com">teamitaka.official@gmail.com</a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
