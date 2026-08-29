import { api } from './api';
import { RoundWord, ChitGuess, RoundResults } from '../types/guess.types';
import { LeaderboardItem } from '../types/participant.types';
import { useAuthStore } from '../stores/auth.store';

const getRoomId = () => useAuthStore.getState().roomId;

export const guessApi = {
  getRoundWords: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve([]);
    return api.get(`/rooms/${roomId}/round/words`) as Promise<RoundWord[]>;
  },

  submitGuesses: (guesses: ChitGuess[]) => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/round/guesses`, { guesses });
  },

  chameleonGuessWord: (word: string) => {
    const roomId = getRoomId();
    return api.post(`/rooms/${roomId}/round/chameleon-guess`, { word });
  },

  getRoundResults: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve(null);
    return api.get(`/rooms/${roomId}/round/results`) as Promise<RoundResults>;
  },

  getLeaderboard: () => {
    const roomId = getRoomId();
    if (!roomId) return Promise.resolve([]);
    return api.get(`/rooms/${roomId}/leaderboard`) as Promise<LeaderboardItem[]>;
  },
};
