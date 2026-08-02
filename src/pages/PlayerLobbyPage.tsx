import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoomCodeCard } from '../components/game/RoomCodeCard';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { LeaveRoomModal } from '../components/game/LeaveRoomModal';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { PlayerRoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { useAuthStore } from '../stores/auth.store';
import { socketService } from '../services/socket';
import { Spinner } from '../components/ui/Spinner';

export default function PlayerLobbyPage() {
  const { data: room, isLoading, isError, refetch } = useRoomView();
  const { data: activity } = useActivity();
  const [showLeave, setShowLeave] = useState(false);
  const clearSession = useAuthStore(s => s.clearSession);

  if (isLoading) return <LoadingState />;
  if (isError || !room) return <ErrorState message="Failed to load room data" onRetry={refetch} />;

  const playerRoom = room as PlayerRoomView;
  const players = (activity || []) as PlayerActivityItem[];

  const handleLeave = () => {
    socketService.disconnect();
    clearSession();
  };

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader 
        title={playerRoom.title || "ChitGuess"} 
        rightAction={
          <button onClick={() => setShowLeave(true)} className="p-2 text-gray-400 hover:text-white rounded-full">
            <LogOut size={20} />
          </button>
        }
      />

      <main className="flex-1 p-4 pb-24 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <div className="text-center mb-2">
          <p className="text-gray-400">Host: <span className="text-white font-medium">{playerRoom.hostDisplayName}</span></p>
        </div>

        <RoomCodeCard code={playerRoom.roomCode} />

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest px-1 flex justify-between">
            <span>Players</span>
            <span>{playerRoom.playerCount}/{playerRoom.maxPlayers}</span>
          </h3>
          
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

      <div className="sticky bottom-0 z-30 pb-safe-bottom bg-bg-navy/90 backdrop-blur-md border-t border-white/5 p-6 flex flex-col items-center justify-center">
        <Spinner className="w-8 h-8 mb-3" />
        <p className="text-gray-300 font-medium">Waiting for host to start...</p>
      </div>

      <LeaveRoomModal isOpen={showLeave} onClose={() => setShowLeave(false)} onConfirm={handleLeave} />
    </div>
  );
}
