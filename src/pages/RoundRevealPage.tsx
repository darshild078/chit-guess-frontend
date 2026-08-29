import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, CheckCircle2, XCircle, Sparkles, Star, ShieldAlert, Award, Coffee, Eye, Flame } from 'lucide-react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BottomActionBar } from '../components/layout/BottomActionBar';
import { LoadingState } from '../components/feedback/LoadingState';
import { LiveReactionBar } from '../components/game/LiveReactionBar';
import { useToast } from '../components/ui/Toast';
import { useSound } from '../hooks/useSound';
import { guessApi } from '../services/guess.api';
import { roomApi } from '../services/room.api';
import { submissionApi } from '../services/submission.api';
import { useRoomView } from '../hooks/useRoom';
import { useAuthStore } from '../stores/auth.store';
import { triggerConfetti } from '../utils/confetti';

export default function RoundRevealPage() {
  const { toast } = useToast();
  const { playSound } = useSound();
  const queryClient = useQueryClient();
  const role = useAuthStore(s => s.role);
  const participantId = useAuthStore(s => s.participantId);
  const isOwner = role === 'owner';

  const { data: room } = useRoomView();
  const { data: results, isLoading } = useQuery({
    queryKey: ['roundResults'],
    queryFn: guessApi.getRoundResults,
    refetchInterval: 3000,
  });

  const { data: promptInfo } = useQuery({
    queryKey: ['roundPrompt', room?.roomId, room?.currentRoundNumber],
    queryFn: () => submissionApi.getPrompt(),
    enabled: !!room?.roomId,
  });

  const [activeTab, setActiveTab] = useState<'chits' | 'leaderboard'>('chits');

  const nextRoundMutation = useMutation({
    mutationFn: () => roomApi.nextRound(),
    onSuccess: () => {
      playSound('buttonPress');
      toast('Next round started!', 'success');
      queryClient.invalidateQueries({ queryKey: ['roomView'] });
    },
    onError: (err: any) => {
      toast(err.message || 'Failed to start next round', 'error');
    },
  });

  const chameleonGuessMutation = useMutation({
    mutationFn: (word: string) => guessApi.chameleonGuessWord(word),
    onSuccess: (res: any) => {
      if (res.data?.isCorrect) {
        triggerConfetti();
        toast('🎉 Correct! You stole the secret word (+150 pts)!', 'success');
      } else {
        toast('❌ Incorrect guess!', 'error');
      }
      queryClient.invalidateQueries({ queryKey: ['roundResults'] });
    },
  });

  if (isLoading || !results) return <LoadingState message="Revealing identities and calculating scores..." />;

  const isFinal = results.isFinalRound || (room && room.currentRoundNumber >= room.totalRounds);
  const gameMode = results.gameMode || promptInfo?.gameMode || 'confessions';
  const isCurrentChameleon = results.chameleonParticipantId === participantId;

  return (
    <div className="flex flex-col min-h-full clay-surface-0 relative pb-28">
      <MobileHeader 
        title={`Round ${results.roundNumber} of ${results.totalRounds} — Results`} 
      />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-lg mx-auto w-full">
        
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
            Round Summary
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2.5 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'leaderboard' 
                ? 'bg-orange-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy size={14} /> Live Leaderboard
          </button>
        </div>

        {/* ================= TAB 1: ROUND SUMMARY ================= */}
        {activeTab === 'chits' && (
          <div className="space-y-4">
            
            {/* ---------------- MODE 2: CHAMELEON SUMMARY CARD ---------------- */}
            {gameMode === 'chameleon' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className={`p-5 rounded-2xl border text-center space-y-2.5 ${
                  results.chameleonCaught 
                    ? 'bg-red-950/40 border-red-500/50 text-red-200' 
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                }`}>
                  <span className="text-xs font-heading font-extrabold uppercase tracking-widest block text-zinc-400">
                    The Chameleon Was:
                  </span>
                  <h3 className="text-2xl font-heading font-black text-white">
                    {results.chameleonDisplayName || 'A Player'} 🦎
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-black/40 border border-white/10">
                    {results.chameleonCaught ? '🚨 CAUGHT BY THE ROOM!' : '💨 ESCAPED UNDETECTED (+200 pts)!'}
                  </div>
                  <p className="text-xs text-zinc-400 pt-1">
                    Secret Word was: <strong className="text-orange-400 text-sm">{results.secretWord || '***'}</strong>
                  </p>
                </div>

                {/* Chameleon Last Stand Guess UI */}
                {isCurrentChameleon && results.chameleonCaught && !results.chameleonGuessedWord && promptInfo?.wordChoices && (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/60 shadow-xl space-y-2.5">
                    <h4 className="text-xs font-heading font-black text-amber-300 uppercase tracking-wider text-center">
                      ⚡ Chameleon Last Stand: Guess the Secret Word (+150 pts)!
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {promptInfo.wordChoices.map((choice) => (
                        <button
                          key={choice}
                          type="button"
                          disabled={chameleonGuessMutation.isPending}
                          onClick={() => chameleonGuessMutation.mutate(choice)}
                          className="p-2.5 text-xs font-heading font-extrabold rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-amber-500 hover:text-black hover:border-amber-400 transition-all cursor-pointer truncate"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ---------------- CHIT REVEALS LIST ---------------- */}
            {results.chits.map((c, idx) => (
              <motion.div
                key={c.chitId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card surface="level-2" className="p-4 border border-zinc-800 space-y-3">
                  <div className="clay-surface-inset rounded-2xl p-3.5 text-center border border-zinc-800/90">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                      {gameMode === 'roasts' ? 'Roast Response' : 'Submission'}
                    </span>
                    <p className="text-lg font-black font-heading text-white tracking-wide leading-snug">
                      "{c.body}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
                    <span className="text-xs font-heading font-bold text-zinc-400">Author:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-extrabold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-3 py-0.5 rounded-xl">
                        {c.authorDisplayName}
                      </span>
                      {gameMode === 'roasts' && (
                        <span className="text-xs font-heading font-black text-purple-300 bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Flame size={12} className="text-purple-400" />
                          {c.votesCount || 0} Votes
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stealth Bonus Notice */}
                  {c.stealthBonusAwarded && gameMode === 'confessions' && (
                    <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/60 text-center text-xs font-heading font-black text-purple-300">
                      🥷 Stealth Master Bonus! Fooled everyone (+150 pts)
                    </div>
                  )}

                  {/* Correct Guessers */}
                  {gameMode === 'confessions' && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-heading font-extrabold text-zinc-400 uppercase tracking-wider block">
                        Correct Guessers:
                      </span>
                      {c.correctGuessers.length === 0 ? (
                        <p className="text-xs text-zinc-500 font-bold italic">No one guessed correctly!</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {c.correctGuessers.map(guesser => (
                            <span 
                              key={guesser}
                              className="text-xs font-heading font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} className="text-emerald-400" />
                              {guesser}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= TAB 2: LIVE LEADERBOARD ================= */}
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
                    className={`p-3.5 flex items-center justify-between border ${
                      isFirst ? 'border-orange-500/60 bg-orange-950/20' : 'border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-sm ${
                        idx === 0 ? 'bg-amber-400 text-black shadow-md' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'clay-surface-inset text-zinc-400'
                      }`}>
                        {item.rank}
                      </div>
                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                          {item.displayName}
                          {isFirst && <Star size={14} className="text-amber-400 fill-amber-400" />}
                        </h4>
                        <span className="text-[11px] text-zinc-500 font-bold">{item.role === 'owner' ? 'Host' : 'Player'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-mono font-black text-orange-400">{item.score}</span>
                      <span className="text-[10px] font-bold text-zinc-500 block">PTS</span>
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
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl"
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
          <div className="w-full clay-surface-inset rounded-2xl p-3 border border-zinc-800 text-center text-zinc-400 font-heading font-bold text-sm">
            Waiting for host to start Round {(results.roundNumber || 1) + 1}...
          </div>
        )}
      </BottomActionBar>

      {/* Floating Emoji Reactions Bar */}
      <LiveReactionBar />
    </div>
  );
}
