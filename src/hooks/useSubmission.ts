import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionApi } from '../services/submission.api';

export function useMySubmission() {
  return useQuery({
    queryKey: ['mySubmission'],
    queryFn: submissionApi.getMine,
    retry: false,
  });
}

export function useSubmissionStatus() {
  const { data: mine, isLoading } = useMySubmission();
  return {
    data: {
      hasSubmitted: !!mine,
      canEdit: true,
      canDelete: true,
      canSubmit: !mine,
    },
    isLoading,
  };
}

export function useSubmitChit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submissionApi.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmission'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    }
  });
}

export function useUpdateChit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submissionApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmission'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    }
  });
}
