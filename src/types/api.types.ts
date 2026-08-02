export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
}

export interface RoomCreatedResponse {
  roomId: string;
  roomCode: string;
  participantId: string;
  token: string;
  role: 'owner';
}

export interface RoomJoinedResponse {
  roomId: string;
  participantId: string;
  token: string;
  role: 'owner' | 'player';
}
