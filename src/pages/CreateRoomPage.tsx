import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoomSchema, CreateRoomFormData } from '../schemas/room.schema';
import { MobileHeader } from '../components/layout/MobileHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { roomApi } from '../services/room.api';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from '../components/ui/Toast';
import { Users } from 'lucide-react';

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore(s => s.setSession);
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { maxPlayers: 10 }
  });

  const maxPlayersValue = watch('maxPlayers') || 10;

  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      const res = await roomApi.create(data);
      setSession({
        token: res.token,
        participantId: res.participantId,
        roomId: res.roomId,
        role: res.role
      });
      navigate('/room/created', { replace: true });
    } catch (err: any) {
      toast(err.message || 'Failed to create room', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <MobileHeader title="Create Room" showBack />
      
      <main className="flex-1 p-4 pb-safe-bottom">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Your Display Name"
              placeholder="e.g. Alex"
              {...register('hostDisplayName')}
              error={errors.hostDisplayName?.message}
            />
            
            <Input
              label="Room Title (Optional)"
              placeholder="e.g. Friday Night Drinks"
              {...register('title')}
              error={errors.title?.message}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex justify-between">
                <span>Max Players</span>
                <span className="text-electric-blue flex items-center gap-1">
                  <Users size={14} /> {maxPlayersValue}
                </span>
              </label>
              <input 
                type="range" 
                min="3" max="20" 
                className="w-full accent-electric-blue h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                {...register('maxPlayers', { valueAsNumber: true })} 
              />
              {errors.maxPlayers && <span className="text-sm text-error">{errors.maxPlayers.message}</span>}
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
                Create Room
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
