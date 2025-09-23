import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppTheme from './components/AppTheme';
import Dashboard from './components/Dashboard';
import MembersPage from './components/MembersPage';
import PlayerLoadout from './components/PlayerLoadout';
import LegacyPlayerLoadout from './components/LegacyPlayerLoadout';
import RecommendedBuilds from './components/RecommendedBuilds';
import RecommendedBuildsList from './components/RecommendedBuildsList';
import EventManagement from './components/EventManagement';
import EventDetails from './components/EventDetails';
import './App.css';

function App() {
  return (
    <AppTheme>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/player/:playerId/loadout" element={<LegacyPlayerLoadout />} />
        <Route path="/recbuilds" element={<RecommendedBuildsList />} />
        <Route path="/recbuilds/:buildId" element={<RecommendedBuilds />} />
        <Route path="/events" element={<EventManagement />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        </Routes>
      </Router>
    </AppTheme>
  );
}

export default App;