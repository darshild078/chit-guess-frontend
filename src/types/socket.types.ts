export interface ServerToClientEvents {
  'room:state-updated': (data: any) => void;
  'room:player-joined': (data: { displayName?: string; alias?: string; playerCount: number }) => void;
  'room:player-left': (data: { displayName?: string; alias?: string; playerCount: number }) => void;
  'room:player-activity-updated': (data: any) => void;
  'room:guessing-started': (data: any) => void;
  'room:guesses-progress': (data: { lockedCount: number; totalCount: number }) => void;
  'room:round-revealed': (data: any) => void;
  'room:game-completed': (data: any) => void;
  'host:submission-count': (data: { submitted: number; total: number }) => void;
  'host:anonymous-inbox-updated': (data: any) => void;
  'player:submission-status': (data: any) => void;
  'room:identities-revealed': (data: any) => void;
  'player:removed': (data: { participantId: string }) => void;
  'room:ended': (data: { roomId: string }) => void;
  'room:round-started': (data: { roomId: string; roundNumber: number }) => void;
  'reaction:received': (data: { emoji: string; senderId?: string }) => void;
}

export interface ClientToServerEvents {
  'submission:submit': (data: { body: string }) => void;
  'submission:edit': (data: { body: string }) => void;
  'submission:delete': () => void;
  'reaction:send': (data: { emoji: string }) => void;
}
