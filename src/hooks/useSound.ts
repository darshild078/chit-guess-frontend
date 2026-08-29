import { useSoundStore } from '../stores/sound.store';
import { soundService } from '../services/sound';

export function useSound() {
  const muted = useSoundStore((s) => s.muted);
  const toggleMute = useSoundStore((s) => s.toggleMute);

  const playSound = (name: 'playerJoined' | 'chitSubmitted' | 'allSubmitted' | 'identityRevealed' | 'error' | 'buttonPress') => {
    if (muted) return;
    if (name === 'playerJoined') soundService.playerJoined();
    else if (name === 'chitSubmitted') soundService.chitSubmitted();
    else if (name === 'allSubmitted') soundService.allSubmitted();
    else if (name === 'identityRevealed') soundService.identityRevealed();
    else if (name === 'error') soundService.error();
    else if (name === 'buttonPress') soundService.buttonPress();
  };

  return {
    muted,
    toggleMute,
    playSound,
    playJoin: () => soundService.playerJoined(),
    playSubmit: () => soundService.chitSubmitted(),
    playReveal: () => soundService.identityRevealed(),
    playClick: () => soundService.buttonPress(),
  };
}
