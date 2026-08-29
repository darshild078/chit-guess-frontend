import React, { useState } from 'react';
import { LogOut, Coffee, Eye, Flame } from 'lucide-react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoomCodeCard } from '../components/game/RoomCodeCard';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { LeaveRoomModal } from '../components/game/LeaveRoomModal';
import { LiveReactionBar } from '../components/game/LiveReactionBar';
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

  const modeName = 
    playerRoom.gameMode === 'chameleon' ? 'The Chameleon 🦎' :
    playerRoom.gameMode === 'roasts' ? 'Friend Roasts 🎯' :
    'Secret Confessions ☕';

  return (
    <div className="flex flex-col min-h-full clay-surface-0 relative pb-28">
      <MobileHeader 
        title={playerRoom.title || "ChitGuess"} 
        rightAction={
          <button onClick={() => setShowLeave(true)} className="p-2 text-zinc-300 hover:text-white rounded-2xl clay-button-secondary transition-all cursor-pointer">
            <LogOut size={18} />
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 max-w-lg mx-auto w-full">
        {/* Game Mode Badge */}
        <div className="clay-surface-inset rounded-2xl p-3 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {playerRoom.gameMode === 'chameleon' && <Eye size={18} className="text-emerald-400" />}
            {playerRoom.gameMode === 'roasts' && <Flame size={18} className="text-purple-400" />}
            {(!playerRoom.gameMode || playerRoom.gameMode === 'confessions') && <Coffee size={18} className="text-orange-400" />}
            <span className="text-xs font-heading font-black text-white">{modeName}</span>
          </div>
          <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2.5 py-0.5 rounded-lg">
            {playerRoom.totalRounds || 3} Rounds
          </span>
        </div>

        <RoomCodeCard code={playerRoom.roomCode} />

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1 flex justify-between">
            <span>Players</span>
            <span className="font-mono">{playerRoom.playerCount}/{playerRoom.maxPlayers}</span>
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

      <BottomActionBar>
        <div className="flex items-center justify-center gap-3 py-1">
          <Spinner className="w-5 h-5 text-orange-500" />
          <p className="text-xs font-heading font-extrabold text-zinc-300 tracking-wide">Waiting for host to start...</p>
        </div>
      </BottomActionBar>

      <LeaveRoomModal isOpen={showLeave} onClose={() => setShowLeave(false)} onConfirm={handleLeave} />

      {/* Floating Emoji Reactions Bar */}
      <LiveReactionBar />
    </div>
  );
}
