import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'concierge' | 'glass' | 'minimal';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'standard', className = '', ...props }, ref) => {
    const baseStyles = 'rounded-xl transition-smooth-slow overflow-hidden';

    const variantStyles = {
      standard: 'bg-surface-container-lowest p-lg shadow-md hover:shadow-xl hover-lift',
      concierge: 'bg-surface-container-lowest p-lg shadow-md hover:shadow-xl hover-lift relative overflow-hidden',
      glass: 'glass-md p-lg shadow-md hover:shadow-xl hover-lift',
      minimal: 'bg-transparent border border-outline-variant/20 p-lg hover:border-outline-variant/40 transition-smooth-slow',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
