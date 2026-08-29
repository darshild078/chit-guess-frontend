import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/auth.store';
import { socketService } from '../services/socket';

export default function PlayerRemovedPage() {
  const navigate = useNavigate();
  const clearSession = useAuthStore(s => s.clearSession);

  useEffect(() => {
    socketService.disconnect();
    clearSession();
  }, [clearSession]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full clay-surface-0 overflow-hidden">

      <div className="w-16 h-16 clay-surface-inset text-zinc-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
        <Frown size={32} />
      </div>
      <h1 className="text-2xl font-heading font-extrabold text-white mb-2 tracking-wide">You've been removed</h1>
      <p className="text-xs font-sans font-bold text-zinc-400 mb-8 max-w-xs leading-relaxed">
        The host removed you from the room.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}


