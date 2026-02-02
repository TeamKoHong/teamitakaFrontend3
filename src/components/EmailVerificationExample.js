import React, { useState } from 'react';
import { sendVerificationCode, verifyCode, resendVerificationCode } from '../services/auth';

/**
 * 이메일 인증 컴포넌트 사용 예시
 * 
 * 주요 기능:
 * - 이메일 형식 검증 (프론트엔드)
 * - 자동 재시도 (최대 3회)
 * - 로딩 상태 관리
 * - 에러 처리 및 사용자 피드백
 * - 재전송 기능
 */
const EmailVerificationExample = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // 이메일 인증 코드 전송
    const handleSendCode = async () => {
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRetryCount(0);

        try {
            const result = await sendVerificationCode(email);
            setSuccess(true);

        } catch (error) {
            setError(error.message);

        } finally {
            setIsLoading(false);
        }
    };

    // 인증 코드 검증
    const handleVerifyCode = async () => {
        if (!email || !code) {
            setError('이메일과 인증 코드를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await verifyCode(email, code);
            setSuccess(true);

        } catch (error) {
            setError(error.message);

        } finally {
            setIsLoading(false);
        }
    };

    // 인증 코드 재전송
    const handleResendCode = async () => {
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await resendVerificationCode(email);
            setSuccess(true);

        } catch (error) {
            setError(error.message);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>이메일 인증 예시</h2>
            
            {/* 이메일 입력 */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email">이메일 주소:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        marginTop: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {/* 인증 코드 전송 버튼 */}
            <button
                onClick={handleSendCode}
                disabled={isLoading || !email}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: isLoading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginBottom: '15px'
                }}
            >
                {isLoading ? '전송 중...' : '인증 코드 전송'}
            </button>

            {/* 인증 코드 입력 */}
            {success && (
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="code">인증 코드:</label>
                    <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="6자리 인증 코드"
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            )}

            {/* 인증 코드 검증 버튼 */}
            {success && (
                <button
                    onClick={handleVerifyCode}
                    disabled={isLoading || !code}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: isLoading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {isLoading ? '검증 중...' : '인증 코드 검증'}
                </button>
            )}

            {/* 재전송 버튼 */}
            {success && (
                <button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: isLoading ? '#ccc' : '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {isLoading ? '재전송 중...' : '인증 코드 재전송'}
                </button>
            )}

            {/* 에러 메시지 */}
            {error && (
                <div style={{
                    color: 'red',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            {/* 성공 메시지 */}
            {success && !error && (
                <div style={{
                    color: 'green',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '15px'
                }}>
                    인증 코드가 전송되었습니다. 이메일을 확인해주세요.
                </div>
            )}

            {/* 재시도 횟수 표시 */}
            {retryCount > 0 && (
                <div style={{ fontSize: '12px', color: '#666' }}>
                    재시도 횟수: {retryCount}/3
                </div>
            )}
        </div>
    );
};

export default EmailVerificationExample;
