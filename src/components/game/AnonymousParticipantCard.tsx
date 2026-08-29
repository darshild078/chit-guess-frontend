import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { UserRound } from 'lucide-react';

interface AnonymousParticipantCardProps {
  alias: string;
  hasSubmitted: boolean;
  connected: boolean;
}

export function AnonymousParticipantCard({ alias, hasSubmitted, connected }: AnonymousParticipantCardProps) {
  return (
    <Card surface="level-1" className="p-3.5 sm:p-4 flex items-center gap-3.5 border border-zinc-800/80">
      <div className="relative inline-flex">
        <div className="w-11 h-11 rounded-2xl clay-surface-inset flex items-center justify-center text-zinc-400 shadow-inner border border-zinc-800">
          <UserRound size={20} />
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 ${
            connected ? "bg-emerald-500" : "bg-zinc-600"
          }`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-heading font-extrabold text-sm font-mono truncate">
          {alias}
        </h3>
        <p className="text-xs text-zinc-400 font-bold">
          {connected ? 'Online' : 'Disconnected'}
        </p>
      </div>

      <div>
        {hasSubmitted ? (
          <Badge variant="success">Submitted</Badge>
        ) : (
          <Badge variant="warning">Waiting</Badge>
        )}
      </div>
    </Card>
  );
}



