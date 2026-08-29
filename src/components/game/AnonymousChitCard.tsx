import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface AnonymousChitCardProps {
  alias?: string;
  body: string;
  submittedAt?: string;
  isRead?: boolean;
}

export function AnonymousChitCard({ body }: AnonymousChitCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card surface="level-2" className="relative overflow-hidden p-6 border-amber-900/60 shadow-[14px_14px_30px_rgba(0,0,0,0.85)]">
        <div className="py-3 text-center clay-surface-inset rounded-2xl p-4 border border-zinc-800">
          <p className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide leading-relaxed">
            "{body}"
          </p>
        </div>
      </Card>
    </motion.div>

  );
}



