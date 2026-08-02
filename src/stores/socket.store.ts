import { create } from 'zustand';

interface SocketState {
  connected: boolean;
  reconnecting: boolean;
  setConnected: (connected: boolean) => void;
  setReconnecting: (reconnecting: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  connected: false,
  reconnecting: false,
  setConnected: (connected) => set({ connected, reconnecting: false }),
  setReconnecting: (reconnecting) => set({ reconnecting }),
}));
