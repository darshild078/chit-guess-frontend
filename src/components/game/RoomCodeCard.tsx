import React from 'react';
import { Card } from '../ui/Card';
import { CopyCodeButton } from './CopyCodeButton';
import { ShareRoomButton } from './ShareRoomButton';

export function RoomCodeCard({ code }: { code: string }) {
  return (
    <Card glow className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Room Code</h2>
        <div className="text-6xl font-mono font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple animate-pulse-glow">
          {code}
        </div>
      </div>
      
      <div className="flex gap-4 w-full max-w-[280px]">
        <div className="flex-1">
          <CopyCodeButton code={code} />
        </div>
        <div className="flex-1">
          <ShareRoomButton code={code} />
        </div>
      </div>
    </Card>
  );
}
