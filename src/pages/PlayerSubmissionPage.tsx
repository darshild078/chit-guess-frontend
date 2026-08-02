import React, { useState } from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoundStatusBanner } from '../components/game/RoundStatusBanner';
import { SubmissionComposer } from '../components/game/SubmissionComposer';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { useSubmissionStatus, useMySubmission, useSubmitChit, useUpdateChit } from '../hooks/useSubmission';
import { LoadingState } from '../components/feedback/LoadingState';
import { PlayerRoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { useToast } from '../components/ui/Toast';

export default function PlayerSubmissionPage() {
  const { data: room, isLoading: roomLoading } = useRoomView();
  const { data: activity } = useActivity();
  const { data: status } = useSubmissionStatus();
  const { data: mine } = useMySubmission();
  const submitChit = useSubmitChit();
  const updateChit = useUpdateChit();
  const { toast } = useToast();
  
  const [editing, setEditing] = useState(false);

  if (roomLoading || !room) return <LoadingState />;

  const playerRoom = room as PlayerRoomView;
  const players = (activity || []) as PlayerActivityItem[];
  
  const isClosed = playerRoom.status === 'submissions_closed' || playerRoom.status === 'guessing';
  const hasSubmitted = status?.hasSubmitted && !editing;

  const handleSubmit = async (text: string) => {
    try {
      if (mine && status?.canEdit) {
        await updateChit.mutateAsync(text);
      } else {
        await submitChit.mutateAsync(text);
      }
      setEditing(false);
    } catch (err: any) {
      toast(err.message || 'Failed to submit', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title={`Round ${playerRoom.currentRoundNumber} — Write Your Chit`} />

      <main className="flex-1 p-4 pb-12 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <RoundStatusBanner status={playerRoom.status} roundNumber={playerRoom.currentRoundNumber} />
        
        <div className="py-2">
          <SubmissionComposer 
            initialValue={mine?.body || ''}
            isSubmitted={hasSubmitted || false}
            isClosed={isClosed}
            onSubmit={handleSubmit}
            onEdit={isClosed ? undefined : () => setEditing(true)}
          />
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
