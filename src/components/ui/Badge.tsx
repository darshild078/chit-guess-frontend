import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-zinc-800 text-zinc-200 border-zinc-700/60",
    success: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
    warning: "bg-amber-950/80 text-amber-300 border-amber-800/60",
    danger: "bg-amber-950/90 text-orange-300 border-amber-800/70",
    info: "bg-amber-950/80 text-orange-400 border-amber-800/60",
  };


  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-xl text-xs font-heading font-extrabold tracking-wide clay-badge-tag",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}



