import React from 'react';
import { Card } from '../ui/Card';
import { ParticipantAvatar } from './ParticipantAvatar';
import { Badge } from '../ui/Badge';

interface ParticipantStatusCardProps {
  displayName: string;
  hasSubmitted: boolean;
  connected: boolean;
  isCurrentPlayer?: boolean;
}

export function ParticipantStatusCard({ displayName, hasSubmitted, connected, isCurrentPlayer }: ParticipantStatusCardProps) {
  return (
    <Card surface="level-1" className="p-3.5 sm:p-4 flex items-center gap-3.5 transition-all border border-zinc-800/80">
      <ParticipantAvatar name={displayName} online={connected} size="md" />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-heading font-extrabold text-sm truncate flex items-center gap-2">
          {displayName}
          {isCurrentPlayer && <Badge variant="info">You</Badge>}
        </h3>
        <p className="text-xs text-zinc-400 font-bold mt-0.5">
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



