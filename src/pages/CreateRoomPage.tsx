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
import { Users, Trophy, Sparkles, Coffee, Eye, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const GAME_MODES = [
  {
    id: 'confessions',
    name: 'Secret Confessions',
    tagline: 'Spill the Tea ☕',
    desc: 'Answer spicy/funny questions & guess which friend wrote what!',
    icon: Coffee,
    gradient: 'from-amber-500/20 to-orange-500/20 border-orange-500/40 text-orange-400',
  },
  {
    id: 'chameleon',
    name: 'The Chameleon',
    tagline: 'Spot the Impostor 🦎',
    desc: '1 secret player has no clue what the word is. Catch them!',
    icon: Eye,
    gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
  },
  {
    id: 'roasts',
    name: 'Friend Roasts',
    tagline: 'Fill in the Blank 🎯',
    desc: 'Write hilarious answers and vote for the absolute funniest roast!',
    icon: Flame,
    gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400',
  },
] as const;

const CONFESSION_CATEGORIES = [
  { id: 'general', label: '🎲 General & Random' },
  { id: 'school', label: '🎒 School / College Days' },
  { id: 'embarrassing', label: '🙈 Embarrassing Moments' },
  { id: 'spicy', label: '🔥 Spicy / After Hours' },
  { id: 'pleasures', label: '🍕 Guilty Pleasures' },
  { id: 'custom', label: '✍️ Custom Question' },
];

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore(s => s.setSession);
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      maxPlayers: 10,
      totalRounds: 3,
      gameMode: 'confessions',
      promptCategory: 'general',
    }
  });

  const selectedMode = watch('gameMode') || 'confessions';
  const selectedCategory = watch('promptCategory') || 'general';
  const maxPlayersValue = watch('maxPlayers') || 10;
  const totalRoundsValue = watch('totalRounds') || 3;

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
      <MobileHeader title="Create Game Room" showBack />
      
      <main className="flex-1 p-4 sm:p-6 pb-safe-bottom flex flex-col justify-start overflow-y-auto custom-scrollbar">
        <Card surface="level-1" className="w-full max-w-lg mx-auto border border-zinc-800 my-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Host Name & Title */}
            <div className="space-y-4">
              <Input
                label="Your Display Name"
                placeholder="e.g. Alex"
                {...register('hostDisplayName')}
                error={errors.hostDisplayName?.message}
              />
              
              <Input
                label="Room Title (Optional)"
                placeholder="e.g. Friday Night Hangout"
                {...register('title')}
                error={errors.title?.message}
              />
            </div>

            {/* Game Mode Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-1">
                <Sparkles size={14} className="text-orange-500" />
                <span>Select Game Mode</span>
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {GAME_MODES.map((mode) => {
                  const isSelected = selectedMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <motion.div
                      key={mode.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setValue('gameMode', mode.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? `bg-gradient-to-r ${mode.gradient} shadow-lg ring-2 ring-orange-500/50`
                          : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-black/30' : 'bg-zinc-800'}`}>
                        <Icon size={22} className={isSelected ? 'text-orange-400' : 'text-zinc-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-black text-sm text-zinc-100">{mode.name}</span>
                          <span className="text-xs font-bold text-orange-400/90">{mode.tagline}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{mode.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Category Packs (For Confessions Mode) */}
            {selectedMode === 'confessions' && (
              <div className="space-y-2.5">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400 px-1">
                  Question Category Pack
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONFESSION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue('promptCategory', cat.id)}
                      className={`p-2.5 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-orange-500/20 border-orange-500/60 text-orange-300 ring-1 ring-orange-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {selectedCategory === 'custom' && (
                  <div className="mt-3">
                    <Input
                      label="Your Custom Question"
                      placeholder="e.g. What is your secret guilty pleasure food?"
                      {...register('customPrompt')}
                      error={errors.customPrompt?.message}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Total Rounds Slider */}
            <div className="space-y-2.5">
              <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400 flex justify-between px-1">
                <span>Total Game Rounds</span>
                <span className="text-orange-500 flex items-center gap-1.5 font-black">
                  <Trophy size={14} /> {totalRoundsValue} {totalRoundsValue === 1 ? 'Round' : 'Rounds'}
                </span>
              </label>
              <div className="clay-surface-inset rounded-xl p-3 shadow-inner border border-zinc-800">
                <input 
                  type="range" 
                  min="1" max="10" 
                  className="w-full accent-orange-500 h-2 rounded-lg appearance-none cursor-pointer"
                  {...register('totalRounds', { valueAsNumber: true })} 
                />
              </div>
            </div>
            
            {/* Max Players Slider */}
            <div className="space-y-2.5">
              <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400 flex justify-between px-1">
                <span>Max Players</span>
                <span className="text-orange-500 flex items-center gap-1.5 font-black">
                  <Users size={14} /> {maxPlayersValue}
                </span>
              </label>
              <div className="clay-surface-inset rounded-xl p-3 shadow-inner border border-zinc-800">
                <input 
                  type="range" 
                  min="2" max="20" 
                  className="w-full accent-orange-500 h-2 rounded-lg appearance-none cursor-pointer"
                  {...register('maxPlayers', { valueAsNumber: true })} 
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
                Launch Game Room
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
