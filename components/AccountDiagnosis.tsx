import React, { useState } from 'react';
import { diagnoseXAccount, DiagnosisResult } from '../services/advisorService';

const AccountDiagnosis: React.FC<{ personality: any }> = ({ personality }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiagnosisResult | null>(null);

    const handleRunDiagnosis = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await diagnoseXAccount(url, personality);
            setResult(res);
        } catch (err) {
            alert('診断に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 animate-in fade-in duration-700">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                    Account <span className="text-[#009FE3]">Diagnostic</span>
                </h1>
                <p className="text-slate-500 font-bold max-w-xl mx-auto">
                    XアカウントのURLを入力してください。2026年最新アルゴリズム（Grok）に基づき、
                    あなたの運用の「伸び代」を深層解析します。
                </p>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-[#009FE3] animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-[#E6007E] animate-pulse delay-150"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="https://x.com/your_account"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#009FE3]/10 focus:border-[#009FE3] transition-all"
                    />
                    <button
                        onClick={handleRunDiagnosis}
                        disabled={loading || !url}
                        className="bg-[#002D56] text-white px-10 py-4 rounded-3xl font-black hover:bg-[#009FE3] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#002D56]/20"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                深層スキャン中...
                            </>
                        ) : '診断を開始する'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-slate-100 border-t-[#E6007E] rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-[#E6007E] text-[10px] animate-pulse">SCANNING</div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse transition-all">Grok AI アルゴリズム適合性を検証中...</p>
                        <p className="text-slate-300 text-[10px] font-bold">視覚心理・行動経済学・xSEOの3軸で解析しています</p>
                    </div>
                </div>
            )}

            {result && !loading && (
                <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
                    {/* Hero Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-gradient-to-br from-[#002D56] to-[#009FE3] rounded-[40px] p-8 text-white flex flex-col items-center justify-center text-center shadow-xl">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">Strategy Score</div>
                            <div className="text-7xl font-black mb-2">{result.score}</div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                {result.accountInfo.detectedType}
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl flex flex-col justify-center">
                            <h3 className="text-[10px] font-black text-[#E6007E] uppercase tracking-widest mb-4">改善すべき最優先事項</h3>
                            <ul className="space-y-4">
                                {result.topIssues.map((issue, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-[#E6007E]"></div>
                                        </div>
                                        <p className="text-slate-700 font-bold leading-tight">{issue}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Detailed Analysis Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { key: 'visual', label: '視覚心理 (Visual)', data: result.analysis.visual, color: '#009FE3' },
                            { key: 'psychology', label: '心理フック (Psych)', data: result.analysis.psychology, color: '#E6007E' },
                            { key: 'algorithm', label: 'AIxSEO (Grok)', data: result.analysis.algorithm, color: '#002D56' }
                        ].map((tab) => (
                            <div key={tab.key} className="bg-white rounded-[30px] p-6 border border-slate-100 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: tab.color }}>{tab.label}</div>
                                    <div className="text-xl font-black" style={{ color: tab.color }}>{tab.data.score}%</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 font-bold italic leading-relaxed">
                                        "{tab.data.feedback}"
                                    </div>
                                    <div className="bg-green-50/50 p-4 rounded-2xl text-xs text-green-700 font-bold leading-relaxed border border-green-100">
                                        <div className="text-[8px] uppercase tracking-widest mb-1 opacity-60">IMPROVEMENT</div>
                                        {tab.data.improvement}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Plan */}
                    <div className="bg-[#F8FAFC] rounded-[40px] p-10 border-2 border-dashed border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl">⚡️</span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Action Plan</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {result.actionPlan.map((action, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:border-[#009FE3] transition-all cursor-default">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-[#009FE3] flex items-center justify-center font-black text-slate-400 group-hover:text-white transition-all">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm font-black text-slate-700">{action}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center pb-10">
                        <button
                            onClick={() => setResult(null)}
                            className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#009FE3] transition-all"
                        >
                            Reset Diagnosis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountDiagnosis;
