import React, { useState } from 'react';
import { ChevronLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { useAuthStore } from '../../stores/auth.store';
import { useRoomView } from '../../hooks/useRoom';

interface MobileHeaderProps {
  title?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function MobileHeader({ title, showBack = true, onBack, rightAction }: MobileHeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useAuthStore(s => s.token);
  const { data: room } = useRoomView();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 pt-safe-top clay-surface-1 border-b border-zinc-800/80 rounded-b-3xl shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Left Action: Back Button */}
          <div className="w-12 flex items-center">
            {showBack && (
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="p-2 -ml-2 text-zinc-300 hover:text-white rounded-2xl clay-button-secondary flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={18} />
                <span className="text-xs font-heading font-bold hidden sm:inline">Back</span>
              </button>
            )}
          </div>
          
          {/* Title */}
          <div className="flex-1 flex justify-center items-center px-2">
            {typeof title === 'string' ? (
              <h1 className="text-base sm:text-lg font-heading font-extrabold text-white truncate max-w-[200px] tracking-wide">
                {title}
              </h1>
            ) : (
              title || <span className="font-heading font-extrabold text-white tracking-wider">ChitGuess</span>
            )}
          </div>

          {/* Right Action: Custom Action + Menu Drawer Trigger */}
          <div className="w-16 flex items-center justify-end gap-1.5">
            {rightAction}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 text-zinc-300 hover:text-white rounded-2xl clay-button-secondary transition-all active:scale-95 cursor-pointer"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* On-screen Slide-Out Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        roomCode={room?.roomCode}
        playerCount={room?.playerCount}
      />
    </>
  );
}



