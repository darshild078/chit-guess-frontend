import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function InvalidRoomPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full clay-surface-0 overflow-hidden">

      <div className="w-16 h-16 clay-surface-inset text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
        <XCircle size={32} />
      </div>
      <h1 className="text-2xl font-heading font-extrabold text-white mb-2 tracking-wide">Room Not Found</h1>
      <p className="text-xs font-sans font-bold text-zinc-400 mb-8 max-w-xs leading-relaxed">
        This room doesn't exist or the code is invalid. Check the code and try again.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}


