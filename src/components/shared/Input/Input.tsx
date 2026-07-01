import './Input.css';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={className ? `ui-input ${className}` : 'ui-input'}
    />
  );
}
