import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnonymousChit } from '../../types/inbox.types';
import { AnonymousChitCard } from './AnonymousChitCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableChitDeckProps {
  chits: AnonymousChit[];
  onMarkRead?: (chitId: string) => void;
}

export function SwipeableChitDeck({ chits, onMarkRead }: SwipeableChitDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!chits || chits.length === 0) {
    return <div className="text-center text-zinc-400 font-extrabold p-8">No secret word chits available.</div>;
  }

  const handleNext = () => {
    if (currentIndex < chits.length - 1) {
      if (!chits[currentIndex].isRead && onMarkRead) onMarkRead(chits[currentIndex].anonymousChitId);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const currentChit = chits[currentIndex];

  return (
    <div className="flex flex-col h-full max-w-md w-full mx-auto relative">
      <div className="flex-1 relative flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChit.anonymousChitId}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full absolute"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -100) handleNext();
              else if (swipe > 100) handlePrev();
            }}
          >
            <AnonymousChitCard 
              alias={currentChit.alias}
              body={currentChit.body}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between p-6 clay-surface-1 rounded-t-3xl border-t border-zinc-800 pb-safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.75)]">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          aria-label="Previous chit"
          className="w-12 h-12 rounded-2xl clay-button-secondary text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="font-mono font-extrabold text-zinc-300 clay-surface-inset px-4 py-2 rounded-xl text-xs tracking-wider border border-zinc-800">
          {currentIndex + 1} / {chits.length}
        </div>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === chits.length - 1}
          aria-label="Next chit"
          className="w-12 h-12 rounded-2xl clay-button-primary text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}



