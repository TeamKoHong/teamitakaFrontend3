import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNativeApp } from '../../hooks/useNativeApp';
import { IoChevronBack } from 'react-icons/io5';
import './NativeHeader.css';

const NativeHeader = ({
  title,
  showBack = true,
  onBack,
  rightElement,
  transparent = false,
}) => {
  const navigate = useNavigate();
  const { hapticFeedback } = useNativeApp();

  const handleBack = async () => {
    await hapticFeedback('light');
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`native-header ${transparent ? 'native-header--transparent' : ''}`}>
      <div className="native-header__left">
        {showBack && (
          <button className="native-header__back" onClick={handleBack}>
            <IoChevronBack size={28} />
          </button>
        )}
      </div>

      <h1 className="native-header__title">{title}</h1>

      <div className="native-header__right">
        {rightElement}
      </div>
    </header>
  );
};

export default NativeHeader;
