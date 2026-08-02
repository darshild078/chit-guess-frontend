import React from 'react';
import { Button } from '../ui/Button';
import { RoomStatus } from '../../types/room.types';
import { Play, Eye, ArrowRight, Flag, Lock } from 'lucide-react';

interface HostControlPanelProps {
  status: RoomStatus;
  submittedCount: number;
  totalPlayers: number;
  onStartRound: () => void;
  onOpenSubmissions: () => void;
  onCloseSubmissions: () => void;
  onViewInbox: () => void;
  onRevealIdentities: () => void;
  onNextRound: () => void;
  onEndRoom: () => void;
}

export function HostControlPanel({
  status,
  submittedCount,
  totalPlayers,
  onStartRound,
  onOpenSubmissions,
  onCloseSubmissions,
  onRevealIdentities,
  onNextRound,
  onEndRoom
}: HostControlPanelProps) {
  const canStart = totalPlayers >= 1;

  switch (status) {
    case 'lobby':
      return (
        <Button variant="primary" size="lg" onClick={onStartRound} disabled={!canStart} className="w-full">
          <Play size={20} className="mr-2" /> Start Game
        </Button>
      );
    case 'waiting':
      return (
        <Button variant="primary" size="lg" onClick={onOpenSubmissions} className="w-full">
          Open Submissions
        </Button>
      );
    case 'submissions_open':
      return (
        <Button variant="warning" size="lg" onClick={onCloseSubmissions} className="w-full">
          <Lock size={18} className="mr-2" /> Close Submissions
        </Button>
      );
    case 'submissions_closed':
    case 'guessing':
      return (
        <Button variant="danger" size="lg" onClick={onRevealIdentities} className="w-full">
          <Eye size={20} className="mr-2" /> Reveal Who Wrote Each Word
        </Button>
      );
    case 'revealed':
      return (
        <div className="flex flex-col gap-3 w-full">
          <Button variant="primary" size="lg" onClick={onNextRound} className="w-full">
            <ArrowRight size={20} className="mr-2" /> Next Round
          </Button>
          <Button variant="ghost" size="md" onClick={onEndRoom} className="w-full">
            <Flag size={18} className="mr-2" /> End Room
          </Button>
        </div>
      );
    default:
      return null;
  }
}
