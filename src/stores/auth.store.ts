import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  participantId: string | null;
  roomId: string | null;
  role: 'owner' | 'player' | null;
  setSession: (data: { token: string; participantId: string; roomId: string; role: 'owner' | 'player' }) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
  isOwner: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      participantId: null,
      roomId: null,
      role: null,
      
      setSession: (data) => set(data),
      
      clearSession: () => set({ token: null, participantId: null, roomId: null, role: null }),
      
      isAuthenticated: () => !!get().token && !!get().roomId,
      
      isOwner: () => get().role === 'owner',
    }),
    {
      name: 'chitguess-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
