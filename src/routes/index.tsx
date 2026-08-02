import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import CreateRoomPage from '../pages/CreateRoomPage';
import JoinRoomPage from '../pages/JoinRoomPage';
import JoinByLinkPage from '../pages/JoinByLinkPage';
import RoomCreatedPage from '../pages/RoomCreatedPage';
import InvalidRoomPage from '../pages/InvalidRoomPage';
import RoomFullPage from '../pages/RoomFullPage';
import RoomExpiredPage from '../pages/RoomExpiredPage';
import PlayerRemovedPage from '../pages/PlayerRemovedPage';
import RoomEndedPage from '../pages/RoomEndedPage';
import NotFoundPage from '../pages/NotFoundPage';
import { RoomRouter } from './RoomRouter';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/join" element={<JoinRoomPage />} />
      <Route path="/join/:roomCode" element={<JoinByLinkPage />} />
      
      <Route path="/room/invalid" element={<InvalidRoomPage />} />
      <Route path="/room/full" element={<RoomFullPage />} />
      <Route path="/room/expired" element={<RoomExpiredPage />} />
      <Route path="/room/removed" element={<PlayerRemovedPage />} />
      <Route path="/room/ended" element={<RoomEndedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/room/created" element={<RoomCreatedPage />} />
        <Route path="/room/*" element={<RoomRouter />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
