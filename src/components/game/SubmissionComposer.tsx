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
      <Card className="text-center p-6 border-gray-700 bg-gray-900">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Submissions are closed</h3>
        <p className="text-sm text-gray-500">The host is now reading the secret word chits in the inbox.</p>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="p-6 border-neon-green/30 bg-neon-green/5 space-y-4">
          <div className="flex items-center gap-3 text-neon-green">
            <CheckCircle2 size={24} />
            <h3 className="font-medium text-lg">Secret Word Submitted!</h3>
          </div>
          <p className="text-2xl font-bold font-heading text-white tracking-wide">"{initialValue}"</p>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="flex-1">
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
    <Card glow className="p-1">
      <form onSubmit={handleSubmit((data) => onSubmit(data.body))} className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Your Secret Word</label>
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
              className="w-full text-xl font-semibold tracking-wide pr-14"
              maxLength={30}
              autoComplete="off"
            />
            <div className="absolute right-3 top-3 text-xs font-mono text-gray-500">
              {body.length}/30
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ⚠️ <strong>One word only:</strong> Letters only. No spaces, numbers, or special characters.
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
          Drop Secret Word
        </Button>
      </form>
    </Card>
  );
}
