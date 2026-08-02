import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRoomView } from '../hooks/useRoom';
import { useAuthStore } from '../stores/auth.store';
import { LoadingState } from '../components/feedback/LoadingState';

import HostLobbyPage from '../pages/HostLobbyPage';
import PlayerLobbyPage from '../pages/PlayerLobbyPage';
import HostDashboardPage from '../pages/HostDashboardPage';
import PlayerSubmissionPage from '../pages/PlayerSubmissionPage';
import PlayerWaitingPage from '../pages/PlayerWaitingPage';
import HostInboxPage from '../pages/HostInboxPage';
import RoundResultsPage from '../pages/RoundResultsPage';
import RoomSettingsPage from '../pages/RoomSettingsPage';

export function RoomRouter() {
  const { data: room, isLoading } = useRoomView();
  const isOwner = useAuthStore(s => s.isOwner());

  if (isLoading) return <LoadingState />;
  if (!room) return <Navigate to="/room/invalid" replace />;
  if (room.status === 'ended') return <Navigate to="/room/ended" replace />;

  return (
    <Routes>
      {/* Settings Route - Host only */}
      {isOwner && <Route path="/settings" element={<RoomSettingsPage />} />}
      
      {/* Inbox Route - Host only */}
      {isOwner && <Route path="/inbox" element={<HostInboxPage />} />}

      {/* Main Dynamic Route */}
      <Route path="/" element={
        isOwner ? (
          // Host Router
          room.status === 'lobby' || (room.status === 'waiting' && room.currentRoundNumber === 0) 
            ? <HostLobbyPage />
            : room.status === 'revealed' || room.status === 'completed'
            ? <RoundResultsPage />
            : <HostDashboardPage />
        ) : (
          // Player Router: Players ONLY see Lobby when joining, Submission when open, and Waiting at all other times!
          room.status === 'lobby' || (room.status === 'waiting' && room.currentRoundNumber === 0)
            ? <PlayerLobbyPage />
            : room.status === 'submissions_open'
            ? <PlayerSubmissionPage />
            : <PlayerWaitingPage />
        )
      } />
      
      <Route path="*" element={<Navigate to="/room" replace />} />
    </Routes>
  );
}
