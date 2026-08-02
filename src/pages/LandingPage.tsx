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
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-[100dvh]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-blue rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center gap-12">
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <GameLogo size="xl" />
          <p className="mt-4 text-gray-300 font-medium text-lg">Drop a secret word. Guess the player.</p>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-4 w-full"
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
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 text-sm text-gray-500 font-medium text-center w-full"
      >
        A party game for friends
      </motion.div>
    </div>
  );
}
