import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameLogo } from '../components/game/GameLogo';
import { Button } from '../components/ui/Button';
import { soundService } from '../services/sound';
import { useAuthStore } from '../stores/auth.store';
import { socketService } from '../services/socket';
import { roomApi } from '../services/room.api';

export default function LandingPage() {
  const navigate = useNavigate();
  const { token, clearSession } = useAuthStore();

  useEffect(() => {
    // If navigating back to Landing page, cleanly leave room session
    if (token) {
      roomApi.leaveRoom().catch(() => {});
      socketService.disconnect();
      clearSession();
    }
  }, [token, clearSession]);

  const handleCreate = () => {
    soundService.buttonPress();
    navigate('/create');
  };

  const handleJoin = () => {
    soundService.buttonPress();
    navigate('/join');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden h-full clay-surface-0">
      <div className="z-10 w-full max-w-sm flex flex-col items-center gap-10">

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center flex flex-col items-center"
        >
          <GameLogo size="xl" />
          <p className="mt-6 text-zinc-300 font-heading font-extrabold text-base sm:text-lg max-w-[280px]">
            Drop a secret word. Guess the player.
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="clay-surface-1 rounded-3xl p-6 flex flex-col gap-4 w-full border border-zinc-800"
        >
          <Button variant="primary" size="lg" onClick={handleCreate}>
            Create Room
          </Button>
          <Button variant="secondary" size="lg" onClick={handleJoin}>
            Join Room
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 text-xs text-zinc-500 font-heading font-extrabold tracking-wider text-center w-full uppercase"
      >
        A tactile party game for friends
      </motion.div>
    </div>
  );
}



