import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/auth.store';
import { socketService } from '../services/socket';

export default function RoomEndedPage() {
  const navigate = useNavigate();
  const clearSession = useAuthStore(s => s.clearSession);

  useEffect(() => {
    socketService.disconnect();
    clearSession();
  }, [clearSession]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[100dvh]">
      <div className="w-20 h-20 bg-electric-blue/10 text-electric-blue rounded-full flex items-center justify-center mb-6">
        <Flag size={40} />
      </div>
      <h1 className="text-2xl font-heading font-bold text-white mb-3">Room Ended</h1>
      <p className="text-gray-400 mb-8 max-w-xs">
        The host has ended the room. Thanks for playing!
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}
