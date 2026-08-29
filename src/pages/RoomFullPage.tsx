import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function RoomFullPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full clay-surface-0 overflow-hidden">

      <div className="w-16 h-16 clay-surface-inset text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
        <Users size={32} />
      </div>
      <h1 className="text-2xl font-heading font-extrabold text-white mb-2 tracking-wide">Room is Full</h1>
      <p className="text-xs font-sans font-bold text-zinc-400 mb-8 max-w-xs leading-relaxed">
        This room has reached its maximum number of players and cannot accept any more.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}


