import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submissionSchema, SubmissionFormData } from '../../schemas/submission.schema';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubmissionComposerProps {
  initialValue?: string;
  isSubmitted: boolean;
  isClosed: boolean;
  onSubmit: (text: string) => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export function SubmissionComposer({ initialValue = '', isSubmitted, isClosed, onSubmit, onEdit, onDelete }: SubmissionComposerProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { body: initialValue }
  });

  const body = watch('body') || '';

  // Intercept and strip spaces, numbers, and special characters on the fly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const cleanWord = e.target.value.replace(/[^A-Za-z]/g, '');
    setValue('body', cleanWord, { shouldValidate: true });
  };

  // Prevent space key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
    }
  };

  if (isClosed) {
    return (
      <Card surface="level-2" className="text-center p-6 border-zinc-800">
        <h3 className="text-base font-heading font-extrabold text-white mb-1">Submissions are closed</h3>
        <p className="text-xs text-zinc-400 font-extrabold">The host is now reading the secret word chits in the inbox.</p>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <Card surface="level-2" className="p-6 border-emerald-800/60 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 size={22} />
            <h3 className="font-heading font-extrabold text-base text-white">Secret Word Submitted!</h3>
          </div>
          <div className="clay-surface-inset rounded-2xl p-4 text-center border border-zinc-800">
            <p className="text-2xl font-black font-heading text-white tracking-wide">"{initialValue}"</p>
          </div>
          <div className="flex gap-3 pt-3 border-t border-zinc-800">
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
                <Edit2 size={16} className="mr-2" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete} className="flex-1">
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  const { ref, onChange, ...bodyRegisterProps } = register('body');

  return (
    <Card surface="level-2" className="p-1 sm:p-2 border border-zinc-800">
      <form onSubmit={handleSubmit((data) => onSubmit(data.body))} className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-zinc-400 px-1">
            Your Secret Word
          </label>
          <div className="relative">
            <Input
              placeholder="Type ONE word (e.g. Pineapple)..."
              {...bodyRegisterProps}
              ref={ref}
              onChange={(e) => {
                onChange(e);
                handleInputChange(e);
              }}
              onKeyDown={handleKeyDown}
              error={errors.body?.message}
              className="w-full text-lg font-heading font-bold tracking-wide pr-14"
              maxLength={30}
              autoComplete="off"
            />
            <div className="absolute right-3.5 top-3.5 text-xs font-mono font-bold text-zinc-500">
              {body.length}/30
            </div>
          </div>
          <p className="text-xs text-zinc-400 font-extrabold px-1">
            ⚠️ <strong className="text-white">One word only:</strong> Letters only. No spaces or special characters.
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
          Drop Secret Word
        </Button>
      </form>
    </Card>
  );
}



