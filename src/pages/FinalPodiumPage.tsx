import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Home, RotateCcw, Sparkles } from 'lucide-react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BottomActionBar } from '../components/layout/BottomActionBar';
import { LoadingState } from '../components/feedback/LoadingState';
import { guessApi } from '../services/guess.api';
import { useAuthStore } from '../stores/auth.store';
import { triggerConfetti } from '../utils/confetti';

export default function FinalPodiumPage() {
  const navigate = useNavigate();
  const clearSession = useAuthStore(s => s.clearSession);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: guessApi.getLeaderboard,
  });

  useEffect(() => {
    triggerConfetti();
    const timer = setTimeout(() => triggerConfetti(), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !leaderboard) return <LoadingState message="Calculating final standings..." />;

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];
  const restPlayers = leaderboard.slice(3);

  const handleGoHome = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader title="Game Complete — Winners!" />

      <main className="flex-1 p-4 sm:p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-6 items-center">
        {/* Celebration Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <span className="text-xs font-mono font-black uppercase tracking-widest text-orange-400 bg-orange-950/80 border border-orange-800/60 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Sparkles size={14} /> Final Leaderboard
          </span>
          <h2 className="text-2xl font-heading font-black text-white">Victory Podium</h2>
        </motion.div>

        {/* Podium Display */}
        <div className="w-full max-w-sm flex items-end justify-center gap-2 pt-8">
          {/* 2nd Place */}
          {secondPlace && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-300 text-black flex items-center justify-center font-heading font-black text-base shadow-lg mb-2 border-2 border-white">
                2
              </div>
              <span className="text-xs font-heading font-bold text-zinc-300 truncate max-w-[80px]">{secondPlace.displayName}</span>
              <span className="text-xs font-mono font-extrabold text-zinc-400">{secondPlace.score} pts</span>
              <div className="w-full h-24 bg-gradient-to-t from-zinc-800 to-zinc-700 rounded-t-2xl mt-2 flex items-center justify-center border-t-2 border-zinc-400">
                <Medal size={24} className="text-zinc-300" />
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {firstPlace && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex flex-col items-center -mt-6 z-10"
            >
              <Crown size={28} className="text-amber-400 fill-amber-400 animate-bounce mb-1" />
              <div className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center font-heading font-black text-xl shadow-xl mb-2 border-2 border-white">
                1
              </div>
              <span className="text-sm font-heading font-black text-white truncate max-w-[90px]">{firstPlace.displayName}</span>
              <span className="text-xs font-mono font-black text-amber-400">{firstPlace.score} pts</span>
              <div className="w-full h-32 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-2xl mt-2 flex items-center justify-center border-t-2 border-white text-black shadow-lg">
                <Trophy size={32} className="text-black" />
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {thirdPlace && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-heading font-black text-base shadow-lg mb-2 border-2 border-amber-600">
                3
              </div>
              <span className="text-xs font-heading font-bold text-zinc-300 truncate max-w-[80px]">{thirdPlace.displayName}</span>
              <span className="text-xs font-mono font-extrabold text-amber-600">{thirdPlace.score} pts</span>
              <div className="w-full h-18 bg-gradient-to-t from-zinc-900 to-amber-900/60 rounded-t-2xl mt-2 flex items-center justify-center border-t-2 border-amber-700">
                <Medal size={22} className="text-amber-600" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Other Players */}
        {restPlayers.length > 0 && (
          <div className="w-full space-y-2 pt-4">
            <h4 className="text-xs font-heading font-extrabold text-zinc-500 uppercase tracking-widest px-1">Other Standings</h4>
            {restPlayers.map(p => (
              <Card key={p.participantId} surface="level-2" className="p-3.5 flex items-center justify-between border border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono font-bold text-xs text-zinc-500">#{p.rank}</span>
                  <span className="text-xs font-heading font-extrabold text-zinc-200">{p.displayName}</span>
                </div>
                <span className="text-xs font-mono font-black text-orange-400">{p.score} PTS</span>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomActionBar>
        <Button variant="primary" size="lg" className="w-full" onClick={handleGoHome}>
          <Home size={18} className="mr-2" /> Return to Home
        </Button>
      </BottomActionBar>
    </div>
  );
}
