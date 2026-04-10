import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

const variantStyles = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg transition-smooth-slow',
  secondary:
    'bg-transparent border border-outline-variant/30 text-on-surface hover:bg-surface-container-low hover:shadow-md transition-smooth-slow',
  ghost: 'bg-transparent text-primary hover:text-primary-container transition-smooth-slow',
  gold: 'bg-secondary text-on-secondary hover:bg-secondary-container hover:shadow-lg transition-smooth-slow',
  glass: 'glass-md text-on-surface hover:shadow-lg transition-smooth-slow',
  outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 transition-smooth-slow',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const baseStyles =
  'font-sans font-medium uppercase tracking-wide rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', asChild: _, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

// Convenience wrapper for Next.js Link styled as Button
interface LinkButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  external = false,
}) => {
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
};
