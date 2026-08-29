import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh] clay-surface-0">
      <div className="w-14 h-14 clay-surface-inset rounded-2xl flex items-center justify-center mb-5 text-red-500 shadow-inner border border-zinc-800">
        <AlertOctagon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-heading font-extrabold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-zinc-400 text-xs font-extrabold mb-6 max-w-xs leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}


