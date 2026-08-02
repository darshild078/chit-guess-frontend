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
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
        <Component
          ref={ref as any}
          className={cn(
            "w-full bg-bg-navy-light border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all resize-none",
            error && "border-error focus:border-error focus:ring-error",
            className
          )}
          {...(props as any)}
        />
        {error && <span className="text-sm text-error">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
