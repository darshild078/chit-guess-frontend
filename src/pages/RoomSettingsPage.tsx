import React, { useState } from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { roomApi } from '../services/room.api';
import { LoadingState } from '../components/feedback/LoadingState';
import { HostRoomView } from '../types/room.types';
import { HostActivityItem } from '../types/participant.types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Trash2, Lock, Unlock } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { EndRoomModal } from '../components/game/EndRoomModal';

export default function RoomSettingsPage() {
  const { data: room, isLoading } = useRoomView();
  const { data: activity } = useActivity();
  const [removePlayerId, setRemovePlayerId] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  if (isLoading || !room) return <LoadingState />;

  const hostRoom = room as HostRoomView;
  const players = (activity || []) as HostActivityItem[];

  const handleToggleLock = () => {
    roomApi.lockRoom(!hostRoom.locked);
  };

  const handleRemove = async () => {
    if (removePlayerId) {
      await roomApi.removePlayer(removePlayerId);
      setRemovePlayerId(null);
    }
  };

  const handleEndRoom = async () => {
    await roomApi.endRoom();
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader title="Settings" showBack />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        
        <Card surface="level-1" className="flex justify-between items-center p-5 border border-zinc-800">
          <div>
            <h3 className="text-white font-heading font-extrabold text-base">Room Lock</h3>
            <p className="text-xs text-zinc-400 font-bold">Prevent new players from joining</p>
          </div>
          <button 
            onClick={handleToggleLock}
            aria-label="Toggle Room Lock"
            className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer clay-surface-inset ${hostRoom.locked ? 'bg-red-950' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full transition-all flex items-center justify-center shadow-md ${hostRoom.locked ? 'left-7 bg-red-600 text-white' : 'left-1 bg-zinc-500 text-white'}`}>
              {hostRoom.locked ? <Lock size={12} /> : <Unlock size={12} />}
            </div>
          </button>
        </Card>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-widest px-1">Manage Players</h3>
          <div className="grid gap-2.5">
            {players.map(p => (
              <Card key={p.aliasId} surface="level-1" className="p-3.5 flex justify-between items-center border border-zinc-800">
                <span className="font-mono font-extrabold text-white text-sm">{p.alias}</span>
                <button 
                  onClick={() => setRemovePlayerId(p.aliasId)}
                  aria-label={`Remove ${p.alias}`}
                  className="p-2 text-zinc-400 hover:text-red-400 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-800">
          <Button variant="danger" size="lg" onClick={() => setShowEndModal(true)} className="w-full">
            End Game for Everyone
          </Button>
        </div>
      </main>

      <Modal isOpen={!!removePlayerId} onClose={() => setRemovePlayerId(null)} title="Remove Player?">
        <div className="p-2 text-center">
          <p className="text-zinc-300 text-sm font-semibold mb-6">This player will be disconnected and cannot rejoin.</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setRemovePlayerId(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleRemove}>Remove</Button>
          </div>
        </div>
      </Modal>



      <EndRoomModal isOpen={showEndModal} onClose={() => setShowEndModal(false)} onConfirm={handleEndRoom} />
    </div>
  );
}

