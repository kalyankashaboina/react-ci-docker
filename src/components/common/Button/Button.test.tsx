// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import styles from './Button.module.scss';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies primary class by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass(styles.button); // default is primary
  });

  it('applies secondary class when variant is secondary', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass(styles.buttonSecondary);
  });

  it('triggers onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const button = screen.getByRole('button', { name: /click/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('passes extra props like aria-label', () => {
    render(
      <Button aria-label="custom-button">Test</Button>
    );
    const button = screen.getByLabelText('custom-button');
    expect(button).toBeInTheDocument();
  });
});
