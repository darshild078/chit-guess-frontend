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
    <div className="flex flex-col h-full clay-surface-0 overflow-hidden">
      <MobileHeader title="Create Room" showBack />
      
      <main className="flex-1 p-4 sm:p-6 pb-safe-bottom flex flex-col justify-center overflow-y-auto custom-scrollbar">

        <Card surface="level-1" className="w-full border border-zinc-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            
            <div className="space-y-2.5">
              <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400 flex justify-between px-1">
                <span>Max Players</span>
                <span className="text-red-500 flex items-center gap-1.5 font-black">
                  <Users size={14} /> {maxPlayersValue}
                </span>
              </label>
              <div className="clay-surface-inset rounded-xl p-3 shadow-inner border border-zinc-800">
                <input 
                  type="range" 
                  min="3" max="20" 
                  className="w-full accent-red-500 h-2 rounded-lg appearance-none cursor-pointer"
                  {...register('maxPlayers', { valueAsNumber: true })} 
                />
              </div>
              {errors.maxPlayers && <span className="text-xs font-medium text-error px-1">{errors.maxPlayers.message}</span>}
            </div>

            <div className="pt-3">
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



