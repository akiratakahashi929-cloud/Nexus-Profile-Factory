import React, { useState, useEffect } from 'react';
import EntrySimulator from './mnp-entry-simulator/src/components/EntrySimulator';
import ProDashboard from './mnp-pro-dashboard/src/components/ProDashboard';
import NexusPortal from './components/NexusPortal';
import './shared/styles/design-tokens.css';
import { Home, Smartphone, LayoutDashboard, SearchCode } from 'lucide-react';
import AccountDiagnosis from './components/AccountDiagnosis';
import NexusProfileFactory from './components/NexusProfileFactory';
import { Database } from 'lucide-react';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'PORTAL' | 'ENTRY' | 'PRO' | 'ADVISOR' | 'FACTORY'>('PORTAL');
  const [isProAuthorized, setIsProAuthorized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');

    if (modeParam === 'pro') {
      setIsProAuthorized(true);
      setAppMode('PRO');
    } else if (modeParam === 'entry') {
      setAppMode('ENTRY');
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light-gray)' }} className="app-container">
      {/* Top Banner (Status Bar Overlay) */}
      <div className="safe-area-top" style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '4px',
        background: 'var(--digital-flow-gradient)',
        zIndex: 1100
      }} />

      <main style={{ padding: '0 1rem' }}>
        {appMode === 'PORTAL' && (
          <NexusPortal
            onNavigate={(mode) => setAppMode(mode)}
            isProAuthorized={isProAuthorized}
          />
        )}

        {appMode === 'ENTRY' && (
          <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '680px', margin: '1rem auto', display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={() => setAppMode('PORTAL')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--deep-blue)',
                  opacity: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <Home size={14} /> ポータルに戻る
              </button>
            </div>
            <EntrySimulator />
          </div>
        )}

        {appMode === 'PRO' && (
          isProAuthorized ? (
            <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
              <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  onClick={() => setAppMode('PORTAL')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--deep-blue)',
                    opacity: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <Home size={14} /> ポータルに戻る
                </button>
              </div>
              <ProDashboard />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '10rem 1rem' }}>
              <h2 style={{ color: 'var(--digital-flow-magenta)', fontFamily: 'var(--font-hero)', fontWeight: 900 }}>ACCESS DENIED</h2>
              <button onClick={() => setAppMode('PORTAL')} className="viral-button" style={{ marginTop: '2rem' }}>ポータルに戻る</button>
            </div>
          )
        )}

        {appMode === 'ADVISOR' && (
          <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => setAppMode('PORTAL')} style={{ background: 'none', border: 'none', color: 'var(--deep-blue)', opacity: 0.5, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <Home size={14} /> ポータルに戻る
              </button>
            </div>
            <AccountDiagnosis personality={{ ageGroup: '30代', role: 'MNP発信者' }} />
          </div>
        )}

        {appMode === 'FACTORY' && (
          <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '1rem auto', display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => setAppMode('PORTAL')} style={{ background: 'none', border: 'none', color: 'var(--deep-blue)', opacity: 0.5, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <Home size={14} /> ポータルに戻る
              </button>
            </div>
            <NexusProfileFactory />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(0, 45, 86, 0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.7rem 0.5rem calc(0.7rem + env(safe-area-inset-bottom))',
        zIndex: 1000
      }}>
        <button onClick={() => setAppMode('PORTAL')} style={{ background: 'none', border: 'none', color: appMode === 'PORTAL' ? 'var(--digital-flow-cyan)' : 'var(--deep-blue)', opacity: appMode === 'PORTAL' ? 1 : 0.4 }}><Home size={22} /><span style={{ fontSize: '0.5rem', display: 'block' }}>ホーム</span></button>
        <button onClick={() => setAppMode('ENTRY')} style={{ background: 'none', border: 'none', color: appMode === 'ENTRY' ? 'var(--digital-flow-magenta)' : 'var(--deep-blue)', opacity: appMode === 'ENTRY' ? 1 : 0.4 }}><Smartphone size={22} /><span style={{ fontSize: '0.5rem', display: 'block' }}>計算機</span></button>
        <button onClick={() => setAppMode('ADVISOR')} style={{ background: 'none', border: 'none', color: appMode === 'ADVISOR' ? 'var(--digital-flow-magenta)' : 'var(--deep-blue)', opacity: appMode === 'ADVISOR' ? 1 : 0.4 }}><SearchCode size={22} /><span style={{ fontSize: '0.5rem', display: 'block' }}>運用診断</span></button>
        <button onClick={() => setAppMode('FACTORY')} style={{ background: 'none', border: 'none', color: appMode === 'FACTORY' ? 'var(--digital-flow-cyan)' : 'var(--deep-blue)', opacity: appMode === 'FACTORY' ? 1 : 0.4 }}><Database size={22} /><span style={{ fontSize: '0.5rem', display: 'block' }}>工場</span></button>
        <button onClick={() => setAppMode('PRO')} style={{ background: 'none', border: 'none', color: appMode === 'PRO' ? 'var(--digital-flow-cyan)' : 'var(--deep-blue)', opacity: appMode === 'PRO' ? 1 : 0.4 }}><LayoutDashboard size={22} /><span style={{ fontSize: '0.5rem', display: 'block' }}>管理</span></button>
      </nav>
    </div>
  );
};

export default App;
