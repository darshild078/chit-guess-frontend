import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  name?: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, multiline, ...props }, ref) => {
    const Component = multiline ? 'textarea' : 'input';
    
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label className="text-xs font-heading font-bold tracking-wider text-zinc-400 uppercase px-1">{label}</label>}
        <Component
          ref={ref as any}
          className={cn(
            "w-full clay-surface-inset rounded-2xl px-4 py-3.5 text-white font-heading font-semibold placeholder-zinc-500 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:border-orange-500 transition-all duration-150 resize-none disabled:opacity-50",
            error && "ring-1 ring-error border-error/80 focus:ring-error",
            className
          )}

          {...(props as any)}
        />
        {error && <span className="text-xs font-medium text-error px-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';



