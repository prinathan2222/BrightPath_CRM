import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  Settings, 
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="desktop-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <GraduationCap size={22} />
        </div>
        <div className="brand-text">
          <h1>BrightPath</h1>
          <span>Academy CRM</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/leads" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Users size={19} />
          <span>Student Leads</span>
        </NavLink>

        <NavLink 
          to="/follow-ups" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <CalendarClock size={19} />
          <span>Follow-ups</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Footer Profile Pill */}
      <div className="sidebar-footer">
        <div className="user-avatar-badge">
          BP
        </div>
        <div className="user-info">
          <span className="user-name">Staff Counsellor</span>
          <span className="user-role-tag">Demo Access</span>
        </div>
      </div>
    </aside>
  );
};
