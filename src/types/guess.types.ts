import { LeaderboardItem } from './participant.types';

export interface RoundWord {
  chitId: string;
  body: string;
  isOwnWord: boolean;
}

export interface ChitGuess {
  chitId: string;
  guessedParticipantId: string;
}

export interface GuessSummaryItem {
  guesserName: string;
  guessedPlayerName: string;
  isCorrect: boolean;
}

export interface RoundRevealDetail {
  chitId: string;
  body: string;
  authorParticipantId: string;
  authorDisplayName: string;
  correctGuessers: string[];
  guessesSummary: GuessSummaryItem[];
}

export interface RoundResults {
  roundNumber: number;
  totalRounds: number;
  isFinalRound: boolean;
  chits: RoundRevealDetail[];
  leaderboard: LeaderboardItem[];
}
