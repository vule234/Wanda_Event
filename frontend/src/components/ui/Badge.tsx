import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'error' | 'glass' | 'outline' | 'accent';
  accent?: 'purple' | 'teal' | 'rose' | 'cyan' | 'emerald';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', accent = 'purple', className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide transition-smooth-slow';

    const variantStyles = {
      default: 'bg-primary-fixed text-primary',
      gold: 'bg-secondary-fixed text-on-secondary',
      error: 'bg-error-container text-error',
      glass: 'glass-sm text-on-surface',
      outline: 'bg-transparent border border-outline-variant/40 text-on-surface hover:border-outline-variant/60',
      accent: `bg-accent-${accent}/10 text-accent-${accent}`,
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
