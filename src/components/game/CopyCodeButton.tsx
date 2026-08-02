import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { soundService } from '../../services/sound';

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      soundService.buttonPress();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={handleCopy}
      className="w-full flex gap-2 items-center"
    >
      {copied ? <Check size={18} className="text-neon-green" /> : <Copy size={18} />}
      {copied ? 'Copied!' : 'Copy Code'}
    </Button>
  );
}
