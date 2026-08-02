import React from 'react';

interface SubmissionProgressProps {
  submittedCount: number;
  totalCount: number;
}

export function SubmissionProgress({ submittedCount, totalCount }: SubmissionProgressProps) {
  const remaining = Math.max(0, totalCount - submittedCount);
  
  return (
    <div className="w-full text-center py-3 px-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between shadow-sm">
      <span className="text-sm font-medium text-gray-300">Submissions Status</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-neon-green bg-neon-green/10 border border-neon-green/30 px-2.5 py-0.5 rounded-lg">
          {submittedCount} Submitted
        </span>
        <span className="text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
          {remaining} Waiting
        </span>
      </div>
    </div>
  );
}
