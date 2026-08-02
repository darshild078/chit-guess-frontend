import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLogo } from '../components/game/GameLogo';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[100dvh]">
      <GameLogo size="sm" />
      <div className="mt-12 mb-8">
        <h1 className="text-8xl font-heading font-black text-gray-800">404</h1>
        <p className="text-gray-400 mt-4">Page not found</p>
      </div>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}
