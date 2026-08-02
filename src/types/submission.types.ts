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
