import React from 'react';
import { cn } from '../../utils/cn';

interface ParticipantAvatarProps {
  name: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colors = [
  'bg-red-700', 'bg-zinc-700', 'bg-rose-700', 'bg-red-800',
  'bg-emerald-700', 'bg-amber-700', 'bg-zinc-800', 'bg-red-600'
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
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div className="relative inline-block">
      <div className={cn("rounded-2xl flex items-center justify-center text-white font-extrabold font-heading shadow-md border border-zinc-700/50", sizes[size], bgColor)}>
        {initials}
      </div>
      <div
        className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-zinc-950",
          online ? "bg-emerald-500" : "bg-zinc-600",
          size === 'sm' ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
        )}
      />
    </div>
  );
}


