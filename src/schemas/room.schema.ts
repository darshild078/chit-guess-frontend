import { z } from 'zod';

export const createRoomSchema = z.object({
  hostDisplayName: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name is too long').trim(),
  title: z.string().max(50, 'Title is too long').trim().optional().or(z.literal('')),
  maxPlayers: z.number().min(2, 'At least 2 players').max(20, 'Max 20 players').default(10),
  totalRounds: z.number().min(1, 'At least 1 round').max(10, 'Max 10 rounds').default(3),
});
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomCode: z.string().length(6, 'Room code must be exactly 6 characters').toUpperCase().trim(),
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name is too long').trim(),
});
export type JoinRoomFormData = z.infer<typeof joinRoomSchema>;
