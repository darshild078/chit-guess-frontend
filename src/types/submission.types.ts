export interface MySubmission {
  body: string;
  submittedAt: string;
  updatedAt: string;
}

export interface SubmissionStatus {
  hasSubmitted: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSubmit: boolean;
}

export interface RoundPromptInfo {
  roundNumber: number;
  totalRounds: number;
  gameMode: 'confessions' | 'chameleon' | 'roasts';
  prompt?: string | null;
  secretTopic?: string | null;
  secretWord?: string | null;
  isChameleon: boolean;
  wordChoices: string[];
}
