import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4 safe-top safe-bottom">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="clay-surface-2 rounded-3xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col max-h-[85vh] shadow-[16px_16px_40px_rgba(0,0,0,0.8)] border border-zinc-800"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="text-lg font-heading font-extrabold text-white tracking-wide">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 -mr-2 text-zinc-400 hover:text-white rounded-2xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar text-zinc-300">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}



