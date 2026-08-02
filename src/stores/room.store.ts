import { create } from 'zustand';
import { RoomView } from '../types/room.types';
import { ActivityItem } from '../types/participant.types';

interface RoomState {
  roomView: RoomView | null;
  activity: ActivityItem[];
  setRoomView: (view: RoomView) => void;
  setActivity: (items: ActivityItem[]) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomView: null,
  activity: [],
  setRoomView: (view) => set({ roomView: view }),
  setActivity: (activity) => set({ activity }),
  clearRoom: () => set({ roomView: null, activity: [] }),
}));
