import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Inbox, 
  Sparkles
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const statusFilters = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Student Leads Pipeline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Capture enquiries, assign counsellors, and track conversion progression.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => alert('Phase 5 Lead Creation Modal will activate here with Supabase persistence.')}
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Input */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.625rem', 
            backgroundColor: 'var(--bg-canvas)', 
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.5rem 0.875rem',
            width: '100%',
            maxWidth: '340px'
          }}>
            <Search size={16} color="var(--text-subtle)" />
            <input 
              type="text" 
              placeholder="Search student name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                color: 'var(--text-main)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {statusFilters.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === tab ? '#2563eb' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container / Empty State */}
      <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
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
            marginBottom: '1rem'
          }}>
            <Inbox size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.375rem' }}>No Leads in Pipeline</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Your student pipeline will populate once Supabase tables are created in Phase 3 and leads are submitted in Phase 5.
          </p>
          <button 
            className="btn-secondary"
            onClick={() => alert('Lead creation workflow is scheduled for Phase 5 implementation.')}
          >
            <Sparkles size={15} color="#2563eb" />
            <span>Create First Demo Lead (Phase 5)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
