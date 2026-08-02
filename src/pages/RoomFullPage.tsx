import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function RoomFullPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[100dvh]">
      <div className="w-20 h-20 bg-warning/10 text-warning rounded-full flex items-center justify-center mb-6">
        <Users size={40} />
      </div>
      <h1 className="text-2xl font-heading font-bold text-white mb-3">Room is Full</h1>
      <p className="text-gray-400 mb-8 max-w-xs">
        This room has reached its maximum number of players and cannot accept any more.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}
