import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setErrorMsg('Please enter your full name for staff profile creation.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Account created successfully! Signing in...');
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 800);
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoCredentials = (role: 'counsellor' | 'manager') => {
    if (role === 'counsellor') {
      setEmail('counsellor@brightpath.academy');
      setPassword('Academy2026!');
      setFullName('Staff Counsellor');
    } else {
      setEmail('manager@brightpath.academy');
      setPassword('Academy2026!');
      setFullName('Admissions Manager');
    }
    setErrorMsg(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-canvas)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
      }} className="animate-fade-in-up">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
          }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>BrightPath Academy</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Admissions & Student Enquiry Management System
          </p>
        </div>

        {/* Card Frame */}
        <div className="crm-card" style={{ padding: '2rem' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--bg-canvas)',
            padding: '0.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: !isSignUp ? 'var(--bg-surface)' : 'transparent',
                color: !isSignUp ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: !isSignUp ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: isSignUp ? 'var(--bg-surface)' : 'transparent',
                color: isSignUp ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: isSignUp ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error Notice Banner */}
          {errorMsg && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              color: '#b91c1c',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }} className="animate-fade-in">
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Success Notice Banner */}
          {successMsg && (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              color: '#065f46',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }} className="animate-fade-in">
              <CheckCircle2 size={17} color="#10b981" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                  Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.625rem 0.875rem',
                }}>
                  <User size={16} color="var(--text-subtle)" />
                  <input
                    type="text"
                    required={isSignUp}
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                Work Email
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.625rem 0.875rem',
              }}>
                <Mail size={16} color="var(--text-subtle)" />
                <input
                  type="email"
                  required
                  placeholder="counsellor@brightpath.academy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.625rem 0.875rem',
              }}>
                <Lock size={16} color="var(--text-subtle)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.75rem',
                marginTop: '0.5rem',
                fontSize: '0.95rem',
              }}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Staff Account' : 'Sign In to Workspace'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Workshop Helper */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
              <Sparkles size={13} color="#2563eb" />
              <span>Workshop Quick Fill:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setDemoCredentials('counsellor')}
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                }}
              >
                Fill Counsellor
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('manager')}
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                }}
              >
                Fill Manager
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p style={{ textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Protected by PostgreSQL Row Level Security • Fictional Demo Instance
        </p>
      </div>
    </div>
  );
};
