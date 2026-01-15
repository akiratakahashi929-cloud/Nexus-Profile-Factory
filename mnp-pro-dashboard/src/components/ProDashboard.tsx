import React, { useState, useEffect } from 'react';
import { db, ContractLine, FiberContract, RevisionUpdate } from '../db/db';
import { CostCalculator } from '../../../shared/utils/CostCalculator';
import RiskBadge from './RiskBadge';
import { CarrierId, MnpNavigator } from '../../../shared/utils/MnpNavigator';
import { DataExporter } from '../../../shared/utils/DataExporter';
import { EvidenceService } from '../services/EvidenceService';
import '../../../shared/styles/design-tokens.css';

const ProDashboard: React.FC = () => {
    const [activeLines, setActiveLines] = useState<ContractLine[]>([]);
    const [fiberContracts, setFiberContracts] = useState<FiberContract[]>([]);
    const [revisions, setRevisions] = useState<RevisionUpdate[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [formType, setFormType] = useState<'MOBILE' | 'FIBER'>('MOBILE');

    const loadData = async () => {
        try {
            // isArchived を 0 (数値) で検索し、論理的な一貫性を保つ
            const lines = await db.lines.where('isArchived').equals(0).toArray();
            const fibers = await db.fiberContracts.toArray();
            const pendingRevisions = await db.revisions.where('status').equals('PENDING').toArray();

            console.log("Loaded Lines:", lines);
            setActiveLines(lines);
            setFiberContracts(fibers);
            setRevisions(pendingRevisions);
        } catch (error) {
            console.error("データの読み込みに失敗しました:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddLine = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            if (formType === 'MOBILE') {
                const newLine: Omit<ContractLine, 'id'> = {
                    phoneNumber: formData.get('phoneNumber') as string,
                    carrier: formData.get('carrier') as CarrierId,
                    planName: formData.get('planName') as string,
                    contractDate: formData.get('contractDate') as string,
                    adminFee: Number(formData.get('adminFee')) || 3850,
                    deviceCost: Number(formData.get('deviceCost')) || 0,
                    initialPlanCost: 0,
                    runningCost: 0,
                    cashbackAmount: Number(formData.get('cashbackAmount')) || 0,
                    depositAmount: 0,
                    cbStatus: 'PENDING',
                    isArchived: false, // Dexie will map this appropriately, but let's ensure it matches the integer search later if needed
                };

                // 実際に isArchived を 0 として保存する（確実に where('isArchived').equals(0) にヒットさせるため）
                const lineToSave = { ...newLine, isArchived: 0 as any };
                await db.lines.add(lineToSave as any);
                console.log("Line added successfully");
            } else {
                const newFiber: Omit<FiberContract, 'id'> = {
                    providerName: formData.get('providerName') as string,
                    contractDate: formData.get('contractDate') as string,
                    commission: Number(formData.get('commission')) || 0,
                    status: 'PENDING'
                };
                await db.fiberContracts.add(newFiber as any);
                console.log("Fiber added successfully");
            }

            setShowForm(false);
            await loadData();
        } catch (err) {
            console.error("データの保存に失敗しました:", err);
            alert("保存中にエラーが発生しました。コンソールを確認してください。");
        }
    };

    const handleDeleteLine = async (id: number, type: 'MOBILE' | 'FIBER') => {
        if (!window.confirm("このアセットを削除してよろしいですか？")) return;
        try {
            if (type === 'MOBILE') {
                await db.lines.delete(id);
            } else {
                await db.fiberContracts.delete(id);
            }
            await loadData();
        } catch (err) {
            console.error("削除に失敗しました:", err);
        }
    };

    const handleResearchChanges = async () => {
        setIsSyncing(true);
        try {
            await EvidenceService.checkForUpdates();
            await loadData();
        } finally {
            setIsSyncing(false);
        }
    };

    const handleApproveRevision = async (id: number) => {
        await EvidenceService.approveRevision(id);
        await loadData();
    };

    const handleDismissRevision = async (id: number) => {
        await EvidenceService.dismissRevision(id);
        await loadData();
    };

    const handleExport = () => {
        DataExporter.exportToCSV([...activeLines, ...fiberContracts], 'mnp_nexus_export.csv');
    };

    const stackedRevenue = activeLines.reduce((acc, l) => acc + (l.cashbackAmount || 0), 0) +
        fiberContracts.reduce((acc, f) => acc + (f.commission || 0), 0);

    return (
        <div className="nexus-card animate-fade-in" style={{ maxWidth: '1000px', margin: '2rem auto', border: 'none', background: '#fff' }}>
            <header style={{ borderBottom: '1px solid rgba(0,45,86,0.08)', paddingBottom: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--digital-flow-cyan)' }}></span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--deep-blue)', opacity: 0.5, letterSpacing: '0.2rem' }}>システム稼働状況: 正常</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, background: 'var(--digital-flow-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        プロ・アセットボード
                    </h2>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleResearchChanges}
                        className="viral-button glass-morphism"
                        style={{
                            color: 'var(--deep-blue)',
                            padding: '0.8rem 1.4rem',
                            fontSize: '0.75rem',
                            background: isSyncing ? '#eee' : 'rgba(255,255,255,0.8)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                        disabled={isSyncing}
                    >
                        {isSyncing ? '調査中...' : 'AI調査（1次情報同期）'}
                    </button>
                    <button onClick={handleExport} className="viral-button" style={{ background: 'var(--deep-blue)', padding: '0.8rem 1.4rem', fontSize: '0.75rem' }}>CSV出力</button>
                    <button onClick={() => setShowForm(!showForm)} className="viral-button" style={{ padding: '0.8rem 1.4rem', fontSize: '0.75rem' }}>
                        {showForm ? '閉じる' : 'アセット追加'}
                    </button>
                </div>
            </header>

            {revisions.length > 0 && (
                <div className="animate-fade-in" style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(230, 0, 126, 0.05)', borderRadius: '20px', border: '1px solid rgba(230, 0, 126, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>⚡</span>
                        <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: 'var(--digital-flow-magenta)', letterSpacing: '0.1rem' }}>
                            価格変更を検出（要承認）
                        </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {revisions.map(rev => (
                            <div key={rev.id} style={{ background: '#fff', padding: '1.2rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--digital-flow-cyan)', padding: '2px 8px', background: 'rgba(0,159,227,0.1)', borderRadius: '4px' }}>{rev.carrierId.toUpperCase()} 公式情報</span>
                                    <p style={{ margin: '8px 0', fontSize: '0.95rem', fontWeight: 900 }}>
                                        {rev.targetField}: ¥{rev.oldValue.toLocaleString()} → <span style={{ color: 'var(--digital-flow-magenta)' }}>¥{rev.newValue.toLocaleString()}</span>
                                    </p>
                                    <a href={rev.evidenceUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.65rem', color: 'var(--deep-blue)', opacity: 0.4, textDecoration: 'none', borderBottom: '1px solid currentColor' }}>公式サイトのエビデンスを確認 →</a>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleApproveRevision(rev.id!)} style={{ padding: '0.6rem 1.2rem', background: 'var(--digital-flow-cyan)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>承認して適用</button>
                                    <button onClick={() => handleDismissRevision(rev.id!)} style={{ padding: '0.6rem 1.2rem', background: '#f5f5f5', color: '#888', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>無視する</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="animate-fade-in" style={{ marginBottom: '3.5rem', padding: '2.5rem', background: 'var(--light-gray)', borderRadius: '24px', border: '1px solid rgba(0,45,86,0.03)' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button onClick={() => setFormType('MOBILE')} style={{ flex: 1, padding: '1rem', background: formType === 'MOBILE' ? 'var(--digital-flow-magenta)' : '#fff', color: formType === 'MOBILE' ? '#fff' : 'var(--deep-blue)', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', boxShadow: formType === 'MOBILE' ? '0 8px 16px rgba(230,0,126,0.2)' : 'none' }}>スマホ回線</button>
                        <button onClick={() => setFormType('FIBER')} style={{ flex: 1, padding: '1rem', background: formType === 'FIBER' ? 'var(--digital-flow-magenta)' : '#fff', color: formType === 'FIBER' ? '#fff' : 'var(--deep-blue)', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', boxShadow: formType === 'FIBER' ? '0 8px 16px rgba(230,0,126,0.2)' : 'none' }}>光回線 / Wi-Fi</button>
                    </div>
                    <form onSubmit={handleAddLine}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                            {formType === 'MOBILE' ? (
                                <>
                                    <input name="phoneNumber" placeholder="電話番号 (ハイフンなし)" className="nexus-input" required />
                                    <select name="carrier" className="nexus-input" required defaultValue="docomo">
                                        <optgroup label="主要3キャリア">
                                            <option value="docomo">docomo (eximo/irumo)</option>
                                            <option value="au">au</option>
                                            <option value="softbank">SoftBank</option>
                                        </optgroup>
                                        <optgroup label="サブブランド">
                                            <option value="ahamo">ahamo</option>
                                            <option value="uq">UQ mobile</option>
                                            <option value="ymobile">Y!mobile</option>
                                            <option value="povo">povo</option>
                                            <option value="linemo">LINEMO</option>
                                        </optgroup>
                                        <optgroup label="第4キャリア / MVNO">
                                            <option value="rakuten">Rakuten Mobile</option>
                                            <option value="mineo">mineo</option>
                                            <option value="iijmio">IIJmio</option>
                                            <option value="jcom">J:COM Mobile</option>
                                            <option value="aeon">AEON Mobile</option>
                                        </optgroup>
                                    </select>
                                    <input name="planName" placeholder="プラン名" className="nexus-input" required />
                                    <input name="contractDate" type="date" className="nexus-input" required />
                                    <input name="cashbackAmount" type="number" placeholder="キャッシュバック額 ⚡" className="nexus-input" />
                                </>
                            ) : (
                                <>
                                    <input name="providerName" placeholder="事業者名 (例: ドコモ光)" className="nexus-input" required />
                                    <input name="contractDate" type="date" className="nexus-input" required />
                                    <input name="commission" type="number" placeholder="獲得コミッション ⚡" className="nexus-input" required />
                                </>
                            )}
                        </div>
                        <button type="submit" className="viral-button" style={{ marginTop: '2rem', width: '100%', padding: '1.4rem', fontSize: '1rem' }}>リポジトリに保存</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div style={{ background: 'var(--light-gray)', padding: '2.5rem', borderRadius: '24px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 900, opacity: 0.5, letterSpacing: '0.1rem' }}>管理アセット件数</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-hero)' }}>{activeLines.length + fiberContracts.length}</p>
                </div>
                <div style={{ background: 'var(--digital-flow-gradient)', padding: '2.5rem', borderRadius: '24px', color: '#fff', boxShadow: '0 15px 30px rgba(230,0,126,0.2)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 900, opacity: 0.8, letterSpacing: '0.1rem' }}>積み上げ純利益合計</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-hero)' }}>¥{stackedRevenue.toLocaleString()}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.2rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, opacity: 0.4, letterSpacing: '0.2rem', marginBottom: '0.5rem' }}>アクティブ・アセット一覧</h3>
                {[...activeLines.map(l => ({ ...l, type: 'MOBILE' })), ...fiberContracts.map(f => ({ ...f, type: 'FIBER' }))].sort((a, b) => b.contractDate.localeCompare(a.contractDate)).map((item: any) => (
                    <div key={`${item.type}-${item.id}`} className="animate-slide-in" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.5rem 2.5rem',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(0,45,86,0.03)',
                        border: '1px solid rgba(0,45,86,0.02)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--deep-blue)' }}>{item.type === 'MOBILE' ? item.phoneNumber : item.providerName}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.4 }}>
                                {item.type === 'MOBILE' ? item.carrier.toUpperCase() : '固定回線ネットワーク'} | {item.contractDate} 契約
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--digital-flow-magenta)', fontFamily: 'var(--font-hero)' }}>+¥{(item.cashbackAmount || item.commission || 0).toLocaleString()}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {item.type === 'MOBILE' ? <RiskBadge contractDate={item.contractDate} carrierId={item.carrier} /> : <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--digital-flow-cyan)' }}>資産維持中</div>}
                                <button
                                    onClick={() => handleDeleteLine(item.id!, item.type)}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1rem', padding: '5px', opacity: 0.3, transition: 'opacity 0.2s' }}
                                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0.3')}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProDashboard;
