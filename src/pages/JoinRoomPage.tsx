import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joinRoomSchema, JoinRoomFormData } from '../schemas/room.schema';
import { MobileHeader } from '../components/layout/MobileHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { roomApi } from '../services/room.api';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from '../components/ui/Toast';

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore(s => s.setSession);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JoinRoomFormData>({
    resolver: zodResolver(joinRoomSchema)
  });

  const onSubmit = async (data: JoinRoomFormData) => {
    try {
      const res = await roomApi.join(data);
      setSession({
        token: res.token,
        participantId: res.participantId,
        roomId: res.roomId,
        role: res.role
      });
      navigate('/room', { replace: true });
    } catch (err: any) {
      if (err.code === 'ROOM_NOT_FOUND') navigate('/room/invalid');
      else if (err.code === 'ROOM_FULL') navigate('/room/full');
      else if (err.code === 'ROOM_EXPIRED') navigate('/room/expired');
      else toast(err.message || 'Failed to join room', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full clay-surface-0 overflow-hidden">
      <MobileHeader title="Join Room" showBack />
      
      <main className="flex-1 p-4 sm:p-6 pb-safe-bottom flex flex-col justify-center overflow-y-auto custom-scrollbar">

        <Card surface="level-1" className="w-full border border-zinc-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Room Code"
              placeholder="Enter 6-letter code"
              {...register('roomCode')}
              error={errors.roomCode?.message}
              className="uppercase font-mono font-black tracking-widest text-lg text-red-500"
              maxLength={6}
            />
            
            <Input
              label="Your Display Name"
              placeholder="e.g. Sam"
              {...register('displayName')}
              error={errors.displayName?.message}
            />
            
            <div className="pt-3">
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
                Join Room
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}



