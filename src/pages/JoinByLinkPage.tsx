import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function JoinByLinkPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams<{ roomCode: string }>();
  const setSession = useAuthStore(s => s.setSession);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<JoinRoomFormData>({
    resolver: zodResolver(joinRoomSchema)
  });

  useEffect(() => {
    if (roomCode) {
      setValue('roomCode', roomCode.toUpperCase());
    }
  }, [roomCode, setValue]);

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
    <div className="flex flex-col min-h-[100dvh]">
      <MobileHeader title="Join Room" showBack onBack={() => navigate('/')} />
      
      <main className="flex-1 p-4 pb-safe-bottom">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Room Code"
              {...register('roomCode')}
              disabled
              className="uppercase font-mono tracking-widest text-lg bg-gray-900 border-gray-700 text-gray-400"
            />
            
            <Input
              label="Your Display Name"
              placeholder="e.g. Sam"
              {...register('displayName')}
              error={errors.displayName?.message}
            />
            
            <div className="pt-4">
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
