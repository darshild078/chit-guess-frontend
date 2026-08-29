import React from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { useRevealResults } from '../hooks/useInbox';
import { LoadingState } from '../components/feedback/LoadingState';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { roomApi } from '../services/room.api';
import { useAuthStore } from '../stores/auth.store';
import { BottomActionBar } from '../components/layout/BottomActionBar';
import { Play } from 'lucide-react';

export default function RoundResultsPage() {
  const { data: results, isLoading } = useRevealResults();
  const isOwner = useAuthStore(s => s.isOwner());

  if (isLoading || !results) return <LoadingState message="Loading revealed entries..." />;

  const handleNextRound = async () => {
    try {
      await roomApi.startRound();
    } catch (err) {
      console.error('Failed to start next round:', err);
    }
  };

  const handleEndGame = async () => {
    try {
      await roomApi.endRoom();
    } catch (err) {
      console.error('Failed to end game:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader title={`Round ${results.roundNumber} Results`} />

      <main className="flex-1 p-4 sm:p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-4">
        <div className="text-center py-2 space-y-1">
          <h2 className="text-xl font-heading font-extrabold text-white">All Secret Words Revealed</h2>
          <p className="text-xs text-zinc-400 font-bold">Here is what everyone submitted for Round {results.roundNumber}</p>
        </div>

        <div className="flex flex-col gap-3.5">
          {results.chits.map((chit) => (
            <Card key={chit.chitId} surface="level-2" className="flex flex-col gap-3 border border-zinc-800">
              <span className="font-heading font-extrabold text-red-400 text-base">{chit.senderDisplayName}</span>
              <div className="clay-surface-inset p-3.5 rounded-2xl border border-zinc-800">
                <p className="text-white text-lg sm:text-xl font-heading font-black tracking-wide text-center">"{chit.body}"</p>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {isOwner ? (
        <BottomActionBar>
          <div className="flex flex-col gap-2 w-full">
            <Button variant="primary" size="lg" onClick={handleNextRound} className="w-full">
              <Play size={18} className="mr-2" /> Start Next Round
            </Button>
            <button onClick={handleEndGame} className="text-xs font-heading font-extrabold text-red-400 hover:text-red-300 py-1 transition-colors cursor-pointer">
              End Game
            </button>
          </div>
        </BottomActionBar>
      ) : (
        <BottomActionBar>
          <div className="text-center text-zinc-400 font-heading font-extrabold py-2 text-xs uppercase tracking-wider">
            ⏳ Waiting for host to start the next round...
          </div>
        </BottomActionBar>
      )}


    </div>
  );
}

