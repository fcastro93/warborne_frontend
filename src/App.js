import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppTheme from './components/AppTheme';
import Dashboard from './components/Dashboard';
import MembersPage from './components/MembersPage';
import './App.css';

function App() {
  return (
    <AppTheme>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
        </Routes>
      </Router>
    </AppTheme>
  );
}

export default App;