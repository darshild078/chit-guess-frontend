import React from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { LoadingState } from '../components/feedback/LoadingState';
import { PlayerRoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';

export default function PlayerWaitingPage() {
  const { data: room, isLoading } = useRoomView();
  const { data: activity } = useActivity();

  if (isLoading || !room) return <LoadingState />;

  const playerRoom = room as PlayerRoomView;
  const players = (activity || []) as PlayerActivityItem[];

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader title={`Round ${playerRoom.currentRoundNumber}`} />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        
        <Card surface="level-2" className="flex flex-col items-center justify-center py-10 text-center border border-zinc-800">
          <Spinner className="w-8 h-8 mb-4 text-red-500" />
          <h2 className="text-lg font-heading font-extrabold text-white mb-2">Waiting for Host</h2>
          <p className="text-zinc-400 max-w-xs text-xs font-bold leading-relaxed">
            The host is reading out the secret words and getting ready for the next round.
          </p>
        </Card>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">Players</h3>


          <div className="grid gap-2.5">
            {players.map(p => (
              <ParticipantStatusCard 
                key={p.displayName}
                displayName={p.displayName}
                hasSubmitted={p.hasSubmitted}
                connected={p.connected}
                isCurrentPlayer={p.isCurrentPlayer}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

