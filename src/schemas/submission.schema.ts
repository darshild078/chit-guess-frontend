import { z } from 'zod';

export const submissionSchema = z.object({
  body: z.string()
    .min(1, 'Chit cannot be empty')
    .max(30, 'Maximum 30 letters')
    .regex(/^[A-Za-z]+$/, 'Must be a single word (letters only, no spaces, numbers, or special characters)'),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
