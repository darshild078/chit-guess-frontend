import React, { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { HostActivityItem } from '../../types/participant.types';
import { Button } from '../ui/Button';
import { UserRound, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface GuessPlayerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  players: HostActivityItem[];
  onConfirm: (aliasId: string) => void;
}

export function GuessPlayerSheet({ isOpen, onClose, players, onConfirm }: GuessPlayerSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onConfirm(selectedId);
      setSelectedId(null);
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-xl font-heading font-semibold text-white mb-2">Who wrote this?</h3>
        
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
          {players.map((p) => {
            const isSelected = selectedId === p.aliasId;
            return (
              <button
                key={p.aliasId}
                onClick={() => setSelectedId(p.aliasId)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                  isSelected 
                    ? "bg-electric-blue/20 border-electric-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                    : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isSelected ? "bg-electric-blue text-white" : "bg-gray-700 text-gray-400")}>
                    <UserRound size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-white font-mono">{p.alias}</div>
                    <div className="text-xs text-gray-500">{p.connected ? 'Online' : 'Offline'}</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="text-electric-blue" size={24} />}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-800 flex gap-3 mt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedId} className="flex-1">Confirm Guess</Button>
        </div>
      </div>
    </BottomSheet>
  );
}
