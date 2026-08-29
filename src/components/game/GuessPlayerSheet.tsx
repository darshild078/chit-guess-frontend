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
      <div className="p-2 sm:p-4 flex flex-col gap-4">
        <h3 className="text-lg font-heading font-extrabold text-white mb-1">Who wrote this secret word?</h3>
        
        <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
          {players.map((p) => {
            const isSelected = selectedId === p.aliasId;
            return (
              <button
                key={p.aliasId}
                onClick={() => setSelectedId(p.aliasId)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left cursor-pointer",
                  isSelected 
                    ? "clay-button-primary border-orange-500" 
                    : "clay-button-secondary"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isSelected ? "bg-white/20 text-white" : "clay-surface-inset text-zinc-400 shadow-inner border border-zinc-800")}>
                    <UserRound size={18} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm font-mono text-white">{p.alias}</div>
                    <div className={cn("text-xs font-bold", isSelected ? "text-orange-100" : "text-zinc-400")}>{p.connected ? 'Online' : 'Offline'}</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="text-white" size={22} />}
              </button>

            );
          })}
        </div>

        <div className="pt-4 border-t border-zinc-800 flex gap-3 mt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedId} className="flex-1">Confirm Guess</Button>
        </div>
      </div>
    </BottomSheet>
  );
}



