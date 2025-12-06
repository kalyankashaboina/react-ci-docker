import React from 'react';
import styles from './Button.module.scss';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const buttonClass = variant === 'secondary' ? styles.buttonSecondary : styles.button;
  return (
    <button className={buttonClass} {...props}>
      {' '}
      {children}{' '}
    </button>
  );
};

export default Button;
