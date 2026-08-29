import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  surface?: 'level-1' | 'level-2' | 'inset';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow, surface = 'level-1', children, ...props }, ref) => {
    const surfaceClass = {
      'level-1': 'clay-surface-1 rounded-3xl p-5 sm:p-6',
      'level-2': 'clay-surface-2 rounded-3xl p-5 sm:p-6',
      'inset': 'clay-surface-inset rounded-2xl p-4 sm:p-5',
    };

    return (
      <div
        ref={ref}
        className={cn(
          surfaceClass[surface],
          glow && "shadow-[12px_12px_28px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(255,255,255,0.08)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

