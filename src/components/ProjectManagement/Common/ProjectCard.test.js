import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { __mockNavigate as mockNavigate } from '../../../test-utils/react-router-dom-mock';
import ProjectCard from './ProjectCard';

// useNavigate is mapped via moduleNameMapper to our mock; we just import the spy above

describe('ProjectCard navigation', () => {
  it('navigates to rating-project when card is clicked', () => {
    render(<ProjectCard />);

    const card = screen.getByText('프로젝트명').closest('.project-card');
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/project/1/rating-project');
  });
});


