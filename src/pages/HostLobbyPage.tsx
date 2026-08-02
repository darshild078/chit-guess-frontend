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
    <div className="flex flex-col min-h-full">
      <MobileHeader 
        title={hostRoom.title || "ChitGuess"} 
        rightAction={
          <button onClick={() => navigate('/room/settings')} className="p-2 text-gray-400 hover:text-white rounded-full">
            <Settings size={20} />
          </button>
        }
      />

      <main className="flex-1 p-4 pb-24 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <RoomCodeCard code={hostRoom.roomCode} />

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest px-1 flex justify-between">
            <span>Players</span>
            <span>{hostRoom.playerCount}/{hostRoom.maxPlayers}</span>
          </h3>
          
          <div className="grid gap-2">
            {players.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
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
