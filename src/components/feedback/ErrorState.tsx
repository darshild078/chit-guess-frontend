import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <AlertOctagon className="text-error w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-400 mb-6 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
