import React from 'react';
import { cn } from '../../utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-8 h-8", className)}>
      <div className="absolute inset-0 rounded-full border-2 border-electric-blue/20"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-electric-blue animate-spin"></div>
    </div>
  );
}
