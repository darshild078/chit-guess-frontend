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
    return <div className="text-center text-gray-500 p-8">No secret word chits available.</div>;
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
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
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

      <div className="flex items-center justify-between p-6 bg-bg-navy/90 backdrop-blur pb-safe-bottom">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-gray-800 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="font-mono text-gray-400 font-medium">
          {currentIndex + 1} / {chits.length}
        </div>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === chits.length - 1}
          className="p-3 rounded-full bg-electric-blue text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-electric-blue-light transition-colors shadow-lg shadow-electric-blue/20"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
