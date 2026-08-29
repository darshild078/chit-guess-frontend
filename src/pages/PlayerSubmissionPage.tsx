import React, { useState } from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoundStatusBanner } from '../components/game/RoundStatusBanner';
import { SubmissionComposer } from '../components/game/SubmissionComposer';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { useSubmissionStatus, useMySubmission, useSubmitChit, useUpdateChit } from '../hooks/useSubmission';
import { LoadingState } from '../components/feedback/LoadingState';
import { PlayerActivityItem } from '../types/participant.types';
import { useToast } from '../components/ui/Toast';
import { useSound } from '../hooks/useSound';
import { Users, CheckCircle2 } from 'lucide-react';

export default function PlayerSubmissionPage() {
  const { data: room, isLoading: roomLoading } = useRoomView();
  const { data: activity } = useActivity();
  const { data: status } = useSubmissionStatus();
  const { data: mine } = useMySubmission();
  const submitChit = useSubmitChit();
  const updateChit = useUpdateChit();
  const { toast } = useToast();
  const { playSound } = useSound();
  
  const [editing, setEditing] = useState(false);

  if (roomLoading || !room) return <LoadingState />;

  const players = (activity || []) as PlayerActivityItem[];
  const isClosed = room.status === 'submissions_closed' || room.status === 'guessing';
  const hasSubmitted = status?.hasSubmitted && !editing;
  const submittedCount = players.filter(p => p.hasSubmitted).length;

  const handleSubmit = async (text: string) => {
    try {
      if (mine && status?.canEdit) {
        await updateChit.mutateAsync(text);
        toast('Secret word updated! ✍️', 'success');
      } else {
        await submitChit.mutateAsync(text);
        playSound('chitSubmitted');
        toast('Secret word submitted! Waiting for other players... 🚀', 'success');
      }
      setEditing(false);
    } catch (err: any) {
      toast(err.message || 'Failed to submit secret word', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader 
        title={`Round ${room.currentRoundNumber} of ${room.totalRounds || 3}`} 
      />

      <main className="flex-1 p-4 sm:p-6 pb-12 overflow-y-auto custom-scrollbar flex flex-col gap-5">
        {/* Live Progress Bar */}
        <div className="clay-surface-inset rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-orange-500" />
            <span className="text-xs font-heading font-extrabold text-white">Submissions Progress</span>
          </div>
          <span className="text-xs font-mono font-black bg-orange-950/80 text-orange-300 border border-orange-800/60 px-3 py-1 rounded-xl">
            {submittedCount}/{players.length} Submitted
          </span>
        </div>
        
        <div className="py-1">
          <SubmissionComposer 
            initialValue={mine?.body || ''}
            isSubmitted={hasSubmitted || false}
            isClosed={isClosed}
            onSubmit={handleSubmit}
            onEdit={isClosed ? undefined : () => setEditing(true)}
          />
        </div>

        {/* Players Status List */}
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">
            Player Status
          </h3>
          <div className="grid gap-2.5">
            {players.map(p => (
              <ParticipantStatusCard 
                key={p.participantId || p.displayName}
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
