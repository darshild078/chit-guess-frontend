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
      <header className="sticky top-0 z-30 pt-safe-top bg-bg-navy/90 backdrop-blur-md border-b border-white/10 shadow-md">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Left Action: Back Button */}
          <div className="w-12 flex items-center">
            {showBack && (
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="p-2 -ml-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={22} />
                <span className="text-xs font-medium hidden sm:inline">Back</span>
              </button>
            )}
          </div>
          
          {/* Title */}
          <div className="flex-1 flex justify-center items-center px-2">
            {typeof title === 'string' ? (
              <h1 className="text-base sm:text-lg font-heading font-semibold text-white truncate max-w-[200px]">
                {title}
              </h1>
            ) : (
              title || <span className="font-heading font-bold text-white tracking-wide">ChitGuess</span>
            )}
          </div>

          {/* Right Action: Custom Action + Menu Drawer Trigger */}
          <div className="w-16 flex items-center justify-end gap-1">
            {rightAction}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <Menu size={22} />
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
