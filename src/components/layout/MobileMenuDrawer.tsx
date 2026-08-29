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
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] clay-surface-2 p-6 flex flex-col justify-between shadow-[20px_0_50px_rgba(0,0,0,0.85)] border-l border-zinc-800"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-white font-heading font-extrabold text-lg">
                  <span>ChitGuess</span>
                  {isOwner && (
                    <span className="text-xs bg-amber-950/90 text-orange-300 border border-amber-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono clay-badge-tag">
                      <Shield size={12} /> Host
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-2 text-zinc-400 hover:text-white rounded-2xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Room Stats if in a room */}
              {token && (
                <div className="clay-surface-inset rounded-2xl p-4 space-y-2 border border-zinc-800">
                  {roomCode && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                        <Hash size={16} /> Room Code
                      </span>
                      <span className="font-mono font-extrabold text-orange-500 tracking-wider">
                        {roomCode}
                      </span>
                    </div>
                  )}
                  {playerCount !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                        <Users size={16} /> Players
                      </span>
                      <span className="font-extrabold text-white">{playerCount} Active</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleHomeClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left font-heading font-bold text-white clay-button-secondary rounded-2xl transition-all cursor-pointer"
                >
                  <Home size={18} className="text-orange-500" />
                  <span>Home</span>
                </button>

                {token && isOwner && (
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left font-heading font-bold text-white clay-button-secondary rounded-2xl transition-all cursor-pointer"
                  >
                    <Settings size={18} className="text-orange-500" />
                    <span>Room Settings</span>
                  </button>
                )}

                <button
                  onClick={toggleMute}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-heading font-bold text-white clay-button-secondary rounded-2xl transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {muted ? (
                      <VolumeX size={18} className="text-orange-500" />
                    ) : (
                      <Volume2 size={18} className="text-emerald-400" />
                    )}
                    <span>Sound Effects</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    {muted ? 'MUTED' : 'ON'}
                  </span>
                </button>
              </div>

            </div>

            {/* Footer / Leave Room */}
            {token && (
              <div className="pt-4 border-t border-zinc-800">
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



