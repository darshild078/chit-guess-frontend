import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LogOut } from 'lucide-react';

interface LeaveRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LeaveRoomModal({ isOpen, onClose, onConfirm }: LeaveRoomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Room">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-14 h-14 clay-surface-inset text-amber-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-zinc-800">
          <LogOut size={28} />
        </div>
        <p className="text-zinc-300 text-sm font-extrabold leading-relaxed mb-6">
          Are you sure you want to leave this room? You will need the room code to rejoin if it hasn't been locked.
        </p>
        <div className="flex w-full gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }} className="flex-1">
            Leave
          </Button>
        </div>
      </div>
    </Modal>
  );
}



