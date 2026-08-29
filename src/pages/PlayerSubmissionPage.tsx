import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MobileHeader } from '../components/layout/MobileHeader';
import { SubmissionComposer } from '../components/game/SubmissionComposer';
import { ParticipantStatusCard } from '../components/game/ParticipantStatusCard';
import { LiveReactionBar } from '../components/game/LiveReactionBar';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { useSubmissionStatus, useMySubmission, useSubmitChit, useUpdateChit } from '../hooks/useSubmission';
import { submissionApi } from '../services/submission.api';
import { LoadingState } from '../components/feedback/LoadingState';
import { PlayerActivityItem } from '../types/participant.types';
import { useToast } from '../components/ui/Toast';
import { useSound } from '../hooks/useSound';
import { Users, Eye, EyeOff, Sparkles, Coffee, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlayerSubmissionPage() {
  const { data: room, isLoading: roomLoading } = useRoomView();
  const { data: activity } = useActivity();
  const { data: status } = useSubmissionStatus();
  const { data: mine } = useMySubmission();
  const submitChit = useSubmitChit();
  const updateChit = useUpdateChit();
  const { toast } = useToast();
  const { playSound } = useSound();
  
  const [editing, setEditing] = useState(false);
  const [showSecretWord, setShowSecretWord] = useState(false);

  // Fetch current round prompt & Chameleon status
  const { data: promptInfo } = useQuery({
    queryKey: ['roundPrompt', room?.roomId, room?.currentRoundNumber],
    queryFn: () => submissionApi.getPrompt(),
    enabled: !!room?.roomId,
    refetchInterval: 3000,
  });

  if (roomLoading || !room) return <LoadingState />;

  const players = (activity || []) as PlayerActivityItem[];
  const isClosed = room.status === 'submissions_closed' || room.status === 'guessing';
  const hasSubmitted = status?.hasSubmitted && !editing;
  const submittedCount = players.filter(p => p.hasSubmitted).length;

  const handleSubmit = async (text: string) => {
    try {
      if (mine && status?.canEdit) {
        await updateChit.mutateAsync(text);
        toast('Submission updated! ✍️', 'success');
      } else {
        await submitChit.mutateAsync(text);
        playSound('chitSubmitted');
        toast('Submitted! Waiting for other players... 🚀', 'success');
      }
      setEditing(false);
    } catch (err: any) {
      toast(err.message || 'Failed to submit', 'error');
    }
  };

  const gameMode = promptInfo?.gameMode || room.gameMode || 'confessions';

  return (
    <div className="flex flex-col min-h-full clay-surface-0 relative pb-16">
      <MobileHeader 
        title={`Round ${room.currentRoundNumber} of ${room.totalRounds || 3}`} 
      />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-lg mx-auto w-full">
        
        {/* Dynamic Prompt Banner */}
        {gameMode === 'confessions' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-orange-500/40 shadow-lg flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Coffee size={16} />
              <span>Secret Confession Prompt</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-zinc-100 leading-snug">
              {promptInfo?.prompt || "What is a secret truth or funny story you've never told anyone?"}
            </p>
          </motion.div>
        )}

        {gameMode === 'roasts' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/40 shadow-lg flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Flame size={16} />
              <span>Fill in the Blank Prompt</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-zinc-100 leading-snug">
              {promptInfo?.prompt || "Write your absolute funniest response!"}
            </p>
          </motion.div>
        )}

        {gameMode === 'chameleon' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            {/* Topic Header */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Secret Topic:</span>
              <span className="text-sm font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60">
                {promptInfo?.secretTopic || 'Secret Category'}
              </span>
            </div>

            {/* Chameleon vs Innocent Secret Card */}
            {promptInfo?.isChameleon ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/60 shadow-xl text-center space-y-1.5 animate-pulse">
                <div className="text-2xl">🦎</div>
                <h4 className="text-base font-heading font-black text-emerald-300">YOU ARE THE CHAMELEON!</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  You do not know the secret word! Write a clever, vague clue that blends in so nobody suspects you!
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Secret Word:</span>
                  <button
                    type="button"
                    onClick={() => setShowSecretWord(!showSecretWord)}
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1.5 font-bold cursor-pointer"
                  >
                    {showSecretWord ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Tap to Reveal</>}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 text-center min-h-[48px] flex items-center justify-center">
                  {showSecretWord ? (
                    <span className="text-lg font-black text-orange-400 tracking-wide">
                      {promptInfo?.secretWord || '***'}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono tracking-widest">
                      •••••••••••• (tap to see)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 text-center">
                  Write 1 single word or short clue related to this secret word.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Live Progress Bar */}
        <div className="clay-surface-inset rounded-2xl p-3 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-orange-500" />
            <span className="text-xs font-heading font-extrabold text-white">Submissions Progress</span>
          </div>
          <span className="text-xs font-mono font-black bg-orange-950/80 text-orange-300 border border-orange-800/60 px-2.5 py-0.5 rounded-lg">
            {submittedCount}/{players.length}
          </span>
        </div>
        
        {/* Submission Composer */}
        <div className="py-1">
          <SubmissionComposer 
            initialValue={mine?.body || ''}
            isSubmitted={hasSubmitted || false}
            isClosed={isClosed}
            onSubmit={handleSubmit}
            onEdit={isClosed ? undefined : () => setEditing(true)}
          />
        </div>

        {/* Players Status List */}
        <div className="flex flex-col gap-2.5 pt-1">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">
            Player Status
          </h3>
          <div className="grid gap-2">
            {players.map(p => (
              <ParticipantStatusCard 
                key={p.participantId || p.displayName}
                displayName={p.displayName}
                hasSubmitted={p.hasSubmitted}
                connected={p.connected}
                isCurrentPlayer={p.isCurrentPlayer}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Floating Emoji Reactions Bar */}
      <LiveReactionBar />
    </div>
  );
}
