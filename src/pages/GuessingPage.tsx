import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Lock, Users, Sparkles, AlertCircle } from 'lucide-react';
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
import { RoundWord, ChitGuess } from '../types/guess.types';
import { PlayerActivityItem } from '../types/participant.types';

export default function GuessingPage() {
  const { toast } = useToast();
  const { playSound } = useSound();
  const queryClient = useQueryClient();

  const { data: room } = useRoomView();
  const { data: words, isLoading: loadingWords } = useQuery({
    queryKey: ['roundWords'],
    queryFn: guessApi.getRoundWords,
    refetchInterval: 3000,
  });

  const { data: activity } = useQuery({
    queryKey: ['activity'],
    queryFn: roomApi.getActivity,
    refetchInterval: 2000,
  });

  const [selectedGuesses, setSelectedGuesses] = useState<Record<string, string>>({});
  const [isLockedIn, setIsLockedIn] = useState(false);

  const players = (activity || []) as PlayerActivityItem[];
  const otherPlayers = players.filter(p => !p.isCurrentPlayer);
  const wordsToGuess = (words || []).filter(w => !w.isOwnWord);

  const lockMutation = useMutation({
    mutationFn: (guesses: ChitGuess[]) => guessApi.submitGuesses(guesses),
    onSuccess: () => {
      setIsLockedIn(true);
      playSound('buttonPress');
      toast('Your guesses are locked in! 🎯 Waiting for others...', 'success');
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
    onError: (err: any) => {
      toast(err.message || 'Failed to submit guesses', 'error');
    },
  });

  const handleSelectPlayer = (chitId: string, participantId: string) => {
    if (isLockedIn) return;
    setSelectedGuesses(prev => ({
      ...prev,
      [chitId]: participantId,
    }));
  };

  const handleLockIn = () => {
    const unassignedCount = wordsToGuess.length - Object.keys(selectedGuesses).length;
    if (unassignedCount > 0) {
      toast(`Please guess a friend for all words (${unassignedCount} remaining)`, 'warning');
      return;
    }

    const payload: ChitGuess[] = Object.entries(selectedGuesses).map(([chitId, guessedParticipantId]) => ({
      chitId,
      guessedParticipantId,
    }));

    lockMutation.mutate(payload);
  };

  if (loadingWords) return <LoadingState message="Loading secret words..." />;

  const lockedCount = players.filter(p => p.hasGuessed).length;

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader 
        title={`Round ${room?.currentRoundNumber || 1} — Guessing`} 
      />

      <main className="flex-1 p-4 sm:p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col gap-5">
        {/* Banner Info */}
        <div className="clay-surface-inset rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles size={20} className="text-orange-500" />
            <div>
              <h3 className="text-sm font-heading font-extrabold text-white">Match Words to Friends</h3>
              <p className="text-xs text-zinc-400 font-bold">Earn +100 points for each correct match!</p>
            </div>
          </div>
          <span className="text-xs font-mono font-extrabold bg-orange-950/80 text-orange-300 border border-orange-800/60 px-2.5 py-1 rounded-xl">
            {lockedCount}/{players.length} Ready
          </span>
        </div>

        {/* Secret Words Cards */}
        <div className="space-y-4">
          {(words || []).map((w, idx) => {
            const isOwn = w.isOwnWord;
            const currentGuess = selectedGuesses[w.chitId];

            return (
              <motion.div
                key={w.chitId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card surface="level-2" className={`p-4 border ${isOwn ? 'border-orange-500/50 bg-orange-950/20' : 'border-zinc-800'}`}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-500">Chit #{idx + 1}</span>
                      {isOwn && (
                        <span className="text-xs font-heading font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
                          Your Word
                        </span>
                      )}
                    </div>

                    <div className="clay-surface-inset rounded-xl p-3 text-center border border-zinc-800/80">
                      <p className="text-xl font-heading font-black text-white tracking-wide">
                        "{w.body}"
                      </p>
                    </div>

                    {!isOwn && (
                      <div className="flex flex-col gap-1.5 pt-1">
                        <label className="text-xs font-heading font-bold text-zinc-400">
                          Who wrote this?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {otherPlayers.map(p => {
                            const isSelected = currentGuess === p.participantId;
                            return (
                              <button
                                key={p.participantId || p.displayName}
                                type="button"
                                disabled={isLockedIn}
                                onClick={() => p.participantId && handleSelectPlayer(w.chitId, p.participantId)}
                                className={`px-3 py-2 text-xs font-heading font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-orange-500 text-black border-orange-400 shadow-md scale-[1.02]' 
                                    : 'clay-surface-inset text-zinc-300 border-zinc-800 hover:border-zinc-700'
                                } ${isLockedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
                              >
                                <span className="truncate">{p.displayName}</span>
                                {isSelected && <CheckCircle2 size={14} className="text-black" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Lock In Bottom Bar */}
      <BottomActionBar>
        {isLockedIn ? (
          <div className="w-full clay-surface-inset rounded-2xl p-3.5 border border-emerald-800/60 flex items-center justify-center gap-2 text-emerald-400 font-heading font-bold text-sm">
            <CheckCircle2 size={18} />
            <span>Guesses Locked In • Waiting for all players...</span>
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={lockMutation.isPending}
            onClick={handleLockIn}
          >
            <Lock size={18} className="mr-2" /> Lock In My Guesses
          </Button>
        )}
      </BottomActionBar>
    </div>
  );
}
