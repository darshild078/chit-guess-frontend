import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLogo } from '../components/game/GameLogo';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full clay-surface-0 overflow-hidden">

      <GameLogo size="sm" />
      <div className="mt-10 mb-8">
        <h1 className="text-7xl font-heading font-black text-zinc-600 tracking-tight">404</h1>
        <p className="text-zinc-400 font-heading font-extrabold text-sm mt-2">Page not found</p>
      </div>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}


