import React from 'react';
import { motion } from 'framer-motion';

export function GameLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`font-heading font-extrabold tracking-tight ${sizes[size]} flex flex-col items-center`}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-cyan to-neon-purple animate-pulse-glow leading-none">
        ChitGuess
      </span>
      {size !== 'sm' && (
        <span className="text-sm md:text-base font-sans text-gray-400 mt-2 font-normal tracking-normal">
          The ultimate party game
        </span>
      )}
    </motion.div>
  );
}
