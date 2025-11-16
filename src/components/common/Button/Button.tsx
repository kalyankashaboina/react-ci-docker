import React from 'react';
import styles from './Button.module.scss';

// Extends standard button props for full passthrough of attributes like aria-label, etc.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary'; // Example of a variant prop
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  // Use the variant prop to apply different styles
  const buttonClass = variant === 'secondary' ? styles.buttonSecondary : styles.button;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
