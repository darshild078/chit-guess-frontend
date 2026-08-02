import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function InvalidRoomPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[100dvh]">
      <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
        <XCircle size={40} />
      </div>
      <h1 className="text-2xl font-heading font-bold text-white mb-3">Room Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-xs">
        This room doesn't exist or the code is invalid. Check the code and try again.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')} className="w-full max-w-xs">
        Back to Home
      </Button>
    </div>
  );
}
