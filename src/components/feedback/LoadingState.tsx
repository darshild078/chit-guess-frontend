import React from 'react';
import { Spinner } from '../ui/Spinner';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <Spinner className="w-12 h-12 mb-4" />
      <p className="text-gray-400 font-medium">{message}</p>
    </div>
  );
}
