import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/auth';
import './LoginPage.scss';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, error: authError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // 이미 로그인된 상태면 메인 페이지로 리디렉션
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/main');
        }
    }, [isAuthenticated, navigate]);

    const handleSignup = () => {
        navigate('/phone-verify');
    };

    const handleGuestMode = () => {
        navigate('/guest');
    };

    const handleFindId = () => {
        navigate('/find-id');
    };

    const handleFindPassword = () => {
        navigate('/find-password');
    };

    // 단일 화면 사용: 별도의 폼 전환 없이 동일 화면에서 제출 처리

    const handleLogin = async (e) => {
        e.preventDefault();

        // 중복 제출 방지
        if (isLoginLoading || isLoading) {
            return;
        }

        // 입력 검증
        if (!email.trim() || !password.trim()) {
            setLoginError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoginError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            setIsLoginLoading(true);
            setLoginError('');

            const loginData = {
                email: email.trim(),
                password: password
            };

            const result = await loginUser(loginData);

            if (result.success && result.token && result.user) {
                // AuthContext를 통해 로그인 상태 업데이트
                const success = login(result.user, result.token);

                if (success) {
                    navigate('/main');
                } else {
                    setLoginError('로그인 정보 저장에 실패했습니다.');
                }
            } else {
                setLoginError(result.message || '로그인에 실패했습니다.');
            }

        } catch (error) {

            setLoginError(error.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoginLoading(false);
        }
    };

    const isFormValid = email.trim() && password.trim();

    return (
        <div className="login-page-container">
            <div className="login-content">
                <h1 className="welcome-text">반가워요!</h1>
                <div className="subtitle">
                    <span className="highlight">맞춤형 팀 매칭</span>
                    <span className="normal">으로 </span>
                    <span className="normal">프로젝트를 완성하세요!</span>
                </div>

                <form onSubmit={handleLogin} autoComplete="on" className="button-group">
                    <input
                        className="input-field"
                        placeholder="아이디 입력"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                    >
                    </input>
                    <input
                        className="input-field"
                        placeholder="비밀번호 입력"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    >
                    </input>

                    {(loginError || authError) && (
                        <div style={{ color: '#F76241', fontSize: '14px', textAlign: 'center' }}>
                            {loginError || authError}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={!isFormValid || isLoginLoading || isLoading}
                    >
                        {isLoginLoading || isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="find-links">
                    <button className="find-links-button" onClick={handleFindId}>
                        아이디 찾기
                    </button>
                    <span className="find-links-separator">|</span>
                    <button className="find-links-button" onClick={handleFindPassword}>
                        비밀번호 찾기
                    </button>
                    <span className="find-links-separator">|</span>
                    <button className="find-links-button" onClick={handleSignup}>
                        회원가입
                    </button>
                </div>
                <div className="look-without-register" onClick={handleGuestMode}>
                    회원가입 없이 둘러볼래요
                </div>
            </div>
        </div>
    );
}

export default LoginPage; 