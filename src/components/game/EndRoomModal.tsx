import React from 'react';
import { Modal } from '../ui/Modal';
import { AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

interface EndRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EndRoomModal({ isOpen, onClose, onConfirm }: EndRoomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="End Room">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
          <AlertOctagon size={32} />
        </div>
        <p className="text-gray-300 mb-8">
          Are you sure you want to end this room for everyone? All players will be disconnected and the game will be permanently closed.
        </p>
        <div className="flex w-full gap-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }} className="flex-1">
            End Room
          </Button>
        </div>
      </div>
    </Modal>
  );
}
