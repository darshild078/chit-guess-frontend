import React from 'react';

export function BottomActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-30 pb-safe-bottom bg-bg-navy/80 backdrop-blur-md border-t border-white/5 p-4 mt-auto">
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
