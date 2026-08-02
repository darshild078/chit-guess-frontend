import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Home, Volume2, VolumeX, LogOut, Settings, Hash, Users, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useSoundStore } from '../../stores/sound.store';
import { roomApi } from '../../services/room.api';
import { Button } from '../ui/Button';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode?: string;
  playerCount?: number;
}

export function MobileMenuDrawer({ isOpen, onClose, roomCode, playerCount }: MobileMenuDrawerProps) {
  const navigate = useNavigate();
  const { token, role, clearSession } = useAuthStore();
  const { muted, toggleMute } = useSoundStore();
  const isOwner = role === 'owner';

  const handleLeaveRoom = async () => {
    try {
      if (token) {
        await roomApi.leaveRoom();
      }
    } catch (e) {
      // Ignore
    } finally {
      clearSession();
      onClose();
      navigate('/', { replace: true });
    }
  };

  const handleHomeClick = () => {
    onClose();
    navigate('/');
  };

  const handleSettingsClick = () => {
    onClose();
    navigate('/room/settings');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-gray-900 border-l border-gray-800 p-6 flex flex-col justify-between shadow-2xl"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-lg">
                  <span>ChitGuess</span>
                  {isOwner && (
                    <span className="text-xs bg-electric-blue/20 text-electric-blue px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <Shield size={12} /> Host
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Room Stats if in a room */}
              {token && (
                <div className="bg-gray-800/60 rounded-xl p-4 space-y-2 border border-gray-700/50">
                  {roomCode && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Hash size={16} /> Room Code
                      </span>
                      <span className="font-mono font-bold text-electric-blue tracking-wider">
                        {roomCode}
                      </span>
                    </div>
                  )}
                  {playerCount !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Users size={16} /> Players
                      </span>
                      <span className="font-medium text-white">{playerCount} Active</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleHomeClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <Home size={20} className="text-electric-blue" />
                  <span>Home</span>
                </button>

                {token && isOwner && (
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Settings size={20} className="text-neon-purple" />
                    <span>Room Settings</span>
                  </button>
                )}

                <button
                  onClick={toggleMute}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {muted ? (
                      <VolumeX size={20} className="text-red-400" />
                    ) : (
                      <Volume2 size={20} className="text-neon-green" />
                    )}
                    <span>Sound Effects</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {muted ? 'MUTED' : 'ON'}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer / Leave Room */}
            {token && (
              <div className="pt-4 border-t border-gray-800">
                <Button variant="danger" size="md" className="w-full" onClick={handleLeaveRoom}>
                  <LogOut size={18} className="mr-2" /> Leave Room
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
