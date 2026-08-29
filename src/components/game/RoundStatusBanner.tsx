import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomStatus, RoundStatus } from '../../types/room.types';

export function RoundStatusBanner({ status, roundNumber }: { status: RoomStatus | RoundStatus; roundNumber: number }) {
  const config: Record<string, { color: string; text: string }> = {
    lobby: { color: 'bg-amber-950/90 text-orange-300 border-amber-800/70', text: 'Lobby' },
    waiting: { color: 'bg-amber-950/90 text-orange-300 border-amber-800/70', text: `Round ${roundNumber} — Waiting` },
    submissions_open: { color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60', text: 'Submissions Open' },
    submissions_closed: { color: 'bg-amber-950/80 text-amber-300 border-amber-800/60', text: 'Submissions Closed' },
    guessing: { color: 'bg-amber-950/90 text-orange-300 border-amber-800/70', text: 'Guessing Phase' },
    revealed: { color: 'bg-amber-950/90 text-orange-300 border-amber-800/70', text: 'Identities Revealed' },
    completed: { color: 'bg-zinc-800 text-zinc-300 border-zinc-700', text: 'Round Completed' },
    ended: { color: 'bg-amber-950/90 text-orange-300 border-amber-800/70', text: 'Room Ended' },
  };


  const current = config[status] || config.waiting;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        className={`w-full py-3 px-4 rounded-2xl border text-center font-heading font-extrabold text-xs uppercase tracking-wider clay-badge-tag ${current.color}`}
      >
        {current.text}
      </motion.div>
    </AnimatePresence>
  );
}



