import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-800 text-gray-200 border-gray-700",
    success: "bg-neon-green/20 text-neon-green-light border-neon-green/30",
    warning: "bg-warning/20 text-amber-300 border-warning/30",
    danger: "bg-error/20 text-red-300 border-error/30",
    info: "bg-electric-blue/20 text-blue-300 border-electric-blue/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
