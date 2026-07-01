import './Button.css';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={className ? `ui-button ${className}` : 'ui-button'}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
