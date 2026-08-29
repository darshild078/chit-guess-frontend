import React, { useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { MobileHeader } from '../components/layout/MobileHeader';
import { SwipeableChitDeck } from '../components/game/SwipeableChitDeck';
import { RevealConfirmationModal } from '../components/game/RevealConfirmationModal';
import { useInbox } from '../hooks/useInbox';
import { roomApi } from '../services/room.api';
import { inboxApi } from '../services/inbox.api';
import { LoadingState } from '../components/feedback/LoadingState';
import { Button } from '../components/ui/Button';
import { BottomActionBar } from '../components/layout/BottomActionBar';

export default function HostInboxPage() {
  const { data: inbox, isLoading: inboxLoading, refetch } = useInbox();
  const [showRevealModal, setShowRevealModal] = useState(false);

  if (inboxLoading) return <LoadingState />;

  const chits = inbox?.chits || [];

  const handleMarkRead = (chitId: string) => {
    inboxApi.markAsRead(chitId);
  };

  const handleReveal = async () => {
    await roomApi.startReveal();
  };

  return (
    <div className="flex flex-col min-h-full clay-surface-0">
      <MobileHeader 
        title="Anonymous Secret Words" 
        rightAction={
          <button onClick={() => refetch()} className="p-2 text-zinc-300 hover:text-white rounded-2xl clay-button-secondary transition-all cursor-pointer">
            <RefreshCw size={18} />
          </button>


        }
      />

      <main className="flex-1 flex flex-col relative pb-safe-bottom">
        <SwipeableChitDeck 
          chits={chits} 
          onMarkRead={handleMarkRead} 
        />
      </main>
      
      {chits.length > 0 && (
        <BottomActionBar>
          <Button variant="danger" size="lg" className="w-full" onClick={() => setShowRevealModal(true)}>
            <Eye size={20} className="mr-2" /> Reveal Who Wrote Each Word
          </Button>
        </BottomActionBar>
      )}
      
      <RevealConfirmationModal 
        isOpen={showRevealModal} 
        onClose={() => setShowRevealModal(false)} 
        onConfirm={handleReveal} 
      />
    </div>
  );
}

