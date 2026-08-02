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
      <Card className="relative overflow-hidden border-electric-blue/40 bg-gray-900/80 p-5">
        <div className="py-2 text-center">
          <p className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">
            "{body}"
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
