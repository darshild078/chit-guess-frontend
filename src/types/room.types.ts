export type RoomStatus = 'lobby' | 'waiting' | 'submissions_open' | 'submissions_closed' | 'guessing' | 'revealed' | 'completed' | 'ended';
export type RoundStatus = 'waiting' | 'submissions_open' | 'submissions_closed' | 'guessing' | 'revealed' | 'completed';
export type ParticipantRole = 'owner' | 'player';

export interface HostRoomView {
  roomId: string;
  roomCode: string;
  title: string | null;
  status: RoomStatus;
  currentRoundNumber: number;
  playerCount: number;
  maxPlayers: number;
  locked: boolean;
  isOwner: true;
  expiresAt: string;
}

export interface PlayerRoomView {
  roomId: string;
  roomCode: string;
  title: string | null;
  status: RoomStatus;
  currentRoundNumber: number;
  playerCount: number;
  maxPlayers: number;
  locked: boolean;
  isOwner: false;
  hostDisplayName: string;
  expiresAt: string;
}

export type RoomView = HostRoomView | PlayerRoomView;
