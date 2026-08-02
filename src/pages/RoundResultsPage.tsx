import React from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { useRevealResults } from '../hooks/useInbox';
import { LoadingState } from '../components/feedback/LoadingState';
import { Button } from '../components/ui/Button';
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
    <div className="flex flex-col min-h-full">
      <MobileHeader title={`Round ${results.roundNumber} Results`} />

      <main className="flex-1 p-4 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-4">
        <div className="text-center py-2">
          <h2 className="text-xl font-heading font-bold text-white">All Secret Words Revealed</h2>
          <p className="text-xs text-gray-400">Here is what everyone submitted for Round {results.roundNumber}</p>
        </div>

        <div className="flex flex-col gap-3">
          {results.chits.map((chit) => (
            <div key={chit.chitId} className="bg-gray-900/90 rounded-2xl p-5 border border-gray-800 flex flex-col gap-2 shadow-md">
              <span className="font-heading font-bold text-electric-blue text-lg">{chit.senderDisplayName}</span>
              <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                <p className="text-white text-xl font-semibold tracking-wide text-center">"{chit.body}"</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isOwner ? (
        <BottomActionBar>
          <div className="flex flex-col gap-2 w-full">
            <Button variant="primary" size="lg" onClick={handleNextRound} className="w-full">
              <Play size={18} className="mr-2" /> Start Next Round
            </Button>
            <button onClick={handleEndGame} className="text-xs font-semibold text-red-400 hover:text-red-300 py-1 transition-colors">
              End Game
            </button>
          </div>
        </BottomActionBar>
      ) : (
        <BottomActionBar>
          <div className="text-center text-gray-400 py-3 font-medium text-sm">
            ⏳ Waiting for host to start the next round...
          </div>
        </BottomActionBar>
      )}
    </div>
  );
}
