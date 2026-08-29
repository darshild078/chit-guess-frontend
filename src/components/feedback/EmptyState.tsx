import React from 'react';
import { Card } from '../ui/Card';

export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card surface="level-1" className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 clay-surface-inset rounded-2xl text-slate-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base font-heading font-bold text-white mb-1">{title}</h4>
      <p className="text-xs font-sans text-slate-400 max-w-xs font-medium">{description}</p>
    </Card>
  );
}

