import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // 로딩 중일 때 로딩 화면 표시
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                background: '#f9f9f9'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #F76241',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{
                    marginTop: '16px',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    로딩 중...
                </p>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // 인증되지 않은 경우 로그인 페이지로 리디렉션
    // 현재 위치를 state로 전달하여 로그인 후 원래 페이지로 돌아갈 수 있게 함
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 인증된 경우 자식 컴포넌트 렌더링
    return children;
};

/**
 * 인증된 사용자만 접근할 수 있는 페이지를 정의하는 HOC
 * 사용법: export default withProtection(MyComponent);
 */
export const withProtection = (Component) => {
    return function ProtectedComponent(props) {
        return (
            <ProtectedRoute>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
};

/**
 * 인증된 사용자는 접근할 수 없는 페이지 (로그인, 회원가입 등)
 * 로그인된 사용자가 접근하면 메인 페이지로 리디렉션
 */
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // 로딩 중일 때는 로딩 화면 표시
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                background: '#f9f9f9'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #F76241',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{
                    marginTop: '16px',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    로딩 중...
                </p>
            </div>
        );
    }

    // 이미 로그인된 사용자는 메인 페이지로 리디렉션
    if (isAuthenticated) {
        return <Navigate to="/main" replace />;
    }

    // 로그인하지 않은 사용자만 접근 가능
    return children;
};

/**
 * 역할 기반 접근 제어 (추후 구현 시 사용)
 * 특정 권한을 가진 사용자만 접근 가능한 페이지
 */
export const RoleBasedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 사용자 역할 확인 (추후 user 객체에 role 필드가 추가되면 사용)
    if (requiredRole && user?.role !== requiredRole) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <h2>접근 권한이 없습니다</h2>
                <p>이 페이지에 접근할 권한이 없습니다.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;