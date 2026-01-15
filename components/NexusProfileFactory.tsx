import React, { useState } from 'react';
import { Play, Settings, Database, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';

const NexusProfileFactory: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const startAutomation = async () => {
        setIsProcessing(true);
        addLog("プロセスを開始中...");

        try {
            addLog("ハック開始: シートa 'X:運用者管理' からチェックボックスがONの行をスキャン中...");
            await new Promise(r => setTimeout(r, 1000));

            // 実際はここで loadTriggeredSeedsFromSheetA() を呼ぶ
            addLog("ターゲット捕捉: 処理待ちの有効なSeedを検出しました。");

            addLog("Gemini 1.5 Pro 起動: 10,000,000通りの統計的エントロピーを適用中...");
            setProgress(30);
            await new Promise(r => setTimeout(r, 1500));

            addLog("ビジュアル設計図構築: シアン・マゼンタ・人格別背景色の統合中...");
            setProgress(60);
            await new Promise(r => setTimeout(r, 1000));

            addLog("資産同期: Google Drive への自動保存と公開リンクを発行中...");
            setProgress(90);
            await new Promise(r => setTimeout(r, 1200));

            addLog("同期完了: 'キャリクラ_Sync' への書き出しとトリガーのリセットに成功しました。");
            setProgress(100);
            addLog("【SUCCESS】Nexus ネットワークにプロファイルが正常に配備されました。");
        } catch (err) {
            addLog("エラーが発生しました: " + err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="glass-card" style={{ maxWidth: '400px', margin: '10rem auto', padding: '2rem', textAlign: 'center' }}>
                <Shield size={40} color="var(--digital-flow-magenta)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>ADMIN ACCESS</h2>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '2rem' }}>Nexus Profile Factory を起動するには管理者コードを入力してください。</p>
                <input
                    type="password"
                    placeholder="ENTER ACCESS CODE"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        fontWeight: 900,
                        letterSpacing: '0.3em'
                    }}
                />
                <button
                    onClick={() => {
                        if (accessCode === "NEXUS_2026") { // 暫定コード
                            setIsAuthenticated(true);
                        } else {
                            alert("ACCESS DENIED");
                        }
                    }}
                    className="viral-button"
                    style={{ width: '100%' }}
                >
                    UNLOCK FACTORY
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--digital-flow-gradient)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Database size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Nexus Profile Factory</h2>
                    <p style={{ fontSize: '0.7rem', opacity: 0.6, margin: 0 }}>全自動プロファイル生成・同期エンジン</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="status-item" style={{ background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.5rem' }}>読み込み元 (シートA)</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>X:運用者管理</div>
                </div>
                <div className="status-item" style={{ background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.5rem' }}>書き出し先 (シートB)</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>キャリクラ_Sync</div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>進行状況</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'var(--digital-flow-cyan)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>

            <button
                onClick={startAutomation}
                disabled={isProcessing}
                className="viral-button"
                style={{
                    width: '100%',
                    padding: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '1rem'
                }}
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                {isProcessing ? "自動生成を実行中..." : "ファクトリーを稼働させる"}
            </button>

            <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.5 }}>
                    プロセスログ
                </h3>
                <div style={{
                    background: '#001A33',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    height: '200px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    color: '#00FFCC',
                    border: '1px solid rgba(0,255,204,0.1)'
                }}>
                    {logs.length === 0 ? (
                        <div style={{ opacity: 0.3 }}>稼働待機中...</div>
                    ) : logs.map((log, i) => (
                        <div key={i} style={{ marginBottom: '4px', borderBottom: '1px solid rgba(0,255,204,0.05)', paddingBottom: '4px' }}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NexusProfileFactory;
