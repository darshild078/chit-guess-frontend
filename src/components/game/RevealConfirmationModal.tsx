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
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        <p className="text-gray-300 mb-8">
          Are you sure you want to reveal who wrote each chit? This will end the guessing phase and this action cannot be undone for this round.
        </p>
        <div className="flex w-full gap-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }} className="flex-1 bg-gradient-to-r from-error to-rose-600">
            Reveal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
