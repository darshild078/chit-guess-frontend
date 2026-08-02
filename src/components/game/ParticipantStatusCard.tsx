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
    <Card className="p-4 flex items-center gap-4 transition-all hover:bg-bg-navy/60">
      <ParticipantAvatar name={displayName} online={connected} size="md" />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate flex items-center gap-2">
          {displayName}
          {isCurrentPlayer && <Badge variant="info">You</Badge>}
        </h3>
        <p className="text-sm text-gray-400">
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
