import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronRight, User, LogOut, Shield } from 'lucide-react';
import { ConnectionBadge } from '../common/ConnectionBadge';
import { useAuth } from '../../features/auth/AuthContext';

interface TopBarProps {
  onOpenMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileNav }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, role, signOut, isAuthenticated } = useAuth();

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

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member';

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

        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
              }}
              aria-label="User profile menu"
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}>
                <User size={15} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
            </button>

            {dropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '230px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-card-hover)',
                  padding: '0.75rem',
                  zIndex: 50,
                }}
                className="animate-fade-in-up"
              >
                <div style={{ paddingBottom: '0.625rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{displayName}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  <div style={{ marginTop: '0.375rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                    }}>
                      <Shield size={11} />
                      {role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.625rem',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}>
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};
