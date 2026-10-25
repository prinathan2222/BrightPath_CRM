import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { checkSupabaseConfig } from '../../lib/supabaseClient';

export const ConnectionBadge: React.FC = () => {
  const status = checkSupabaseConfig();

  if (status.isConfigured) {
    return (
      <div className="connection-pill connected" title={`Connected to ${status.url}`}>
        <span className="status-dot green" />
        <CheckCircle2 size={13} />
        <span>Supabase Connected</span>
      </div>
    );
  }

  return (
    <div className="connection-pill warning" title="Supabase credentials not yet configured in .env">
      <span className="status-dot amber" />
      <AlertTriangle size={13} />
      <span>Setup Required</span>
    </div>
  );
};
