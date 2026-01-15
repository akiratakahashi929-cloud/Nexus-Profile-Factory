import React, { useState, useEffect } from 'react';
import { SUCCESS_SCENARIOS, ScenarioCase } from '../constants';
import { MnpNavigator, CarrierId } from '../../../shared/utils/MnpNavigator';
import '../../../shared/styles/design-tokens.css';

const infoIconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'rgba(0, 159, 227, 0.1)',
    color: 'var(--digital-flow-cyan)',
    fontSize: '10px',
    fontWeight: 900,
    marginLeft: '6px',
    cursor: 'help'
};

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="nexus-tooltip">
        {text}
    </div>
);

const CaseCard: React.FC<{
    scenario: ScenarioCase;
    isActive: boolean;
    onClick: () => void;
    isContaminated?: boolean;
}> = ({ scenario, isActive, onClick, isContaminated }) => (
    <div
        onClick={isContaminated ? undefined : onClick}
        className="animate-slide-in"
        style={{
            minWidth: '220px',
            padding: '1.5rem',
            background: isActive ? 'var(--digital-flow-gradient)' : 'var(--pure-white)',
            color: isActive ? '#fff' : 'var(--deep-blue)',
            borderRadius: '16px',
            cursor: isContaminated ? 'not-allowed' : 'pointer',
            border: isActive ? 'none' : '1px solid rgba(0, 45, 86, 0.08)',
            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
            boxShadow: isActive ? '0 12px 24px rgba(230, 0, 126, 0.25)' : '0 4px 12px rgba(0, 45, 86, 0.03)',
            marginRight: '1.2rem',
            flexShrink: 0,
            opacity: isContaminated ? 0.3 : 1,
            filter: isContaminated ? 'grayscale(1)' : 'none'
        }}
    >
        <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.8, marginBottom: '0.6rem', letterSpacing: '0.1em' }}>
            {scenario.carrier.toUpperCase()} 戦略
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
            {scenario.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>¥{scenario.profitPerLine.toLocaleString()}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.7 }}>/ 1回線</span>
        </div>
        {isContaminated && (
            <div style={{ fontSize: '0.55rem', color: 'var(--digital-flow-magenta)', marginTop: '8px', fontWeight: 900 }}>
                同一グループのため選択不可
            </div>
        )}
    </div>
);

const EntrySimulator: React.FC = () => {
    const [currentCarrier, setCurrentCarrier] = useState<CarrierId>('docomo');
    const [lineCount, setLineCount] = useState(2);
    const [selectedId, setSelectedId] = useState(SUCCESS_SCENARIOS[0].id);

    // フィルタリングロジック: 現在のキャリアと同じグループの案件を特定
    const filteredScenarios = SUCCESS_SCENARIOS.map(s => {
        const check = MnpNavigator.checkGroupContamination(currentCarrier, s.carrier as CarrierId);
        return { ...s, isContaminated: check.isContaminated };
    });

    const scenario = SUCCESS_SCENARIOS.find(s => s.id === selectedId) || SUCCESS_SCENARIOS[0];
    const totalProfit = scenario.profitPerLine * lineCount;

    // もし選択中の案件がコンタミネーション（NG）になった場合、自動的に有効な最初の案件に切り替える
    useEffect(() => {
        const currentScenario = filteredScenarios.find(s => s.id === selectedId);
        if (currentScenario?.isContaminated) {
            const firstValid = filteredScenarios.find(s => !s.isContaminated);
            if (firstValid) setSelectedId(firstValid.id);
        }
    }, [currentCarrier, selectedId, filteredScenarios]);

    return (
        <div className="nexus-card animate-fade-in" style={{
            maxWidth: '680px',
            margin: 'clamp(1rem, 5vw, 2rem) auto',
            padding: 'clamp(1.5rem, 8vw, 3rem)'
        }}>
            <div className="ripple-effect" style={{ top: '-80px', right: '-80px', width: '300px', height: '300px', borderColor: 'rgba(230, 0, 126, 0.05)' }} />
            <div className="ripple-effect" style={{ bottom: '-100px', left: '-100px', width: '400px', height: '400px', animationDelay: '1s' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <header style={{ marginBottom: 'clamp(1.5rem, 5vw, 3rem)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.8rem' }}>
                        <div style={{ width: '32px', height: '4px', background: 'var(--digital-flow-gradient)', borderRadius: '2px' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--digital-flow-cyan)', letterSpacing: '0.2em' }}>次世代 MNP エンジン</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.4rem, 6vw, 1.8rem)', fontWeight: 900, color: 'var(--deep-blue)', margin: 0, lineHeight: 1.1 }}>
                        DIGITAL NEXUS<br />EXPANSION <span style={{ color: 'var(--digital-flow-magenta)' }}>v3</span>
                    </h1>
                </header>

                {/* STEP 1: 現在のキャリア選択 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--deep-blue)', opacity: 0.4, letterSpacing: '0.15em' }}>
                            STEP 01: 現在利用中のキャリア
                        </label>
                        <div className="tooltip-trigger">
                            <span className="info-icon">i</span>
                            <Tooltip text="現在のキャリアに基づいて、乗り換え可能な（利益が出る）案件を自動判定します。同一グループ内でのMNPは原則として特典対象外になるためです。" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(80px, 25vw, 100px), 1fr))', gap: '8px' }}>
                        {['docomo', 'au', 'softbank', 'rakuten', 'mineo', 'iijmio'].map(c => (
                            <button
                                key={c}
                                onClick={() => setCurrentCarrier(c as CarrierId)}
                                style={{
                                    padding: '0.8rem',
                                    borderRadius: '10px',
                                    border: currentCarrier === c ? '2px solid var(--digital-flow-cyan)' : '1px solid rgba(0,0,0,0.05)',
                                    background: currentCarrier === c ? 'rgba(0,159,227,0.05)' : '#fff',
                                    color: currentCarrier === c ? 'var(--digital-flow-cyan)' : 'var(--deep-blue)',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {c.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </section>

                {/* STEP 2: 収益シナリオ選択 */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--deep-blue)', opacity: 0.4, letterSpacing: '0.15em' }}>
                                STEP 02: 収益シナリオを選択
                            </label>
                            <div className="tooltip-trigger">
                                <span className="info-icon">i</span>
                                <Tooltip text="市場で実際に確認された「爆益案件」のプリセットです。端末売却益やキャッシュバック、ポイント還元を組み合わせた収益モデルを提示しています。" />
                            </div>
                        </div>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.3 }}>横スクロールで確認 →</span>
                    </div>
                    <div className="scroll-hide" style={{ display: 'flex', overflowX: 'auto', padding: '0.5rem 0.2rem 1.5rem 0' }}>
                        {filteredScenarios.map(s => (
                            <CaseCard
                                key={s.id}
                                scenario={s}
                                isActive={selectedId === s.id}
                                onClick={() => setSelectedId(s.id)}
                                isContaminated={s.isContaminated}
                            />
                        ))}
                    </div>
                </section>

                {/* STEP 3: 展開規模 */}
                <section style={{ marginBottom: '3.5rem', background: 'var(--light-gray)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(0,45,86,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--deep-blue)', opacity: 0.5, letterSpacing: '0.1rem' }}>
                                STEP 03: 展開規模 (回線数)
                            </label>
                            <div className="tooltip-trigger">
                                <span className="info-icon">i</span>
                                <Tooltip text="MNPは1人最大5回線まで（キャリアによる）契約可能です。家族分を含めた回線数を選択することで、収益がレバレッジ的に増大します。" />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                background: 'var(--deep-blue)',
                                color: '#fff',
                                padding: '0.4rem 1.2rem',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                fontFamily: 'var(--font-hero)',
                                fontWeight: 900,
                                display: 'inline-block'
                            }}>
                                {lineCount.toString().padStart(2, '0')}
                            </span>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.4, marginTop: '4px' }}>回線総数</div>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={lineCount}
                        onChange={(e) => setLineCount(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            accentColor: 'var(--digital-flow-magenta)',
                            height: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.6rem', fontWeight: 900, opacity: 0.3, letterSpacing: '0.1em' }}>
                        <span>シングル運用</span>
                        <span>マス・アダプション</span>
                    </div>
                </section>

                <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 3.5rem)' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 900, opacity: 0.4, letterSpacing: '0.3em' }}>見込み収益合計</p>
                    <div className="heroic-number" style={{ fontSize: 'clamp(3rem, 15vw, 4.5rem)', margin: '0.5rem 0' }}>
                        ¥{totalProfit.toLocaleString()}<span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', verticalAlign: 'middle', marginLeft: '8px', color: 'var(--digital-flow-cyan)', WebkitTextFillColor: 'initial' }}>+</span>
                    </div>
                    <div className="glass-morphism" style={{ display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '99px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--digital-flow-cyan)', letterSpacing: '0.05em' }}>
                            高精度データ・アーキテクチャ
                        </span>
                    </div>
                </div>

                <button className="viral-button" style={{ width: '100%', padding: '1.4rem', fontSize: '1.1rem', letterSpacing: '0.2rem', boxShadow: '0 15px 35px rgba(230, 0, 126, 0.3)' }}>
                    戦略をローンチする 2.0
                </button>

                <div className="glass-morphism" style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,159,227,0.1)', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '1rem' }}>🎓</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--digital-flow-cyan)', letterSpacing: '0.1em' }}>MNP爆益のメカニズム解説</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--deep-blue)', lineHeight: 1.6 }}>
                        MNPとは「電話番号そのままで他社に乗り換える」こと。
                        キャリアは新規顧客獲得のために、高額なキャッシュバックや端末の格安販売（一括1円等）を用意しています。
                        これらを「現在のキャリア」と「最適な移動先」の組み合わせで攻略し、家族回線を含めた多回線展開を行うことで、数十万円規模の副次収益を生み出すことが可能です。
                    </p>
                </div>

                <footer style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>© 2026 NEXUS ECOSYSTEM</span>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900 }}>暗号化済み</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900 }}>検証済みデータ</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default EntrySimulator;
