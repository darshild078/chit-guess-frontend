import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../services/room.api';
import { useAuthStore } from '../stores/auth.store';

export function useRoomView() {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  
  return useQuery({
    queryKey: ['roomView'],
    queryFn: roomApi.getView,
    enabled: isAuth,
    retry: false,
  });
}

export { useActivity } from './useActivity';
