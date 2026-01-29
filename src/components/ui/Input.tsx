import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-white/60">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2
            bg-dark-surface
            border border-white/10
            rounded-lg
            text-sm text-white
            placeholder:text-white/30
            focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20
            transition-all duration-200
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
