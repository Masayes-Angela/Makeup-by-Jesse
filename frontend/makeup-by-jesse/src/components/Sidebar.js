// src/components/Sidebar/Sidebar.js
import React from 'react';
import '../styles/Sidebar.css';
import {
  FaTachometerAlt,
  FaBookmark,
  FaCalendarAlt,
  FaEdit,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>admin.</h2>
      </div>

      <ul className="sidebar-menu">
        <li
          className={activePage === 'dashboard' ? 'active' : ''}
          onClick={() => setActivePage('dashboard')}
        >
          <FaTachometerAlt className="icon" />
          Dashboard
        </li>
        <li
          className={activePage === 'bookings' ? 'active' : ''}
          onClick={() => setActivePage('bookings')}
        >
          <FaBookmark className="icon" />
          Manage Bookings
        </li>
        <li
          className={activePage === 'schedule' ? 'active' : ''}
          onClick={() => setActivePage('schedule')}
        >
          <FaCalendarAlt className="icon" />
          Schedule
        </li>
        <li
          className={activePage === 'content' ? 'active' : ''}
          onClick={() => setActivePage('content')}
        >
          <FaEdit className="icon" />
          Manage Website Content
        </li>
        <li
          className={activePage === 'settings' ? 'active' : ''}
          onClick={() => setActivePage('settings')}
        >
          <FaCog className="icon" />
          Settings
        </li>
      </ul>

      <div className="sidebar-footer" onClick={() => setActivePage('logout')}>
        <FaSignOutAlt className="icon logout-icon" />
        Log Out
      </div>
    </div>
  );
};

export default Sidebar;
