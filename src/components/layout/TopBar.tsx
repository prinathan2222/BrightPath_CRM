import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, User } from 'lucide-react';
import { ConnectionBadge } from '../common/ConnectionBadge';

interface TopBarProps {
  onOpenMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileNav }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/leads':
        return 'Student Leads Pipeline';
      case '/follow-ups':
        return 'Follow-up Scheduler';
      case '/settings':
        return 'System & Profile Settings';
      default:
        return 'Academy CRM';
    }
  };

  return (
    <header className="top-header">
      <div className="topbar-left">
        <button 
          onClick={onOpenMobileNav}
          className="mobile-toggle-btn"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb-trail">
          <Link to="/" style={{ color: 'var(--text-muted)' }}>BrightPath</Link>
          <ChevronRight size={14} color="var(--text-subtle)" />
          <span className="breadcrumb-current">{getPageTitle()}</span>
        </div>
      </div>

      <div className="topbar-right">
        <ConnectionBadge />

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #bfdbfe'
        }}>
          <User size={18} />
        </div>
      </div>
    </header>
  );
};
