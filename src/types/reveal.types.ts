export interface RevealedChit {
  chitId: string;
  senderDisplayName: string;
  body: string;
  submittedAt: string;
  guessedDisplayName?: string;
  wasCorrect?: boolean;
}

export interface RevealResults {
  roundNumber: number;
  chits: RevealedChit[];
}
