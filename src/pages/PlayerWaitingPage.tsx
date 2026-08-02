import React from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { LoadingState } from '../components/feedback/LoadingState';
import { PlayerRoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { Spinner } from '../components/ui/Spinner';

export default function PlayerWaitingPage() {
  const { data: room, isLoading } = useRoomView();
  const { data: activity } = useActivity();

  if (isLoading || !room) return <LoadingState />;

  const playerRoom = room as PlayerRoomView;
  const players = (activity || []) as PlayerActivityItem[];

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title={`Round ${playerRoom.currentRoundNumber}`} />

      <main className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-900/50 rounded-2xl border border-gray-800">
          <Spinner className="w-10 h-10 mb-4 text-electric-blue" />
          <h2 className="text-xl font-heading font-semibold text-white mb-2">Waiting for Host</h2>
          <p className="text-gray-400 max-w-xs text-sm">
            The host is reading out the secret words and getting ready for the next round.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest px-1">Players</h3>
          <div className="grid gap-2">
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
