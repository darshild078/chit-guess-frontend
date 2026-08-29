import React from 'react';
import { Spinner } from '../ui/Spinner';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh] clay-surface-0">
      <Spinner className="w-10 h-10 mb-4 text-red-500" />
      <p className="text-zinc-300 font-heading font-extrabold text-sm tracking-wide">{message}</p>
    </div>
  );
}


