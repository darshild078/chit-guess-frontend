import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../../services/socket';

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

const EMOJIS = ['🔥', '💀', '🤣', '🤡', '😱', '💩', '❤️'];

export const LiveReactionBar: React.FC = () => {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReaction = (data: { emoji: string }) => {
      const newEmoji: FloatingEmoji = {
        id: Math.random().toString(36).substring(2, 9),
        emoji: data.emoji,
        x: Math.floor(Math.random() * 80) + 10, // random percentage across screen width
      };
      setFloatingEmojis((prev) => [...prev.slice(-20), newEmoji]);
    };

    socket.on('reaction:received', handleReaction);
    return () => {
      socket.off('reaction:received', handleReaction);
    };
  }, []);

  const sendReaction = (emoji: string) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('reaction:send', { emoji });
    }
  };

  return (
    <>
      {/* Floating Emoji Particles Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: '85vh', scale: 0.8, x: `${item.x}vw` }}
              animate={{
                opacity: [1, 1, 0],
                y: ['85vh', '30vh', '10vh'],
                scale: [0.8, 1.4, 1.8],
                x: [`${item.x}vw`, `${item.x + (Math.random() * 10 - 5)}vw`],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              onAnimationComplete={() => {
                setFloatingEmojis((prev) => prev.filter((e) => e.id !== item.id));
              }}
              className="absolute text-4xl select-none"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Action Button Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-1.5 sm:gap-2">
        {EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => sendReaction(emoji)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-lg sm:text-xl rounded-full hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </>
  );
};
