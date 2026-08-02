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
    
    const baseClass = "inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-bg-navy disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-gradient-to-r from-electric-blue to-neon-purple text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]",
      secondary: "bg-transparent border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/10",
      danger: "bg-error text-white hover:bg-error/90 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
      ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base min-w-[120px]",
      lg: "h-14 px-8 text-lg w-full",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? {} : { scale: 0.96 }}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
