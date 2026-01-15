import React, { useState } from 'react';
interface DMGeneratorProps {
    personality: any;
    onGenerate: (config: any) => Promise<any>;
    onObjection: (text: string) => Promise<any>;
}

const DMGenerator: React.FC<DMGeneratorProps> = ({ personality, onGenerate, onObjection }) => {
    const [target, setTarget] = useState('ブラック・金融悩み層');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [objectionText, setObjectionText] = useState('');
    const [objectionResult, setObjectionResult] = useState<any>(null);

    const targets = ['ブラック・金融悩み層', '短期即金・緊急層', '副業・節約探求層', '主婦・家計改善層'];

    const handleGenerate = async () => {
        setIsLoading(true);
        const res = await onGenerate({ targetType: target, personality });
        setResult(res);
        setIsLoading(false);
    };

    const handleObjectionClick = async () => {
        setIsLoading(true);
        const res = await onObjection(objectionText);
        setObjectionResult(res);
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="glass-panel p-8 rounded-[35px]">
                <h3 className="text-xl font-black mb-6 gradient-text">戦略的DMジェネレーター</h3>

                <div className="mb-8">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">ターゲットを選択</label>
                    <div className="flex flex-wrap gap-3">
                        {targets.map(t => (
                            <button
                                key={t}
                                onClick={() => setTarget(t)}
                                className={`px-5 py-3 rounded-2xl text-xs font-bold border transition-all ${target === t ? 'gradient-bg text-white border-transparent shadow-lg' : 'bg-white text-slate-500 border-slate-100'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full h-16 gradient-bg rounded-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {isLoading ? '戦略を構築中...' : 'DM戦略パッケージを生成'}
                </button>

                {result && (
                    <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-500">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-[#009FE3] uppercase tracking-widest mb-2 block">Step 1: お声がけ</label>
                            <p className="text-sm text-slate-700 leading-relaxed italic">"{result.step1}"</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-[#E6007E] uppercase tracking-widest mb-2 block">Step 2: 解決提示</label>
                            <p className="text-sm text-slate-700 leading-relaxed italic">"{result.step2}"</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <label className="text-[10px] font-black text-[#002D56] uppercase tracking-widest mb-2 block">運用アドバイス</label>
                            <p className="text-xs text-blue-800 font-medium">{result.advice}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel p-8 rounded-[35px] border-2 border-[#E6007E]/20">
                <h3 className="text-xl font-black mb-6 gradient-text flex items-center gap-2">
                    <span>🛡️</span> DM切り返しシミュレーター
                </h3>

                <div className="mb-6">
                    <textarea
                        placeholder="相手から来た拒絶・懸念を入力してください（例：怪しいです、お金がないです）"
                        value={objectionText}
                        onChange={(e) => setObjectionText(e.target.value)}
                        className="w-full p-5 rounded-2xl border border-slate-100 focus:border-[#E6007E] outline-none h-24 text-sm"
                    />
                </div>

                <button
                    onClick={handleObjectionClick}
                    disabled={isLoading || !objectionText}
                    className="w-full h-14 bg-white border-2 border-[#E6007E] text-[#E6007E] rounded-2xl font-black hover:bg-[#E6007E] hover:text-white transition-all shadow-sm"
                >
                    神切り返しを生成
                </button>

                {objectionResult && (
                    <div className="mt-6 p-6 bg-slate-50 rounded-2xl border-l-8 border-[#E6007E]">
                        <p className="font-black text-sm mb-3">【推奨される回答案】</p>
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">{objectionResult.reply}</p>
                        <div className="pt-4 border-t border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">心理学的ポイント</p>
                            <p className="text-xs text-slate-500 font-medium">{objectionResult.psychology}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DMGenerator;
