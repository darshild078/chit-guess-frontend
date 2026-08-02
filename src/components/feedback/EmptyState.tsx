import React from 'react';

export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center opacity-70">
      <div className="text-gray-500 mb-4">{icon}</div>
      <h4 className="text-lg font-medium text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
    </div>
  );
}
