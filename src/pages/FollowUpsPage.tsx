import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar
} from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed'>('today');

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Follow-up Scheduler</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Plan calls, track commitment due dates, and record counsellor completion notes.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => alert('Follow-up scheduler modal activates in Phase 6.')}
        >
          <Plus size={16} />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Segmented Filter Controls */}
      <div className="crm-card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('today')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'today' ? '#2563eb' : 'transparent',
              color: activeTab === 'today' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Clock size={15} />
            <span>Due Today (0)</span>
          </button>

          <button
            onClick={() => setActiveTab('overdue')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'overdue' ? '#ef4444' : 'transparent',
              color: activeTab === 'overdue' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <AlertCircle size={15} />
            <span>Overdue (0)</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'upcoming' ? '#2563eb' : 'transparent',
              color: activeTab === 'upcoming' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Calendar size={15} />
            <span>Upcoming (0)</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'completed' ? '#10b981' : 'transparent',
              color: activeTab === 'completed' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <CheckCircle2 size={15} />
            <span>Completed (0)</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="crm-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb',
          margin: '0 auto 1rem'
        }}>
          <CalendarClock size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.375rem' }}>No Follow-ups Scheduled</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
          When follow-ups are scheduled against student leads, due date calculations and overdue indicators will automatically categorize them here.
        </p>
      </div>
    </div>
  );
};
