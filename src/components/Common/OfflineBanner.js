import React from 'react';
import { useNetwork } from '../../hooks/useNetwork';
import './OfflineBanner.scss';

const OfflineBanner = () => {
  const { isOnline } = useNetwork();

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      네트워크에 연결되지 않았습니다
    </div>
  );
};

export default OfflineBanner;
