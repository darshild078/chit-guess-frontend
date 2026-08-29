import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const baseClass = "inline-flex items-center justify-center font-heading font-semibold rounded-2xl transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-clay-bg disabled:opacity-50 disabled:pointer-events-none select-none";
    
    const variants = {
      primary: "clay-button-primary text-white",
      secondary: "clay-button-secondary text-slate-200 hover:text-white",
      danger: "clay-button-danger text-white",
      warning: "clay-button-warning text-white",
      ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10 rounded-xl",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-xs font-bold tracking-wide",
      md: "h-11 px-5 text-sm min-w-[110px]",
      lg: "h-13 px-7 text-base w-full",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

