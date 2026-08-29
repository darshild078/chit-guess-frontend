import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Award, CheckCircle2, XCircle, Sparkles, Star } from 'lucide-react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BottomActionBar } from '../components/layout/BottomActionBar';
import { LoadingState } from '../components/feedback/LoadingState';
import { useToast } from '../components/ui/Toast';
import { useSound } from '../hooks/useSound';
import { guessApi } from '../services/guess.api';
import { roomApi } from '../services/room.api';
import { useRoomView } from '../hooks/useRoom';
import { useAuthStore } from '../stores/auth.store';
import { triggerConfetti } from '../utils/confetti';

export default function RoundRevealPage() {
  const { toast } = useToast();
  const { playSound } = useSound();
  const queryClient = useQueryClient();
  const role = useAuthStore(s => s.role);
  const isOwner = role === 'owner';

  const { data: room } = useRoomView();
  const { data: results, isLoading } = useQuery({
    queryKey: ['roundResults'],
    queryFn: guessApi.getRoundResults,
    refetchInterval: 3000,
  });

  const [activeTab, setActiveTab] = useState<'chits' | 'leaderboard'>('chits');

  const nextRoundMutation = useMutation({
    mutationFn: () => roomApi.nextRound(),
    onSuccess: () => {
      playSound('buttonPress');
      toast('Next round started! Enter your words.', 'success');
      queryClient.invalidateQueries({ queryKey: ['roomView'] });
    },
    onError: (err: any) => {
      toast(err.message || 'Failed to start next round', 'error');
    },
  });

  if (isLoading || !results) return <LoadingState message="Revealing identities and calculating scores..." />;

  const isFinal = results.isFinalRound || (room && room.currentRoundNumber >= room.totalRounds);

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader 
        title={`Round ${results.roundNumber} of ${results.totalRounds} — Reveal`} 
      />

      <main className="flex-1 p-4 sm:p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-5">
        {/* Navigation Tabs */}
        <div className="clay-surface-inset rounded-2xl p-1 border border-zinc-800 flex">
          <button
            onClick={() => setActiveTab('chits')}
            className={`flex-1 py-2.5 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer ${
              activeTab === 'chits' 
                ? 'bg-orange-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Revealed Words
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2.5 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'leaderboard' 
                ? 'bg-orange-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy size={14} /> Leaderboard
          </button>
        </div>

        {/* Tab 1: Revealed Chits */}
        {activeTab === 'chits' && (
          <div className="space-y-4">
            {results.chits.map((c, idx) => (
              <motion.div
                key={c.chitId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card surface="level-2" className="p-5 border border-zinc-800 space-y-3.5">
                  <div className="clay-surface-inset rounded-2xl p-4 text-center border border-zinc-800/90">
                    <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-1">Secret Word</span>
                    <p className="text-2xl font-black font-heading text-white tracking-wide">
                      "{c.body}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <span className="text-xs font-heading font-bold text-zinc-400">Written by:</span>
                    <span className="text-sm font-heading font-extrabold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-3 py-1 rounded-xl">
                      {c.authorDisplayName}
                    </span>
                  </div>

                  {/* Guessers */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-wider block">
                      Correct Guessers (+100 pts)
                    </span>
                    {c.correctGuessers.length === 0 ? (
                      <p className="text-xs text-zinc-500 font-bold italic">No one guessed correctly!</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {c.correctGuessers.map(guesser => (
                          <span 
                            key={guesser}
                            className="text-xs font-heading font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded-xl flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            {guesser}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-2.5">
            {results.leaderboard.map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <motion.div
                  key={item.participantId}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card 
                    surface="level-2" 
                    className={`p-4 flex items-center justify-between border ${
                      isFirst ? 'border-orange-500/60 bg-orange-950/20' : 'border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-sm ${
                        idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'clay-surface-inset text-zinc-400'
                      }`}>
                        {item.rank}
                      </div>
                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                          {item.displayName}
                          {isFirst && <Star size={14} className="text-amber-400 fill-amber-400" />}
                        </h4>
                        <span className="text-xs text-zinc-500 font-bold">{item.role === 'owner' ? 'Host' : 'Player'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-mono font-black text-orange-400">{item.score}</span>
                      <span className="text-xs font-bold text-zinc-500 block">PTS</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Actions */}
      <BottomActionBar>
        {isFinal ? (
          <div className="w-full text-center">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={() => {
                triggerConfetti();
                queryClient.invalidateQueries({ queryKey: ['roomView'] });
              }}
            >
              <Trophy size={18} className="mr-2" /> View Final Winners Podium!
            </Button>
          </div>
        ) : isOwner ? (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={nextRoundMutation.isPending}
            onClick={() => nextRoundMutation.mutate()}
          >
            Start Round {(results.roundNumber || 1) + 1} <ArrowRight size={18} className="ml-2" />
          </Button>
        ) : (
          <div className="w-full clay-surface-inset rounded-2xl p-3.5 border border-zinc-800 text-center text-zinc-400 font-heading font-bold text-sm">
            Waiting for host to start Round {(results.roundNumber || 1) + 1}...
          </div>
        )}
      </BottomActionBar>
    </div>
  );
}
