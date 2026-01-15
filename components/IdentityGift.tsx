import React from 'react';

interface IdentityGiftProps {
    userData: {
        accountName: string;
        xId: string;
        bio: string;
        firstPost: string;
        iconUrl: string;
        bannerUrl: string;
    };
    onClose: () => void;
}

const IdentityGift: React.FC<IdentityGiftProps> = ({ userData, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-white/20 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-700">
            <div className="max-w-xl w-full glass-panel p-10 rounded-[50px] text-center relative overflow-hidden shadow-2xl scale-in-center">
                {/* Celebration Particles (Simplified CSS) */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] text-2xl animate-bounce">🎈</div>
                    <div className="absolute top-[15%] right-[25%] text-2xl animate-bounce delay-100">✨</div>
                    <div className="absolute bottom-[20%] left-[15%] text-2xl animate-bounce delay-200">💎</div>
                </div>

                <div className="relative z-10">
                    <div className="inline-block p-1 gradient-bg rounded-full mb-6">
                        <img
                            src={userData.iconUrl}
                            alt="Icon"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                        />
                    </div>

                    <h2 className="text-3xl font-black mb-2 gradient-text">特別アカウント設計図</h2>
                    <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">あなただけのギフトが届きました</p>

                    <div className="space-y-6 text-left bg-slate-50/50 p-8 rounded-[30px] border border-white">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">アカウント名 / ID</label>
                            <p className="text-lg font-black">{userData.accountName} <span className="text-[#009FE3]">@{userData.xId}</span></p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">プロフィール（バイオ）</label>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{userData.bio}</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">バナープレビュー</label>
                            <div className="w-full h-24 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                <img src={userData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[10px] font-black text-[#E6007E] uppercase tracking-widest block mb-2">💡 最初のバズ投稿案</label>
                            <p className="text-xs text-slate-500 font-medium italic">「{userData.firstPost}」</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-10 w-full h-16 gradient-bg rounded-2xl font-black text-lg text-white shadow-2xl hover:scale-[1.02] transition-all"
                    >
                        ギフトを受け取って進む
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes scale-in-center {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scale-in-center { animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
      `}</style>
        </div>
    );
};

export default IdentityGift;
