import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-black sm:p-4 md:p-8">
      {/* Container - constrained on desktop, full width on mobile */}
      <div className="w-full max-w-md bg-bg-navy sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900 relative overflow-hidden flex flex-col sm:h-[850px] shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
