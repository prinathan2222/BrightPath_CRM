import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, ShieldAlert, RefreshCw } from 'lucide-react';
import { checkSupabaseConfig } from '../../lib/supabaseClient';

export const SetupGuardian: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const config = checkSupabaseConfig();

  const envSnippet = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-publishable-anon-key`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecheck = () => {
    setChecking(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <div className="guardian-container animate-fade-in-up">
      <div className="guardian-header">
        <div className="radar-icon-box">
          <Database size={26} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <h2>Connect Your Supabase Backend</h2>
            <span style={{ 
              backgroundColor: '#eff6ff', 
              color: '#2563eb', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              padding: '0.2rem 0.6rem', 
              borderRadius: '9999px',
              border: '1px solid #bfdbfe'
            }}>
              Phase 2 Active
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            BrightPath CRM requires your Supabase PostgreSQL instance and public anon client key to persist student leads, follow-ups, and activity history.
          </p>
        </div>
      </div>

      {config.issues.length > 0 && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '10px',
          padding: '0.875rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#92400e',
          fontSize: '0.875rem'
        }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Status Notice:</strong> {config.issues.join(' • ')}
          </div>
        </div>
      )}

      <div className="guardian-steps">
        <div className="step-box">
          <div className="step-num">1</div>
          <div className="step-content">
            <h4>Get Credentials</h4>
            <p>Open your Supabase project dashboard, navigate to <strong>Project Settings</strong> &rarr; <strong>API</strong>, and copy your Project URL and anon public key.</p>
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--brand-primary)',
                fontSize: '0.825rem',
                fontWeight: 600,
                marginTop: '0.5rem'
              }}
            >
              Open Supabase Dashboard <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="step-box">
          <div className="step-num">2</div>
          <div className="step-content">
            <h4>Create Local .env</h4>
            <p>Create a file named <code>.env</code> in the <code>brightpath_crm</code> root folder and paste your two client variables.</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                onClick={handleCopy}
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                {copied ? 'Copied Template!' : 'Copy .env Template'}
              </button>
            </div>
          </div>
        </div>

        <div className="step-box">
          <div className="step-num">3</div>
          <div className="step-content">
            <h4>Verify Connection</h4>
            <p>Once you update your <code>.env</code> file, click below to recheck connection or restart the dev server to reload environment variables.</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                onClick={handleRecheck}
                disabled={checking}
                className="btn-primary" 
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              >
                <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
                {checking ? 'Checking...' : 'Check Connection'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="code-snippet">
        <code>
          VITE_SUPABASE_URL=https://your-project-id.supabase.co<br />
          VITE_SUPABASE_ANON_KEY=your-publishable-anon-client-key
        </code>
        <button 
          onClick={handleCopy}
          style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          title="Copy snippet"
        >
          {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
};
