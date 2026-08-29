import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center clay-surface-0 sm:p-4 md:p-8">
      {/* Container - constrained on desktop, full width on mobile */}
      <div className="w-full max-w-md bg-[#09090b] sm:rounded-[40px] sm:border-[8px] sm:border-zinc-800/80 relative overflow-hidden flex flex-col sm:h-[850px] shadow-[20px_20px_50px_rgba(0,0,0,0.9),-8px_-8px_24px_rgba(255,255,255,0.02)]">
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}



