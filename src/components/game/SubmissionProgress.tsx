import React from 'react';

interface SubmissionProgressProps {
  submittedCount: number;
  totalCount: number;
}

export function SubmissionProgress({ submittedCount, totalCount }: SubmissionProgressProps) {
  const remaining = Math.max(0, totalCount - submittedCount);
  
  return (
    <div className="w-full clay-surface-inset rounded-2xl p-4 flex items-center justify-between shadow-inner border border-zinc-800">
      <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400">Submissions Status</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-heading font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-xl clay-badge-tag">
          {submittedCount} Submitted
        </span>
        <span className="text-xs font-heading font-extrabold text-amber-300 bg-amber-950/80 border border-amber-800/60 px-3 py-1 rounded-xl clay-badge-tag">
          {remaining} Waiting
        </span>
      </div>
    </div>
  );
}



