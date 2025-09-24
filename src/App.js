import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppTheme from './components/AppTheme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MembersPage from './components/MembersPage';
import PlayerLoadout from './components/PlayerLoadout';
import LegacyPlayerLoadout from './components/LegacyPlayerLoadout';
import RecommendedBuilds from './components/RecommendedBuilds';
import RecommendedBuildsList from './components/RecommendedBuildsList';
import EventManagement from './components/EventManagement';
import EventDetails from './components/EventDetails';
import DiscordBotConfig from './components/DiscordBotConfig';
import Analytics from './components/Analytics';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
  return (
    <AppTheme>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes (no authentication required) */}
            <Route path="/login" element={<Login />} />
            <Route path="/recbuilds" element={<RecommendedBuildsList />} />
            <Route path="/recbuilds/:buildId" element={<RecommendedBuilds />} />
            <Route path="/player/:playerId/loadout" element={<LegacyPlayerLoadout />} />
            
            {/* Protected routes (authentication required) */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/members" element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <EventManagement />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId" element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/discord-bot-config" element={
              <ProtectedRoute>
                <DiscordBotConfig />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </AppTheme>
  );
}

export default App;