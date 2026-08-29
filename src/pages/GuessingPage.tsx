import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles, Star, Coffee, Eye, Flame } from 'lucide-react';
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

  const { data: promptInfo } = useQuery({
    queryKey: ['roundPrompt', room?.roomId, room?.currentRoundNumber],
    queryFn: () => submissionApi.getPrompt(),
    enabled: !!room?.roomId,
  });

  const { data: activity } = useQuery({
    queryKey: ['activity'],
    queryFn: roomApi.getActivity,
    refetchInterval: 2000,
  });

  const [selectedGuesses, setSelectedGuesses] = useState<Record<string, string>>({});
  const [doubleDownChitId, setDoubleDownChitId] = useState<string | null>(null);
  const [isLockedIn, setIsLockedIn] = useState(false);

  const players = (activity || []) as PlayerActivityItem[];
  const otherPlayers = players.filter(p => !p.isCurrentPlayer);
  const wordsToGuess = (words || []).filter(w => !w.isOwnWord);
  const gameMode = promptInfo?.gameMode || room?.gameMode || 'confessions';

  const lockMutation = useMutation({
    mutationFn: (guesses: ChitGuess[]) => guessApi.submitGuesses(guesses),
    onSuccess: () => {
      setIsLockedIn(true);
      playSound('buttonPress');
      toast('Your vote is locked in! 🎯 Waiting for others...', 'success');
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

  const toggleDoubleDown = (chitId: string) => {
    if (isLockedIn) return;
    setDoubleDownChitId(prev => (prev === chitId ? null : chitId));
  };

  const handleLockIn = () => {
    if (gameMode === 'confessions') {
      const unassignedCount = wordsToGuess.length - Object.keys(selectedGuesses).length;
      if (unassignedCount > 0) {
        toast(`Please guess a friend for all confessions (${unassignedCount} remaining)`, 'warning');
        return;
      }
      const payload: ChitGuess[] = Object.entries(selectedGuesses).map(([chitId, guessedParticipantId]) => ({
        chitId,
        guessedParticipantId,
        isDoubleDown: doubleDownChitId === chitId,
      }));
      lockMutation.mutate(payload);
    } else if (gameMode === 'chameleon') {
      const votePlayerId = selectedGuesses['chameleon_vote'];
      if (!votePlayerId) {
        toast('Please select who you think is the Chameleon! 🦎', 'warning');
        return;
      }
      const payload: ChitGuess[] = [{
        chitId: 'chameleon_vote',
        guessedParticipantId: votePlayerId,
        isDoubleDown: doubleDownChitId === 'chameleon_vote',
      }];
      lockMutation.mutate(payload);
    } else if (gameMode === 'roasts') {
      const votedChitId = selectedGuesses['roast_vote'];
      if (!votedChitId) {
        toast('Please vote for your favorite roast! 🎯', 'warning');
        return;
      }
      const targetChit = (words || []).find(w => w.chitId === votedChitId);
      const payload: ChitGuess[] = [{
        chitId: votedChitId,
        guessedParticipantId: targetChit ? (targetChit as any).authorParticipantId || votedChitId : votedChitId,
        isDoubleDown: false,
      }];
      lockMutation.mutate(payload);
    }
  };

  if (loadingWords) return <LoadingState message="Loading round data..." />;

  return (
    <div className="flex flex-col min-h-full clay-surface-0 relative pb-28">
      <MobileHeader 
        title={`Round ${room?.currentRoundNumber || 1} — Voting`} 
      />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-lg mx-auto w-full">
        
        {/* Banner Info */}
        <div className="clay-surface-inset rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {gameMode === 'confessions' && <Coffee size={20} className="text-orange-500" />}
            {gameMode === 'chameleon' && <Eye size={20} className="text-emerald-500" />}
            {gameMode === 'roasts' && <Flame size={20} className="text-purple-500" />}
            <div>
              <h3 className="text-sm font-heading font-extrabold text-white">
                {gameMode === 'confessions' && 'Match Confessions to Friends'}
                {gameMode === 'chameleon' && 'Who is the Chameleon? 🦎'}
                {gameMode === 'roasts' && 'Vote for the Funniest Roast 🎯'}
              </h3>
              <p className="text-xs text-zinc-400 font-bold">
                {gameMode === 'confessions' && 'Star ⭐ your most confident guess (+200 / -50 pts)!'}
                {gameMode === 'chameleon' && 'Catch the Impostor (+100 pts)!'}
                {gameMode === 'roasts' && 'Award +100 pts to the funniest response!'}
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- MODE 1: CONFESSIONS ---------------- */}
        {gameMode === 'confessions' && (
          <div className="space-y-4">
            {(words || []).map((w, idx) => {
              const isOwn = w.isOwnWord;
              const currentGuess = selectedGuesses[w.chitId];
              const isStar = doubleDownChitId === w.chitId;

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
                        <span className="text-xs font-mono font-bold text-zinc-500">Secret #{idx + 1}</span>
                        {isOwn ? (
                          <span className="text-xs font-heading font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
                            Your Secret
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isLockedIn}
                            onClick={() => toggleDoubleDown(w.chitId)}
                            className={`text-xs font-heading font-extrabold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                              isStar
                                ? 'bg-amber-500 text-black border-amber-400 font-black shadow-lg scale-105'
                                : 'clay-surface-inset text-zinc-400 border-zinc-800 hover:text-amber-300'
                            }`}
                          >
                            <Star size={13} className={isStar ? 'fill-black' : ''} />
                            <span>{isStar ? 'Double Down (2x)' : 'Star Wager'}</span>
                          </button>
                        )}
                      </div>

                      <div className="clay-surface-inset rounded-xl p-3 text-center border border-zinc-800/80">
                        <p className="text-base font-heading font-black text-white tracking-wide leading-snug">
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
        )}

        {/* ---------------- MODE 2: THE CHAMELEON ---------------- */}
        {gameMode === 'chameleon' && (
          <div className="space-y-4">
            <h4 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">
              Submitted Clues ({words?.length || 0})
            </h4>

            {/* List of Clues with Author Names */}
            <div className="grid grid-cols-1 gap-2.5">
              {(words || []).map((w, idx) => (
                <div key={w.chitId || idx} className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-400">{w.authorDisplayName || 'Player'}:</span>
                    <p className="text-base font-black text-white mt-0.5">"{w.body}"</p>
                  </div>
                  {w.isOwnWord && (
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Vote for Impostor */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-heading font-extrabold text-emerald-400 uppercase tracking-widest px-1">
                Cast Your Vote: Who is the Chameleon?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {otherPlayers.map(p => {
                  const isSelected = selectedGuesses['chameleon_vote'] === p.participantId;
                  return (
                    <button
                      key={p.participantId || p.displayName}
                      type="button"
                      disabled={isLockedIn}
                      onClick={() => p.participantId && handleSelectPlayer('chameleon_vote', p.participantId)}
                      className={`p-3 text-xs font-heading font-extrabold rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg scale-[1.02]' 
                          : 'clay-surface-inset text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      } ${isLockedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="truncate">{p.displayName}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-black" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MODE 3: FRIEND ROASTS ---------------- */}
        {gameMode === 'roasts' && (
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">
              Select Your Favorite Roast (Cannot vote for your own):
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {(words || []).map((w, idx) => {
                const isOwn = w.isOwnWord;
                const isSelected = selectedGuesses['roast_vote'] === w.chitId;

                return (
                  <button
                    key={w.chitId}
                    type="button"
                    disabled={isOwn || isLockedIn}
                    onClick={() => handleSelectPlayer('roast_vote', w.chitId)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-400 shadow-xl ring-2 ring-purple-400/50 scale-[1.01]'
                        : isOwn
                        ? 'bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-60 cursor-not-allowed'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className={isSelected ? 'text-purple-200' : 'text-zinc-500'}>Response #{idx + 1}</span>
                      {isOwn && <span className="text-orange-400 text-xs font-bold">(Your Answer)</span>}
                      {isSelected && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                    <p className="text-base font-black tracking-wide leading-snug">
                      "{w.body}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Lock In Bottom Bar */}
      <BottomActionBar>
        {isLockedIn ? (
          <div className="w-full clay-surface-inset rounded-2xl p-3.5 border border-emerald-800/60 flex items-center justify-center gap-2 text-emerald-400 font-heading font-bold text-sm">
            <CheckCircle2 size={18} />
            <span>Vote Locked In • Waiting for all players...</span>
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={lockMutation.isPending}
            onClick={handleLockIn}
          >
            <Lock size={18} className="mr-2" /> Lock In My Vote
          </Button>
        )}
      </BottomActionBar>

      {/* Floating Emoji Reaction Bar */}
      <LiveReactionBar />
    </div>
  );
}
