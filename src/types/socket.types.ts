export interface ServerToClientEvents {
  'room:state-updated': (data: any) => void;
  'room:player-joined': (data: { displayName?: string; alias?: string; playerCount: number }) => void;
  'room:player-left': (data: { displayName?: string; alias?: string; playerCount: number }) => void;
  'room:player-activity-updated': (data: any) => void;
  'host:submission-count': (data: { submitted: number; total: number }) => void;
  'host:anonymous-inbox-updated': (data: any) => void;
  'player:submission-status': (data: any) => void;
  'room:identities-revealed': (data: any) => void;
  'player:removed': (data: { participantId: string }) => void;
  'room:ended': (data: { roomId: string }) => void;
  'room:round-started': (data: { roomId: string; roundNumber: number }) => void;
}

export interface ClientToServerEvents {
  'submission:submit': (data: { body: string }) => void;
  'submission:edit': (data: { body: string }) => void;
  'submission:delete': () => void;
}
