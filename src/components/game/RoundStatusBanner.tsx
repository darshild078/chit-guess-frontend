import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomStatus, RoundStatus } from '../../types/room.types';

export function RoundStatusBanner({ status, roundNumber }: { status: RoomStatus | RoundStatus; roundNumber: number }) {
  const config: Record<string, { color: string; text: string }> = {
    lobby: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'Lobby' },
    waiting: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: `Round ${roundNumber} — Waiting` },
    submissions_open: { color: 'bg-neon-green/20 text-neon-green-light border-neon-green/30', text: 'Submissions Open' },
    submissions_closed: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', text: 'Submissions Closed' },
    guessing: { color: 'bg-neon-purple/20 text-purple-300 border-neon-purple/30', text: 'Guessing Phase' },
    revealed: { color: 'bg-cyan/20 text-cyan-300 border-cyan/30', text: 'Identities Revealed' },
    completed: { color: 'bg-gray-800 text-gray-300 border-gray-700', text: 'Round Completed' },
    ended: { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'Room Ended' },
  };

  const current = config[status] || config.waiting;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className={`w-full py-2.5 px-4 rounded-xl border text-center font-heading font-semibold text-sm shadow-sm ${current.color}`}
      >
        {current.text}
      </motion.div>
    </AnimatePresence>
  );
}
