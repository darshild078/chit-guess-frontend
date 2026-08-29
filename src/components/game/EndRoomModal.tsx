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
        <div className="w-14 h-14 clay-surface-inset text-red-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-zinc-800">
          <AlertOctagon size={28} />
        </div>
        <p className="text-zinc-300 font-extrabold text-sm leading-relaxed mb-6">
          Are you sure you want to end this room for everyone? All players will be disconnected and the game will be permanently closed.
        </p>

        <div className="flex w-full gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
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



