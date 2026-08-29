import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoomCodeCard } from '../components/game/RoomCodeCard';
import { HostControlPanel } from '../components/game/HostControlPanel';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { roomApi } from '../services/room.api';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { HostRoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { BottomActionBar } from '../components/layout/BottomActionBar';

export default function HostLobbyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: room, isLoading, isError, refetch } = useRoomView();
  const { data: activity } = useActivity();

  if (isLoading) return <LoadingState />;
  if (isError || !room) return <ErrorState message="Failed to load room data" onRetry={refetch} />;

  const hostRoom = room as HostRoomView;
  const players = (activity || []) as PlayerActivityItem[];

  const handleStartRound = async () => {
    try {
      await roomApi.startRound();
      queryClient.invalidateQueries({ queryKey: ['roomView'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    } catch (err) {
      console.error('Failed to start round:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader 
        title={hostRoom.title || "ChitGuess"} 
        rightAction={
          <button onClick={() => navigate('/room/settings')} className="p-2 text-zinc-300 hover:text-white rounded-2xl clay-button-secondary transition-all cursor-pointer">
            <Settings size={18} />
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 pb-28 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <RoomCodeCard code={hostRoom.roomCode} />

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1 flex justify-between">
            <span>Players</span>
            <span className="font-mono">{hostRoom.playerCount}/{hostRoom.maxPlayers}</span>
          </h3>
          
          <div className="grid gap-2.5">
            {players.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 font-heading font-bold text-sm clay-surface-inset rounded-2xl border border-zinc-800">
                Waiting for players to join...
              </div>
            ) : (
              players.map(p => (
                <ParticipantStatusCard 
                  key={p.displayName}
                  displayName={p.displayName}
                  hasSubmitted={p.hasSubmitted}
                  connected={p.connected}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <BottomActionBar>
        <HostControlPanel 
          status={hostRoom.status}
          submittedCount={players.filter(p => p.hasSubmitted).length}
          totalPlayers={players.length}
          onStartRound={handleStartRound}
          onOpenSubmissions={() => {}}
          onCloseSubmissions={() => {}}
          onViewInbox={() => {}}
          onRevealIdentities={() => {}}
          onNextRound={() => {}}
          onEndRoom={() => {}}
        />
      </BottomActionBar>
    </div>
  );
}



