import React from 'react';

export function BottomActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-30 pb-safe-bottom clay-surface-1 border-t border-zinc-800/80 rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.7)] p-4 sm:p-5 mt-auto">
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}



