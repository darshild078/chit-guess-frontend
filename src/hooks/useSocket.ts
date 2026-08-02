import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { useAuthStore } from '../stores/auth.store';
import { soundService } from '../services/sound';
import { useQueryClient } from '@tanstack/react-query';

export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }
  }, [token]);

  useEffect(() => {
    const invalidateAll = () => {
      queryClient.invalidateQueries({ queryKey: ['roomView'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['mySubmission'] });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    };

    const unsubState = socketService.on('room:state-updated', () => {
      invalidateAll();
    });

    const unsubRoundStarted = socketService.on('room:round-started', () => {
      invalidateAll();
    });
    
    const unsubJoined = socketService.on('room:player-joined', () => {
      soundService.playerJoined();
      invalidateAll();
    });
    
    const unsubLeft = socketService.on('room:player-left', () => {
      invalidateAll();
    });

    const unsubActivity = socketService.on('room:player-activity-updated', () => {
      invalidateAll();
    });
    
    const unsubReveal = socketService.on('room:identities-revealed', () => {
      soundService.identityRevealed();
      queryClient.invalidateQueries({ queryKey: ['revealResults'] });
      invalidateAll();
    });

    const unsubEnded = socketService.on('room:ended', () => {
      invalidateAll();
    });

    return () => {
      unsubState();
      unsubRoundStarted();
      unsubJoined();
      unsubLeft();
      unsubActivity();
      unsubReveal();
      unsubEnded();
    };
  }, [queryClient]);
}
