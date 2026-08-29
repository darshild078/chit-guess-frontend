import React from 'react';
import { motion } from 'framer-motion';

export function GameLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-6xl',
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center select-none"
    >
      <div className="clay-surface-2 px-6 py-3.5 rounded-3xl border border-zinc-800 shadow-[10px_10px_24px_rgba(0,0,0,0.8)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl clay-button-primary flex items-center justify-center font-heading font-extrabold text-xl text-white shadow-inner">
          C
        </div>
        <span className={`font-heading font-extrabold tracking-tight text-white ${sizes[size]} leading-none`}>
          ChitGuess
        </span>
      </div>
      {size !== 'sm' && (
        <span className="text-xs sm:text-sm font-sans font-extrabold text-zinc-400 mt-3 tracking-wide">
          The tactile party secret-word game
        </span>
      )}
    </motion.div>
  );
}



