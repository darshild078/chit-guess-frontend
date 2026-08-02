import { api } from './api';
import { AnonymousInbox } from '../types/inbox.types';
import { RevealResults } from '../types/reveal.types';
import { useAuthStore } from '../stores/auth.store';

const getRoomId = () => useAuthStore.getState().roomId;

export const inboxApi = {
  getInbox: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve(null);
    return api.get(`/rooms/${roomId}/inbox/anonymous`) as Promise<AnonymousInbox>;
  },
    
  markAsRead: (chitId: string) => {
    const roomId = getRoomId();
    return api.patch(`/rooms/${roomId}/inbox/${chitId}/read`, { isRead: true });
  },
    
  guess: (chitId: string, guessedAliasId?: string) => {
    const roomId = getRoomId();
    return api.patch(`/rooms/${roomId}/inbox/${chitId}/guess`, { 
      isGuessed: true, 
      guessedAliasId 
    });
  },
    
  getResults: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve(null);
    return api.get(`/rooms/${roomId}/results`) as Promise<RevealResults>;
  },
};
