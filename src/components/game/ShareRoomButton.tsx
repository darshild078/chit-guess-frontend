import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { soundService } from '../../services/sound';

export function ShareRoomButton({ code }: { code: string }) {
  const [shared, setShared] = useState(false);
  const url = `${window.location.origin}/join/${code}`;

  const handleShare = async () => {
    soundService.buttonPress();
    const shareData = {
      title: 'Join my ChitGuess room!',
      text: `Join my ChitGuess room! Use code ${code} or visit ${url}`,
      url: url,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Button 
      variant="primary" 
      size="sm" 
      onClick={handleShare}
      className="w-full flex gap-2 items-center"
    >
      {shared ? <Check size={18} /> : <Share2 size={18} />}
      {shared ? 'Copied Invite!' : 'Share Room'}
    </Button>
  );
}
