import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/layout/MobileHeader';
import { RoomCodeCard } from '../components/game/RoomCodeCard';
import { Button } from '../components/ui/Button';
import { useRoomView } from '../hooks/useRoom';
import { LoadingState } from '../components/feedback/LoadingState';

export default function RoomCreatedPage() {
  const navigate = useNavigate();
  const { data: room, isLoading } = useRoomView();

  if (isLoading || !room) {
    return <LoadingState message="Setting up your room..." />;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-navy relative overflow-hidden">
      <MobileHeader />
      
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-electric-blue/10 to-transparent pointer-events-none" />

      <main className="flex-1 p-4 pb-safe-bottom flex flex-col items-center justify-center gap-8 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white">Room Created!</h1>
          <p className="text-gray-400">Share this code with your friends so they can join.</p>
        </div>

        <RoomCodeCard code={room.roomCode} />
        
        <div className="w-full max-w-sm mt-8">
          <Button variant="primary" size="lg" onClick={() => navigate('/room')} className="w-full">
            Enter Room
          </Button>
        </div>
      </main>
    </div>
  );
}
