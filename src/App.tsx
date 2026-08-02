import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { AppRoutes } from './routes';
import { useSocket } from './hooks/useSocket';

export function App() {
  // Initialize socket connection lifecycle
  useSocket();

  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  );
}

export default App;
