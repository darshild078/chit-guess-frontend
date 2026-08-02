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
    <Card className="p-4 flex items-center gap-4 border border-gray-800 bg-gray-900/50">
      <div className="relative inline-flex">
        <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
          <UserRound size={24} />
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-bg-navy ${
            connected ? "bg-neon-green" : "bg-gray-500"
          }`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-200 font-medium font-mono truncate">
          {alias}
        </h3>
        <p className="text-sm text-gray-500">
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
