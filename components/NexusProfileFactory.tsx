import React, { useState, useEffect } from 'react';
import { Play, Settings, Database, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { NexusProfileFactory as FactoryService } from '../services/factoryService';

const NexusProfileFactory: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [googleToken, setGoogleToken] = useState<string | null>(null);
    const [accessCode, setAccessCode] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const handleGoogleLogin = () => {
        if (!window.google || !window.google.accounts) {
            addLog("【！】Google 認証ライブラリが読み込まれていません。ページをリロードしてください。");
            alert("Google 認証ライブラリがまだ読み込まれていないか、広告ブロック等で遮断されています。");
            return;
        }

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            addLog("【！】VITE_GOOGLE_CLIENT_ID が設定されていません。Vercelの環境変数を確認してください。");
            return;
        }

        const currentOrigin = window.location.origin;
        addLog(`認証試行中... (オリジン: ${currentOrigin})`);

        // プレビューURLなどでアクセスしている場合に警告
        if (!currentOrigin.includes('nexus-profile-factory-7z1f.vercel.app')) {
            addLog("【⚠️警告】本番用URL以外でアクセスしています。Google Cloud側でこのURLも許可する必要があります。");
        }

        try {
            const client = (window as any).google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
                callback: (response: any) => {
                    if (response.access_token) {
                        setGoogleToken(response.access_token);
                        addLog("Google 認証成功。ファクトリーの制御権を取得しました。");
                    } else if (response.error) {
                        addLog(`【❌】認証エラー: ${response.error}`);
                        if (response.error === 'idpiframe_initialization_failed') {
                            addLog("※シークレットモードやサードパーティCookie拒否が原因の可能性があります。");
                        }
                    }
                },
                error_callback: (err: any) => {
                    addLog(`【❌】GISエラー: ${err.message || 'Unknown error'}`);
                }
            });
            client.requestAccessToken({ prompt: 'consent' }); // 確実に同意画面を出す
        } catch (err: any) {
            addLog(`【❌】例外発生: ${err.message}`);
            console.error(err);
        }
    };

    const startAutomation = async () => {
        if (!googleToken) {
            alert("先に Google 認証を完了させてください。");
            return;
        }

        setIsProcessing(true);
        addLog("プロセスを開始中...");
        setProgress(10);

        try {
            const service = new FactoryService(import.meta.env.VITE_GEMINI_API_KEY, googleToken, addLog);

            addLog("ハック開始: シート 'X:運用者管理' をスキャンしてチェックボックス(ON)を探しています...");
            const triggeredItems = await service.loadTriggeredSeedsFromSheetA();

            if (triggeredItems.length === 0) {
                addLog("待機中: 処理対象のデータが見つかりませんでした。");
                setProgress(100);
                return;
            }

            addLog(`ターゲット捕捉: ${triggeredItems.length}件の有効なエントリを検出。`);

            for (let i = 0; i < triggeredItems.length; i++) {
                const item = triggeredItems[i];
                const currentProgress = 10 + Math.floor((i / triggeredItems.length) * 80);
                setProgress(currentProgress);

                addLog(`[${i + 1}/${triggeredItems.length}] ${item.name} のプロファイルを構築中...`);

                // 1. Gemini Flow
                const profile = await service.executeGeminiFlow(item);
                addLog(`人格生成完了: ${profile.accountName}`);

                // 1.5 Image Generation
                addLog(`画像描画中: ${profile.accountName} のビジュアルを生成しています...`);
                const driveLink = await service.generateAndSaveImage(profile.visualBlueprint, `${profile.accountName}_Nexus`);
                profile.driveLink = driveLink;
                addLog(`画像保存完了: Google Driveへの配備に成功しました。`);

                // 2. Finalize
                await service.finalizeProcess(profile, item.rowIndex);
                addLog(`同期完了: ${item.name} のトリガーを解除しました。`);
            }

            setProgress(100);
            addLog("【SUCCESS】Nexus ネットワークに全プロファイルが正常に配備されました。");
        } catch (err: any) {
            addLog("エラーが発生しました: " + (err.message || err));
            console.error(err);
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
                    <p style={{ fontSize: '0.7rem', opacity: 0.6, margin: 0 }}>
                        環境変数状態: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '⭕️ID設定済' : '❌ID未設定'} / {import.meta.env.VITE_GEMINI_API_KEY ? '⭕️AI設定済' : '❌AI設定済'}
                    </p>
                    <div style={{ fontSize: '0.6rem', opacity: 0.4, marginTop: '4px', wordBreak: 'break-all' }}>
                        Active ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID || 'NONE'}
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(255,165,0,0.05)', border: '1px dashed rgba(255,165,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'orange', marginBottom: '0.5rem' }}>GOOGLE CLOUD 設定用情報</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <code style={{ fontSize: '0.7rem', color: 'orange', wordBreak: 'break-all' }}>{window.location.origin}</code>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.origin);
                            alert("URLをコピーしました！これを Google Cloud の '承認済みの JavaScript オリジン' に貼り付けてください。");
                        }}
                        style={{ background: 'orange', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                        URLをコピー
                    </button>
                </div>
                <p style={{ fontSize: '0.6rem', marginTop: '8px', opacity: 0.7 }}>※このURLが Google Cloud 側で許可されていないと 400 エラーになります。</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        background: googleToken ? 'rgba(0,255,153,0.1)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${googleToken ? '#00FF99' : 'rgba(255,255,255,0.1)'}`,
                        padding: '1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Shield size={20} color={googleToken ? '#00FF99' : 'var(--digital-flow-magenta)'} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                        {googleToken ? "GOOGLE AUTH OK" : "GOOGLE AUTH REQUIRED"}
                    </span>
                </button>
                <div className="status-item" style={{ background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.2rem' }}>NETWORK STATUS</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--digital-flow-cyan)' }}>ENCRYPTED</div>
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
                disabled={isProcessing || !googleToken}
                className="viral-button"
                style={{
                    width: '100%',
                    padding: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '1rem',
                    opacity: (!googleToken || isProcessing) ? 0.5 : 1
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
