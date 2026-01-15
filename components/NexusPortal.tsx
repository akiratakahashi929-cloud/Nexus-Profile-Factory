import { Shield, Smartphone, Zap, ArrowRight, LayoutDashboard, Database } from 'lucide-react';

interface NexusPortalProps {
    onNavigate: (mode: 'ENTRY' | 'PRO' | 'ADVISOR' | 'FACTORY') => void;
    isProAuthorized: boolean;
}

const NexusPortal: React.FC<NexusPortalProps> = ({ onNavigate, isProAuthorized }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--light-gray)',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div className="ripple-effect" style={{ top: '10%', left: '10%', width: '400px', height: '400px' }}></div>
            <div className="ripple-effect" style={{ bottom: '10%', right: '10%', width: '300px', height: '300px', animationDelay: '1s' }}></div>

            {/* Hero Section */}
            <div style={{
                textAlign: 'center',
                marginBottom: '4rem',
                maxWidth: '800px',
                zIndex: 10,
                animation: 'fadeIn 1s ease-out'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--deep-blue)',
                    color: '#fff',
                    padding: '0.4rem 1.2rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    marginBottom: '1.5rem',
                    letterSpacing: '0.1em'
                }}>
                    <Shield size={12} fill="var(--digital-flow-magenta)" color="transparent" />
                    NEXUS ECOSYSTEM v3.0 | PRE-RELEASE
                </div>

                <h1 style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: 'clamp(1.8rem, 10vw, 4.5rem)',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                    color: 'var(--deep-blue)',
                    letterSpacing: '-0.02em'
                }}>
                    MNP攻略の<br />
                    <span style={{
                        background: 'var(--digital-flow-gradient)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>極限進化</span>がここに。
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: 'var(--deep-blue)',
                    opacity: 0.7,
                    fontWeight: 600,
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    シミュレーションからデータ管理まで。<br />
                    あなたのMNP活動をプロレベルへ引き上げる。
                </p>
            </div>

            {/* Navigation Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(1rem, 4vw, 2rem)',
                width: '100%',
                maxWidth: '1100px',
                zIndex: 10
            }}>
                {/* Entry Simulator Card */}
                <div
                    onClick={() => onNavigate('ENTRY')}
                    className="nexus-card"
                    style={{
                        cursor: 'pointer',
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'fadeIn 0.6s ease-out forwards'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(230, 0, 126, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <Smartphone color="var(--digital-flow-magenta)" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Entry Simulator</h2>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '2rem' }}>
                        爆益ルートを瞬時に計算。初心者から中級者まで対応した高機能シミュレーター。
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, color: 'var(--digital-flow-magenta)', fontSize: '0.8rem' }}>
                        START SIMULATION <ArrowRight size={16} />
                    </div>
                </div>

                {/* Pro Dashboard Card */}
                <div
                    onClick={() => onNavigate('PRO')}
                    className="nexus-card"
                    style={{
                        cursor: 'pointer',
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'fadeIn 0.8s ease-out forwards',
                        opacity: isProAuthorized ? 1 : 0.8
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(0, 159, 227, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <LayoutDashboard color="var(--digital-flow-cyan)" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Pro Dashboard</h2>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '2rem' }}>
                        案件管理、収支分析、そして次世代の戦略構築。プロフェッショナルのための司令塔。
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, color: 'var(--digital-flow-cyan)', fontSize: '0.8rem' }}>
                        {isProAuthorized ? 'OPEN DASHBOARD' : 'LOGIN REQUIRED'} <ArrowRight size={16} />
                    </div>
                    {!isProAuthorized && (
                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'var(--deep-blue)',
                            color: '#fff',
                            fontSize: '0.6rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 800
                        }}>
                            LOCKED
                        </div>
                    )}
                </div>

                {/* Account Advisor Card */}
                <div
                    onClick={() => onNavigate('ADVISOR')}
                    className="nexus-card"
                    style={{
                        cursor: 'pointer',
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'fadeIn 1s ease-out forwards',
                        background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)',
                        border: '2px solid rgba(0, 159, 227, 0.1)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(0, 159, 227, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <Zap color="var(--digital-flow-cyan)" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Account Advisor</h2>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '2rem' }}>
                        Xアカウントをアルゴリズムの視点から徹底解剖。爆伸びへの最短ルートを提示。
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, color: 'var(--digital-flow-cyan)', fontSize: '0.8rem' }}>
                        RUN DIAGNOSIS <ArrowRight size={16} />
                    </div>
                </div>

                {/* Nexus Profile Factory Card */}
                <div
                    onClick={() => onNavigate('FACTORY')}
                    className="nexus-card"
                    style={{
                        cursor: 'pointer',
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'fadeIn 1.2s ease-out forwards',
                        background: 'linear-gradient(135deg, #001A33 0%, var(--deep-blue) 100%)',
                        color: '#fff',
                        border: '1px solid rgba(0, 255, 204, 0.2)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(0, 255, 204, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <Database color="#00FFCC" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#00FFCC' }}>Profile Factory</h2>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '2rem' }}>
                        スプレッドシートから全自動でプロファイルを量産。Drive同期と特典配布を自動化。
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, color: '#00FFCC', fontSize: '0.8rem' }}>
                        OPEN FACTORY <ArrowRight size={16} />
                    </div>
                </div>
            </div>

            <footer style={{
                marginTop: '5rem',
                fontSize: '0.6rem',
                fontWeight: 900,
                opacity: 0.3,
                letterSpacing: '0.2em'
            }}>
                DIGITAL NEXUS ARCHITECTURE | POWERED BY GENAI
            </footer>
        </div>
    );
};

export default NexusPortal;
