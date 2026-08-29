import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRoomView } from '../hooks/useRoom';
import { useAuthStore } from '../stores/auth.store';
import { LoadingState } from '../components/feedback/LoadingState';

import HostLobbyPage from '../pages/HostLobbyPage';
import PlayerLobbyPage from '../pages/PlayerLobbyPage';
import PlayerSubmissionPage from '../pages/PlayerSubmissionPage';
import GuessingPage from '../pages/GuessingPage';
import RoundRevealPage from '../pages/RoundRevealPage';
import FinalPodiumPage from '../pages/FinalPodiumPage';
import RoomSettingsPage from '../pages/RoomSettingsPage';

export function RoomRouter() {
  const { data: room, isLoading } = useRoomView();
  const isOwner = useAuthStore(s => s.isOwner());

  if (isLoading) return <LoadingState />;
  if (!room) return <Navigate to="/room/invalid" replace />;
  if (room.status === 'ended') return <Navigate to="/room/ended" replace />;

  const renderCurrentPhase = () => {
    switch (room.status) {
      case 'lobby':
      case 'waiting':
        if (room.currentRoundNumber === 0) {
          return isOwner ? <HostLobbyPage /> : <PlayerLobbyPage />;
        }
        return <PlayerSubmissionPage />;

      case 'submissions_open':
      case 'submissions_closed':
        return <PlayerSubmissionPage />;

      case 'guessing':
        return <GuessingPage />;

      case 'revealed':
        return <RoundRevealPage />;

      case 'completed':
        return <FinalPodiumPage />;

      default:
        return isOwner ? <HostLobbyPage /> : <PlayerLobbyPage />;
    }
  };

  return (
    <Routes>
      {/* Settings Route - Host only */}
      {isOwner && <Route path="/settings" element={<RoomSettingsPage />} />}

      {/* Main Dynamic Game Phase Route */}
      <Route path="/" element={renderCurrentPhase()} />
      <Route path="/podium" element={<FinalPodiumPage />} />
      <Route path="*" element={<Navigate to="/room" replace />} />
    </Routes>
  );
}
