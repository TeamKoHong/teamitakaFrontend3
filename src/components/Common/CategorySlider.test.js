import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategorySlider from './CategorySlider';

describe('CategorySlider', () => {
  const defaultProps = {
    category: 'participation',
    name: '참여도',
    description: '프로젝트 참여 정도',
    value: 3,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct initial value', () => {
    render(<CategorySlider {...defaultProps} />);
    
    expect(screen.getByText('참여도')).toBeInTheDocument();
    expect(screen.getByText('프로젝트 참여 정도')).toBeInTheDocument();
    expect(screen.getByText('3점')).toBeInTheDocument();
  });

  test('has proper ARIA attributes', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-label', '참여도 평가');
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '5');
    expect(slider).toHaveAttribute('aria-valuenow', '3');
    expect(slider).toHaveAttribute('aria-valuetext', '3점');
  });

  test('calls onChange when label button is clicked', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const button5 = screen.getByLabelText('5점으로 설정');
    fireEvent.click(button5);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(5);
  });

  test('supports keyboard navigation', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    
    // Test arrow right (increase value)
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(4);
    
    // Test arrow left (decrease value)
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(2);
    
    // Test Home key (minimum value)
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(1);
    
    // Test End key (maximum value)
    fireEvent.keyDown(slider, { key: 'End' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(5);
  });

  test('handles touch events', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    
    // Mock getBoundingClientRect
    slider.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: 100,
    }));
    
    // Simulate touch start at 80% position (should be value 5)
    fireEvent.touchStart(slider, {
      touches: [{ clientX: 80 }]
    });
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('respects disabled state', () => {
    render(<CategorySlider {...defaultProps} disabled={true} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('tabIndex', '-1');
    
    const button5 = screen.getByLabelText('5점으로 설정');
    expect(button5).toBeDisabled();
  });

  test('respects custom min/max values', () => {
    render(<CategorySlider {...defaultProps} min={0} max={10} value={5} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '10');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    
    // Should have 11 label buttons (0-10)
    const labelButtons = screen.getAllByRole('button');
    expect(labelButtons).toHaveLength(11);
  });

  test('handles mouse drag interactions', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    
    // Mock getBoundingClientRect
    slider.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: 100,
    }));
    
    // Simulate mouse down and drag
    fireEvent.mouseDown(slider, { clientX: 60 });
    fireEvent.mouseMove(document, { clientX: 80 });
    fireEvent.mouseUp(document);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('provides visual feedback on interaction', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    
    // Test that slider has proper CSS classes for interaction states
    expect(slider).toHaveClass('sliderTrack');
    
    // Test that slider is focusable
    expect(slider).toHaveAttribute('tabIndex', '0');
  });

  test('supports touch drag gestures', () => {
    render(<CategorySlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    
    // Mock getBoundingClientRect
    slider.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: 100,
    }));
    
    // Simulate touch drag
    fireEvent.touchStart(slider, {
      touches: [{ clientX: 40 }]
    });
    fireEvent.touchMove(document, {
      touches: [{ clientX: 60 }]
    });
    fireEvent.touchEnd(document);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('prevents interaction when disabled', () => {
    const onChangeMock = jest.fn();
    render(<CategorySlider {...defaultProps} onChange={onChangeMock} disabled={true} />);
    
    const slider = screen.getByRole('slider');
    
    // Test keyboard interaction is disabled
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeMock).not.toHaveBeenCalled();
    
    // Test mouse interaction is disabled
    fireEvent.mouseDown(slider, { clientX: 80 });
    expect(onChangeMock).not.toHaveBeenCalled();
    
    // Test touch interaction is disabled
    fireEvent.touchStart(slider, {
      touches: [{ clientX: 80 }]
    });
    expect(onChangeMock).not.toHaveBeenCalled();
  });
});