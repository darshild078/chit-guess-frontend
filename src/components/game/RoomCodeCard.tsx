import React from 'react';
import { Card } from '../ui/Card';
import { CopyCodeButton } from './CopyCodeButton';
import { ShareRoomButton } from './ShareRoomButton';

export function RoomCodeCard({ code }: { code: string }) {
  return (
    <Card surface="level-2" className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-3 w-full">
        <h2 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest">Room Code</h2>
        <div className="clay-surface-inset rounded-2xl py-4 px-6 text-4xl sm:text-5xl font-mono font-black tracking-widest text-orange-500 shadow-inner border border-zinc-800">
          {code}
        </div>
      </div>

      
      <div className="flex gap-3 w-full max-w-[280px]">
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



