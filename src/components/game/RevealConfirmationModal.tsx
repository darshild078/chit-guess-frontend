import React from 'react';
import { Modal } from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface RevealConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevealConfirmationModal({ isOpen, onClose, onConfirm }: RevealConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reveal Identities?">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-14 h-14 clay-surface-inset text-red-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-zinc-800">
          <AlertTriangle size={28} />
        </div>
        <p className="text-zinc-300 text-sm font-extrabold leading-relaxed mb-6">
          Are you sure you want to reveal who wrote each chit? This will end the guessing phase and this action cannot be undone for this round.
        </p>
        <div className="flex w-full gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }} className="flex-1">
            Reveal
          </Button>
        </div>
      </div>
    </Modal>
  );
}



