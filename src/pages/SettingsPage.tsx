import React from 'react';
import { 
  Database, 
  User, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { checkSupabaseConfig } from '../lib/supabaseClient';

export const SettingsPage: React.FC = () => {
  const config = checkSupabaseConfig();

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>System & Account Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Inspect environment configuration, authentication roles, and database connection status.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="crm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>User Profile</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current active session</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</label>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem' }}>Staff Counsellor</div>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Assigned Role</label>
              <div style={{ marginTop: '0.25rem' }}>
                <span style={{
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  Counsellor (Default Least-Privilege)
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Role Boundary</label>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Protected by PostgreSQL Row Level Security. Role elevations require administrative SQL execution.
              </p>
            </div>
          </div>
        </div>

        {/* Database Diagnostic Card */}
        <div className="crm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: config.isConfigured ? '#ecfdf5' : '#fffbeb',
              color: config.isConfigured ? '#10b981' : '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>Supabase Connection</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Backend API status</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Project URL</label>
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.85rem', 
                backgroundColor: 'var(--bg-canvas)', 
                padding: '0.5rem 0.75rem', 
                borderRadius: '6px',
                marginTop: '0.25rem',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {config.url || 'Not configured in .env'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Anon Client Key</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginTop: '0.25rem' 
              }}>
                {config.hasKey ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Configured in .env
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
                    <AlertTriangle size={16} /> Missing Key
                  </span>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Overall Readiness</span>
                <span style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  backgroundColor: config.isConfigured ? '#ecfdf5' : '#fffbeb',
                  color: config.isConfigured ? '#065f46' : '#92400e',
                  border: config.isConfigured ? '1px solid #a7f3d0' : '1px solid #fde68a'
                }}>
                  {config.isConfigured ? 'Connected & Valid' : 'Setup Required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
