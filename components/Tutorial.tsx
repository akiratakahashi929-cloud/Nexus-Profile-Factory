import React, { useState } from 'react';

interface TutorialProps {
    onComplete: () => void;
    onSkip: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "1. 投稿生成の魔法",
            desc: "テーマを入力してボタンを押すだけで 2027年アルゴリズムに対応した投稿が完成します",
            icon: "✨"
        },
        {
            title: "2. 戦略的DMの活用",
            desc: "CICや借金悩みに寄り添った 高成約率なDM戦略をAIが組み立てます",
            icon: "💬"
        },
        {
            title: "3. 日々のアクション",
            desc: "ダッシュボードの指示に従うだけで 迷いなくアカウントを運用できます",
            icon: "🚀"
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-[#002D56]/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="max-w-md w-full glass-panel p-10 rounded-[40px] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 gradient-bg"></div>

                <div className="mb-8">
                    <div className="text-6xl mb-6 animate-bounce">{steps[currentStep].icon}</div>
                    <h2 className="text-2xl font-black mb-4 gradient-text">{steps[currentStep].title}</h2>
                    <p className="text-slate-500 leading-relaxed">{steps[currentStep].desc}</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onSkip}
                        className="flex-1 h-14 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                    >
                        スキップ
                    </button>
                    <button
                        onClick={() => currentStep < steps.length - 1 ? setCurrentStep(currentStep + 1) : onComplete()}
                        className="flex-1 h-14 gradient-bg rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all"
                    >
                        {currentStep < steps.length - 1 ? "次へ" : "開始する"}
                    </button>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-8 gradient-bg' : 'w-2 bg-slate-200'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tutorial;
