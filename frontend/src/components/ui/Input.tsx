import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label-md block mb-2 text-on-surface">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-sm
            bg-surface-container-low text-on-surface
            font-sans text-base
            border border-outline-variant/15
            placeholder:text-on-surface/50
            transition-all duration-200
            focus:bg-primary-fixed focus:border-outline-variant/30 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error bg-error-container/10' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-error text-xs mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-on-surface/60 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
