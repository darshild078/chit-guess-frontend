import React, { useState } from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoundStatusBanner } from '../components/game/RoundStatusBanner';
import { SubmissionProgress } from '../components/game/SubmissionProgress';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { AnonymousChitCard } from '../components/game/AnonymousChitCard';
import { HostControlPanel } from '../components/game/HostControlPanel';
import { RevealConfirmationModal } from '../components/game/RevealConfirmationModal';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { useInbox } from '../hooks/useInbox';
import { roomApi } from '../services/room.api';
import { LoadingState } from '../components/feedback/LoadingState';
import { HostRoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { BottomActionBar } from '../components/layout/BottomActionBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MessageSquare, Eye } from 'lucide-react';

export default function HostDashboardPage() {
  const { data: room, isLoading } = useRoomView();
  const { data: activity } = useActivity();
  const { data: inbox, refetch: refetchInbox } = useInbox();

  const [showRevealModal, setShowRevealModal] = useState(false);

  if (isLoading || !room) return <LoadingState />;

  const hostRoom = room as HostRoomView;
  const players = (activity || []) as PlayerActivityItem[];
  const submittedCount = players.filter(p => p.hasSubmitted).length;
  const chits = inbox?.chits || [];

  const handleReveal = async () => {
    try {
      await roomApi.startReveal();
    } catch (err) {
      console.error('Failed to reveal:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader title={`Round ${hostRoom.currentRoundNumber}`} />

      <main className="flex-1 p-4 sm:p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <RoundStatusBanner status={hostRoom.status} roundNumber={hostRoom.currentRoundNumber} />
        
        <div className="py-1">
          <SubmissionProgress submittedCount={submittedCount} totalCount={players.length} />
        </div>

        {/* SUBMITTED SECRET WORDS */}
        {chits.length > 0 && (
          <Card surface="level-2" className="flex flex-col gap-4 border-red-900/60">
            <h3 className="text-xs font-heading font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={16} /> Submitted Secret Words ({chits.length})
            </h3>
            <p className="text-xs text-zinc-300 font-bold">Read each word out loud to the room so players can guess who wrote what!</p>
            
            <div className="flex flex-col gap-3">
              {chits.map((c) => (
                <AnonymousChitCard
                  key={c.anonymousChitId}
                  alias={c.alias}
                  body={c.body}
                />
              ))}
            </div>

            <Button variant="danger" size="lg" className="w-full mt-2" onClick={() => setShowRevealModal(true)}>
              <Eye size={20} className="mr-2" /> Reveal Who Wrote Each Word
            </Button>
          </Card>
        )}

        {/* PLAYER SUBMISSIONS STATUS WITH REAL NAMES */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">Player Submissions Status</h3>
          <div className="grid gap-2.5">
            {players.map(p => (
              <ParticipantStatusCard 
                key={p.displayName}
                displayName={p.displayName}
                hasSubmitted={p.hasSubmitted}
                connected={p.connected}
              />
            ))}
          </div>
        </div>
      </main>

      <BottomActionBar>
        <HostControlPanel 
          status={hostRoom.status}
          submittedCount={submittedCount}
          totalPlayers={players.length}
          onStartRound={() => roomApi.startRound()}
          onOpenSubmissions={() => roomApi.openSubmissions()}
          onCloseSubmissions={() => {
            roomApi.closeSubmissions();
            refetchInbox();
          }}
          onViewInbox={() => refetchInbox()}
          onRevealIdentities={() => setShowRevealModal(true)}
          onNextRound={() => roomApi.startRound()}
          onEndRoom={() => roomApi.endRoom()}
        />
      </BottomActionBar>

      <RevealConfirmationModal 
        isOpen={showRevealModal} 
        onClose={() => setShowRevealModal(false)} 
        onConfirm={handleReveal} 
      />
    </div>
  );
}



