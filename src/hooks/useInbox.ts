import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inboxApi } from '../services/inbox.api';

export function useInbox() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: inboxApi.getInbox,
  });
}

export function useRevealResults() {
  return useQuery({
    queryKey: ['revealResults'],
    queryFn: inboxApi.getResults,
  });
}

export function useGuess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chitId, guessedAliasId }: { chitId: string, guessedAliasId: string }) => 
      inboxApi.guess(chitId, guessedAliasId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    }
  });
}
