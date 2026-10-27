import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  Settings, 
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const Sidebar: React.FC = () => {
  const { profile, role, user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'BP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member';

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
          {getInitials(displayName)}
        </div>
        <div className="user-info">
          <span className="user-name" title={displayName}>{displayName}</span>
          <span className="user-role-tag" style={{ textTransform: 'capitalize' }}>
            {role}
          </span>
        </div>
      </div>
    </aside>
  );
};
