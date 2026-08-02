import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../services/room.api';
import { useAuthStore } from '../stores/auth.store';

export function useActivity() {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  
  return useQuery({
    queryKey: ['activity'],
    queryFn: roomApi.getActivity,
    enabled: isAuth,
  });
}
