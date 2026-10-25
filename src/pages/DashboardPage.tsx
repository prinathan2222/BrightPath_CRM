import React from 'react';
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { SetupGuardian } from '../components/common/SetupGuardian';
import { checkSupabaseConfig } from '../lib/supabaseClient';

export const DashboardPage: React.FC = () => {
  const config = checkSupabaseConfig();

  return (
    <div className="animate-fade-in-up">
      {/* Show the Setup Guardian if Supabase environment is unconfigured */}
      {!config.isConfigured && <SetupGuardian />}

      {/* Header Greeting */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Welcome to BrightPath Academy</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time pipeline metrics and student enquiry tracking.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)', 
            backgroundColor: 'var(--bg-surface)', 
            padding: '0.4rem 0.85rem', 
            borderRadius: '8px', 
            border: '1px solid var(--border-subtle)' 
          }}>
            Local time: {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Reconciled Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-stat-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Leads</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-subtext">
            <TrendingUp size={13} color="#10b981" />
            <span>Awaiting initial database records</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-card-top">
            <span className="metric-label">New Enquiries</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-subtext">
            <span>Status: New enquiries</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-card-top">
            <span className="metric-label">Converted</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <UserCheck size={18} />
            </div>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-subtext">
            <span>Conversion rate: 0.0%</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-card-top">
            <span className="metric-label">Overdue Follow-ups</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#ef4444' }}>0</div>
          <div className="metric-subtext">
            <span>Requires urgent counsellor attention</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="crm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Pipeline Breakdown</h3>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Status Distribution</span>
          </div>
          <div style={{ 
            padding: '2.5rem 1.5rem', 
            textAlign: 'center', 
            backgroundColor: 'var(--bg-canvas)', 
            borderRadius: '8px',
            border: '1px dashed var(--border-muted)'
          }}>
            <Clock size={32} color="var(--text-subtle)" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.25rem' }}>Awaiting Lead Data</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Status counts will render dynamically once lead CRUD is connected in Phase 5.
            </p>
          </div>
        </div>

        <div className="crm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Immediate Action Follow-ups</h3>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Overdue / Due Today</span>
          </div>
          <div style={{ 
            padding: '2.5rem 1.5rem', 
            textAlign: 'center', 
            backgroundColor: 'var(--bg-canvas)', 
            borderRadius: '8px',
            border: '1px dashed var(--border-muted)'
          }}>
            <ShieldCheck size={32} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.25rem' }}>No Overdue Calls</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Scheduled student follow-up reminders will appear here for one-click action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
