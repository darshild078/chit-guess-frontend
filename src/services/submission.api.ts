import { api } from './api';
import { MySubmission, SubmissionStatus } from '../types/submission.types';
import { useAuthStore } from '../stores/auth.store';

const getRoomId = () => useAuthStore.getState().roomId;

export const submissionApi = {
  getMine: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve(null);
    return api.get(`/rooms/${roomId}/submission`) as Promise<MySubmission | null>;
  },
    
  submit: (body: string) => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/submission`, { body });
  },
    
  update: (body: string) => {
    const roomId = getRoomId();
    return api.patch(`/rooms/${roomId}/submission`, { body });
  },
    
  delete: () => {
    const roomId = getRoomId();
    return api.delete(`/rooms/${roomId}/submission`);
  },
};
