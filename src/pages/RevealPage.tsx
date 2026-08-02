import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/layout/MobileHeader';
import { useRevealResults } from '../hooks/useInbox';
import { LoadingState } from '../components/feedback/LoadingState';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Button } from '../components/ui/Button';
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
    <div className="flex flex-col min-h-full bg-black">
      <MobileHeader title="Identities Revealed" />

      <main className="flex-1 p-4 pb-28 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative">
        <div className="text-center py-4 space-y-1">
          <h2 className="text-2xl font-heading font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-neon-purple" size={24} /> Reveal Summary
          </h2>
          <p className="text-sm text-gray-400">All entries and their authors for Round {results.roundNumber}</p>
        </div>

        {/* ALL REVEALED ENTRIES IN ONE SINGLE LIST */}
        <div className="flex flex-col gap-3">
          {results.chits.map((chit, index) => (
            <motion.div
              key={chit.chitId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Entry #{index + 1}</span>
                <div className="flex items-center gap-1.5 bg-electric-blue/10 border border-electric-blue/30 px-3 py-1 rounded-full text-xs font-semibold text-white">
                  <User size={14} className="text-electric-blue" />
                  <span>{chit.senderDisplayName}</span>
                </div>
              </div>

              <div className="py-2 text-center bg-black/40 rounded-xl border border-gray-800">
                <p className="text-2xl font-heading font-bold text-white tracking-wide">
                  "{chit.body}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <div className="sticky bottom-0 z-30 pb-safe-bottom bg-bg-navy/90 backdrop-blur-md border-t border-white/10 p-4">
        {isOwner ? (
          <Button variant="primary" size="lg" className="w-full" onClick={handleNextRound}>
            <ArrowRight size={20} className="mr-2" /> Start Next Round
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/room')}>
            Back to Room
          </Button>
        )}
      </div>
    </div>
  );
}
