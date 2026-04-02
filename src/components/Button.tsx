import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    danger: "bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white",
    ghost: "text-slate-400 hover:text-white"
  };

  return (
    <button 
      className={`px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};