import React, { useState } from 'react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { useRoomView, useActivity } from '../hooks/useRoom';
import { roomApi } from '../services/room.api';
import { LoadingState } from '../components/feedback/LoadingState';
import { HostRoomView } from '../types/room.types';
import { HostActivityItem } from '../types/participant.types';
import { Button } from '../components/ui/Button';
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
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Settings" showBack />

      <main className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50 flex justify-between items-center">
          <div>
            <h3 className="text-white font-medium">Room Lock</h3>
            <p className="text-sm text-gray-400">Prevent new players from joining</p>
          </div>
          <button 
            onClick={handleToggleLock}
            className={`w-14 h-8 rounded-full transition-colors relative ${hostRoom.locked ? 'bg-error' : 'bg-gray-600'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center ${hostRoom.locked ? 'left-7' : 'left-1'}`}>
              {hostRoom.locked ? <Lock size={14} className="text-error" /> : <Unlock size={14} className="text-gray-600" />}
            </div>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest px-1">Manage Players</h3>
          <div className="grid gap-2">
            {players.map(p => (
              <div key={p.aliasId} className="bg-gray-800/40 rounded-xl p-3 px-4 border border-gray-700/50 flex justify-between items-center">
                <span className="font-mono text-gray-200">{p.alias}</span>
                <button 
                  onClick={() => setRemovePlayerId(p.aliasId)}
                  className="p-2 text-gray-500 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <Button variant="danger" size="lg" onClick={() => setShowEndModal(true)} className="w-full">
            End Game for Everyone
          </Button>
        </div>
      </main>

      <Modal isOpen={!!removePlayerId} onClose={() => setRemovePlayerId(null)} title="Remove Player?">
        <div className="p-4 text-center">
          <p className="text-gray-300 mb-6">This player will be disconnected and cannot rejoin.</p>
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={() => setRemovePlayerId(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleRemove}>Remove</Button>
          </div>
        </div>
      </Modal>

      <EndRoomModal isOpen={showEndModal} onClose={() => setShowEndModal(false)} onConfirm={handleEndRoom} />
    </div>
  );
}
