import { useSoundStore } from '../stores/sound.store';
import { soundService } from '../services/sound';

export function useSound() {
  const muted = useSoundStore((s) => s.muted);
  const toggleMute = useSoundStore((s) => s.toggleMute);

  return {
    muted,
    toggleMute,
    playJoin: () => soundService.playerJoined(),
    playSubmit: () => soundService.chitSubmitted(),
    playReveal: () => soundService.identityRevealed(),
    playClick: () => soundService.buttonPress(),
  };
}
