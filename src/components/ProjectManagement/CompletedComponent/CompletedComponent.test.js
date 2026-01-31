import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompletedComponent from './CompletedComponent';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('CompletedComponent modal behavior', () => {
  it('opens modal for incomplete mutual review project', () => {
    render(<CompletedComponent />);
    fireEvent.click(screen.getByText('연합동아리 부스전 기획 프로젝트').closest('.completed-item'));
    expect(screen.getByText('상호평가 완료 후 열람 가능해요')).toBeInTheDocument();
    expect(screen.getByText('나중에 하기')).toBeInTheDocument();
    expect(screen.getByText('작성하기')).toBeInTheDocument();
  });
});


