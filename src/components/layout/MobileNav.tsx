import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  Settings, 
  GraduationCap, 
  X 
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { profile, role, user } = useAuth();

  if (!isOpen) return null;

  const getInitials = (name?: string) => {
    if (!name) return 'BP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member';

  return (
    <div className="mobile-drawer-overlay" onClick={onClose}>
      <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div className="brand-badge">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text">
              <h1>BrightPath</h1>
              <span>Academy CRM</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ color: '#94a3b8', padding: '0.5rem' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            end
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/leads" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Users size={19} />
            <span>Student Leads</span>
          </NavLink>

          <NavLink 
            to="/follow-ups" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <CalendarClock size={19} />
            <span>Follow-ups</span>
          </NavLink>

          <NavLink 
            to="/settings" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar-badge">{getInitials(displayName)}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role-tag" style={{ textTransform: 'capitalize' }}>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
