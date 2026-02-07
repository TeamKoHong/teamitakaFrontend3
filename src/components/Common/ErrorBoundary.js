import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          backgroundColor: '#F5F5F5',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '0 0 8px' }}>
            문제가 발생했습니다
          </h2>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px', lineHeight: '1.5' }}>
            일시적인 오류가 발생했습니다.<br />다시 시도해주세요.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '12px 32px',
              backgroundColor: '#f76241',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
