// src/App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Schedule from './pages/Schedule';
import ManageWebsite from './pages/ManageWebsite';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'bookings' && <Bookings />}
        {activePage === 'schedule' && <Schedule />}
        {activePage === 'content' && <ManageWebsite />}
        {activePage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;