import React from 'react';
import { cn } from '../../utils/cn';

interface ParticipantAvatarProps {
  name: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colors = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500',
  'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-fuchsia-500'
];

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ParticipantAvatar({ name, online = true, size = 'md' }: ParticipantAvatarProps) {
  const initials = name.substring(0, 2).toUpperCase();
  const bgColor = getColorForName(name);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div className="relative inline-block">
      <div className={cn("rounded-full flex items-center justify-center text-white font-bold font-heading shadow-inner border border-white/10", sizes[size], bgColor)}>
        {initials}
      </div>
      <div
        className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-bg-navy",
          online ? "bg-neon-green" : "bg-gray-500",
          size === 'sm' ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
        )}
      />
    </div>
  );
}
