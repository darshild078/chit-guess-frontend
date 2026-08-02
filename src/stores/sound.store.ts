import { create } from 'zustand';

interface SoundState {
  muted: boolean;
  toggleMute: () => void;
}

export const useSoundStore = create<SoundState>((set) => {
  const savedMute = localStorage.getItem('chitguess-muted') === 'true';
  
  return {
    muted: savedMute,
    toggleMute: () => set((state) => {
      const newMuted = !state.muted;
      localStorage.setItem('chitguess-muted', String(newMuted));
      return { muted: newMuted };
    }),
  };
});
