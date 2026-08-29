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
import { BottomActionBar } from '../components/layout/BottomActionBar';

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
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader 
        title={playerRoom.title || "ChitGuess"} 
        rightAction={
          <button onClick={() => setShowLeave(true)} className="p-2 text-zinc-300 hover:text-white rounded-2xl clay-button-secondary transition-all cursor-pointer">
            <LogOut size={18} />
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 pb-28 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <div className="text-center mb-1">
          <p className="text-xs font-heading font-bold text-zinc-400">Host: <span className="text-white font-extrabold">{playerRoom.hostDisplayName}</span></p>
        </div>

        <RoomCodeCard code={playerRoom.roomCode} />

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1 flex justify-between">
            <span>Players</span>
            <span className="font-mono">{playerRoom.playerCount}/{playerRoom.maxPlayers}</span>
          </h3>
          
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

      <BottomActionBar>
        <div className="flex items-center justify-center gap-3 py-1">
          <Spinner className="w-5 h-5 text-red-500" />
          <p className="text-xs font-heading font-extrabold text-zinc-300 tracking-wide">Waiting for host to start...</p>
        </div>
      </BottomActionBar>

      <LeaveRoomModal isOpen={showLeave} onClose={() => setShowLeave(false)} onConfirm={handleLeave} />
    </div>
  );
}



