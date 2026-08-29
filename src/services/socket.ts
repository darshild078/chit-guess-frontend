import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth.store';
import { useSocketStore } from '../stores/socket.store';
import { ServerToClientEvents, ClientToServerEvents } from '../types/socket.types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private eventHandlers: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    useSocketStore.getState().setConnected(false);
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      useSocketStore.getState().setConnected(true);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connect error:', err.message);
      useSocketStore.getState().setConnected(false);
      useSocketStore.getState().setReconnecting(true);
    });

    this.socket.on('disconnect', (reason) => {
      useSocketStore.getState().setConnected(false);
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        // Disconnected intentionally
      } else {
        useSocketStore.getState().setReconnecting(true);
      }
    });

    // Delegate events to our local event bus
    const events: (keyof ServerToClientEvents)[] = [
      'room:state-updated',
      'room:player-joined',
      'room:player-left',
      'room:player-activity-updated',
      'room:guessing-started',
      'room:guesses-progress',
      'room:round-revealed',
      'room:game-completed',
      'host:submission-count',
      'host:anonymous-inbox-updated',
      'player:submission-status',
      'room:identities-revealed',
      'player:removed',
      'room:ended',
      'room:round-started',
    ];

    events.forEach(event => {
      this.socket?.on(event as any, (data: any) => {
        this.emitLocal(event, data);
      });
    });
  }

  on<K extends keyof ServerToClientEvents>(event: K, handler: ServerToClientEvents[K]) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    
    return () => {
      this.off(event, handler);
    };
  }

  off<K extends keyof ServerToClientEvents>(event: K, handler: ServerToClientEvents[K]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emitLocal(event: string, data?: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  ping() {
    (this.socket as any)?.emit('ping');
  }
}

export const socketService = new SocketService();
