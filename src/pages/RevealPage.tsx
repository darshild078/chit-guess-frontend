import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/layout/MobileHeader';
import { useRevealResults } from '../hooks/useInbox';
import { LoadingState } from '../components/feedback/LoadingState';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BottomActionBar } from '../components/layout/BottomActionBar';
import { roomApi } from '../services/room.api';

export default function RevealPage() {
  const { data: results, isLoading } = useRevealResults();
  const isOwner = useAuthStore(s => s.isOwner());
  const navigate = useNavigate();

  if (isLoading || !results) return <LoadingState />;

  const handleNextRound = async () => {
    try {
      await roomApi.startRound();
      navigate('/room');
    } catch (err) {
      console.error(err);
      navigate('/room');
    }
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader title="Identities Revealed" />

      <main className="flex-1 p-4 sm:p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative">
        <div className="text-center py-2 space-y-1">
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-red-500" size={22} /> Reveal Summary
          </h2>
          <p className="text-xs font-sans font-bold text-zinc-400">All entries and their authors for Round {results.roundNumber}</p>
        </div>

        {/* ALL REVEALED ENTRIES IN ONE SINGLE LIST */}
        <div className="flex flex-col gap-4">
          {results.chits.map((chit, index) => (
            <motion.div
              key={chit.chitId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card surface="level-2" className="flex flex-col gap-3 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-zinc-400 uppercase tracking-wider">Entry #{index + 1}</span>
                  <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-800/70 px-3 py-1 rounded-xl text-xs font-heading font-extrabold text-red-300 clay-badge-tag">
                    <User size={14} className="text-red-400" />
                    <span>{chit.senderDisplayName}</span>
                  </div>
                </div>

                <div className="py-3 text-center clay-surface-inset rounded-2xl p-4 border border-zinc-800">
                  <p className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide">
                    "{chit.body}"
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>


      </main>

      <BottomActionBar>
        {isOwner ? (
          <Button variant="primary" size="lg" className="w-full" onClick={handleNextRound}>
            <ArrowRight size={20} className="mr-2" /> Start Next Round
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/room')}>
            Back to Room
          </Button>
        )}
      </BottomActionBar>
    </div>
  );
}

