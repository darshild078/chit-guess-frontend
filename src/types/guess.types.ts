import { LeaderboardItem } from './participant.types';

export interface RoundWord {
  chitId: string;
  body: string;
  isOwnWord: boolean;
  authorDisplayName?: string | null;
}

export interface ChitGuess {
  chitId?: string;
  guessedParticipantId: string;
  isDoubleDown?: boolean;
}

export interface GuessSummaryItem {
  guesserName: string;
  guessedPlayerName: string;
  isCorrect: boolean;
  isDoubleDown?: boolean;
}

export interface RoundRevealDetail {
  chitId: string;
  body: string;
  authorParticipantId: string;
  authorDisplayName: string;
  correctGuessers: string[];
  guessesSummary: GuessSummaryItem[];
  stealthBonusAwarded?: boolean;
  votesCount?: number;
}

export interface PlayerBadge {
  badgeId: string;
  title: string;
  emoji: string;
  description: string;
  recipientDisplayName: string;
  recipientParticipantId: string;
}

export interface RoundResults {
  roundNumber: number;
  totalRounds: number;
  isFinalRound: boolean;
  gameMode?: 'confessions' | 'chameleon' | 'roasts';
  prompt?: string | null;
  secretTopic?: string | null;
  secretWord?: string | null;
  chameleonParticipantId?: string | null;
  chameleonDisplayName?: string | null;
  chameleonCaught?: boolean | null;
  chameleonEscaped?: boolean | null;
  chameleonGuessedWord?: boolean | null;
  chits: RoundRevealDetail[];
  leaderboard: LeaderboardItem[];
  awards?: PlayerBadge[];
}
