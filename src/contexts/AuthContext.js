import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
    getToken,
    getUser,
    setToken,
    removeToken,
    isAuthenticated,
    getTokenRemainingTime,
    shouldRefreshToken
} from '../utils/tokenManager';
import { refreshToken } from '../services/auth';

// 액션 타입 정의
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REFRESH_TOKEN_START: 'REFRESH_TOKEN_START',
    REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
    REFRESH_TOKEN_FAILURE: 'REFRESH_TOKEN_FAILURE',
    SET_USER: 'SET_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// 초기 상태
const initialState = {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    isRefreshing: false,
    // 휴대폰 본인인증 등록 정보 (신규)
    registration: {
        phoneVerified: false,
        verifiedName: null,
        verifiedPhone: null,
        ci: null,
        schoolEmail: null, // 학교 이메일 (프로필 설정에서 학교 자동 감지용)
    }
};

// 리듀서 함수
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload.error
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: null,
                isRefreshing: false
            };

        case AUTH_ACTIONS.REFRESH_TOKEN_START:
            return {
                ...state,
                isRefreshing: true,
                error: null
            };

        case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                isRefreshing: false,
                token: action.payload.token,
                error: null
            };

        case AUTH_ACTIONS.REFRESH_TOKEN_FAILURE:
            return {
                ...state,
                isRefreshing: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload.error
            };

        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        case 'SET_REGISTRATION':
            return {
                ...state,
                registration: {
                    ...state.registration,
                    ...action.payload
                }
            };

        default:
            return state;
    }
};

// Context 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // 초기화 - 저장된 토큰과 사용자 정보 확인
    useEffect(() => {
        // eslint-disable-next-line no-unused-vars
        const initializeAuth = () => {
            try {
                const token = getToken();
                const user = getUser();

                if (token && user && isAuthenticated()) {
                    dispatch({
                        type: AUTH_ACTIONS.SET_USER,
                        payload: { user, token }
                    });

                    if (process.env.NODE_ENV === 'development') {
                        console.log('기존 인증 정보 복원됨:', { user: user.email, tokenValid: true });
                    }
                } else {
                    // 유효하지 않은 토큰이나 사용자 정보가 있으면 정리
                    if (token || user) {
                        // 실제로 토큰이나 사용자 정보가 있었던 경우에만 정리하고 로그 출력
                        removeToken();
                        console.log('저장된 인증 정보 없음 또는 만료됨');
                    }
                    // 인증 정보가 없으면 로그아웃 상태로 초기화 (로딩 종료)
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } catch (error) {
                console.error('인증 초기화 오류:', error);
                removeToken();
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            } finally {
                // Safety net: ensure loading is always turned off
                // We don't have a direct SET_LOADING_FALSE action, but LOGOUT sets isLoading: false.
                // However, if we added a specific finally block/logic elsewhere, we'd do it here.
                // Since LOGOUT action handles it, this is just a comment, ensuring logical flow is correct.
            }
        };

        initializeAuth();
    }, []);

    // 토큰 자동 갱신 체크
    useEffect(() => {
        if (!state.isAuthenticated || state.isRefreshing) return;

        const checkTokenRefresh = () => {
            if (shouldRefreshToken()) {
                console.log('토큰 갱신 필요');
                handleRefreshToken();
            }
        };

        // 5분마다 토큰 상태 확인
        const interval = setInterval(checkTokenRefresh, 5 * 60 * 1000);

        // 즉시 한 번 확인
        // checkTokenRefresh();

        return () => clearInterval(interval);
    }, [state.isAuthenticated, state.isRefreshing]);

    // 로그인 함수
    const login = (user, token) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            // 토큰과 사용자 정보 저장
            const success = setToken(token, user);

            if (success) {
                dispatch({
                    type: AUTH_ACTIONS.LOGIN_SUCCESS,
                    payload: { user, token }
                });
                console.log('로그인 성공:', user.email);
                return true;
            } else {
                throw new Error('토큰 저장 실패');
            }
        } catch (error) {
            console.error('로그인 처리 오류:', error);
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: { error: error.message }
            });
            return false;
        }
    };

    // 로그아웃 함수
    const logout = () => {
        try {
            removeToken();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
            console.log('로그아웃 완료');
        } catch (error) {
            console.error('로그아웃 오류:', error);
            // 오류가 있어도 강제로 로그아웃 상태로 변경
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // 토큰 갱신 함수
    const handleRefreshToken = async () => {
        try {
            dispatch({ type: AUTH_ACTIONS.REFRESH_TOKEN_START });

            const result = await refreshToken();

            if (result.token) {
                dispatch({
                    type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
                    payload: { token: result.token }
                });
                console.log('토큰 갱신 성공');
            } else {
                throw new Error('토큰 갱신 응답에 토큰이 없음');
            }
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            dispatch({
                type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE,
                payload: { error: error.message }
            });
            // 토큰 갱신 실패 시 로그아웃
            removeToken();
        }
    };

    // 에러 정리 함수
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // 사용자 정보 업데이트 함수
    const updateUser = (updatedUser) => {
        try {
            const currentToken = getToken();
            if (currentToken) {
                setToken(currentToken, updatedUser);
                dispatch({
                    type: AUTH_ACTIONS.SET_USER,
                    payload: { user: updatedUser, token: currentToken }
                });
            }
        } catch (error) {
            console.error('사용자 정보 업데이트 오류:', error);
        }
    };

    // Context 값
    const value = {
        // 상태
        user: state.user,
        token: state.token,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        isRefreshing: state.isRefreshing,
        registration: state.registration, // 신규

        // 함수
        login,
        logout,
        clearError,
        updateUser,
        refreshToken: handleRefreshToken,
        setRegistration: (regData) => dispatch({ type: 'SET_REGISTRATION', payload: regData }), // 신규

        // 헬퍼 함수
        getRemainingTime: getTokenRemainingTime,
        checkAuthStatus: isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 훅
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
    }

    return context;
};

// 인증이 필요한 컴포넌트를 감싸는 HOC
export const withAuth = (Component) => {
    return function AuthenticatedComponent(props) {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return <div>로딩 중...</div>;
        }

        if (!isAuthenticated) {
            return <div>인증이 필요합니다.</div>;
        }

        return <Component {...props} />;
    };
};

export default AuthContext;