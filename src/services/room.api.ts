import { api } from './api';
import { RoomCreatedResponse, RoomJoinedResponse } from '../types/api.types';
import { RoomView } from '../types/room.types';
import { PlayerActivityItem } from '../types/participant.types';
import { useAuthStore } from '../stores/auth.store';

const getRoomId = () => useAuthStore.getState().roomId;

export const roomApi = {
  create: (data: {
    hostDisplayName: string;
    title?: string;
    maxPlayers: number;
    totalRounds?: number;
    gameMode?: string;
    promptCategory?: string;
    customPrompt?: string;
  }) => 
    api.post('/rooms', data) as Promise<RoomCreatedResponse>,
    
  join: (data: { roomCode: string; displayName: string }) => 
    api.post('/rooms/join', data) as Promise<RoomJoinedResponse>,

  checkAvailability: (roomCode: string) =>
    api.get(`/rooms/code/${roomCode}/availability`),
    
  getView: () => 
    api.get('/rooms/current') as Promise<RoomView>,
    
  getActivity: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve([]);
    return api.get(`/rooms/${roomId}/activity`) as Promise<PlayerActivityItem[]>;
  },
    
  startRound: () => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/rounds`);
  },

  nextRound: () => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/next-round`);
  },

  openSubmissions: () => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/rounds`);
  },

  closeSubmissions: () => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/round/guesses`);
  },

  startReveal: () => {
    const roomId = getRoomId();
    return api.get(`/rooms/${roomId}/round/results`);
  },

  leaveRoom: () => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/leave`);
  },
    
  endRoom: () => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/end`);
  },
    
  removePlayer: (aliasId: string) => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/players/${aliasId}/remove`);
  },
    
  lockRoom: (locked: boolean) => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/lock`, { locked });
  },

  updateSettings: (data: {
    totalRounds?: number;
    maxPlayers?: number;
    gameMode?: string;
    promptCategory?: string;
    customPrompt?: string;
  }) => {
    const roomId = getRoomId();
    return api.patch(`/rooms/${roomId}/settings`, data);
  },
};
