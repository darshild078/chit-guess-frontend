import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="fixed bottom-0 left-0 right-0 z-50 clay-surface-2 rounded-t-[32px] max-h-[85vh] flex flex-col pointer-events-auto shadow-[0_-12px_40px_rgba(0,0,0,0.85)] border-t border-zinc-800"
          >
            <div className="w-full flex justify-center pt-3.5 pb-2 cursor-grab" onClick={onClose}>
              <div className="w-12 h-1.5 bg-zinc-600 rounded-full shadow-inner" />
            </div>
            <div className="overflow-y-auto pb-safe custom-scrollbar flex-1 p-4 sm:p-6 text-zinc-100">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



