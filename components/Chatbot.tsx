import React, { useState } from 'react';

interface ChatbotProps {
    personality: any;
    onSend: (message: string) => Promise<any>;
}

const Chatbot: React.FC<ChatbotProps> = ({ personality, onSend }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sentiment, setSentiment] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

        setIsLoading(true);
        try {
            const res = await onSend(userMsg);
            setMessages(prev => [...prev, { role: 'ai', text: res.answer }]);
            setSentiment(res.sentiment);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: '申し訳ありません、現在通信が不安定です。' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel p-8 rounded-[35px] flex flex-col h-[600px] animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black gradient-text">安心監査・コンシェルジュ</h3>
                {sentiment && (
                    <span className="text-[10px] font-black bg-[#E6007E]/10 text-[#E6007E] px-3 py-1 rounded-full animate-pulse border border-[#E6007E]/20">
                        解析：{sentiment}
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center py-10">
                        <div className="text-5xl mb-4">🤝</div>
                        <p className="text-sm text-slate-400 font-medium">スマホ物販の運用やCICの悩みなど<br />何でもご相談ください。</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#009FE3] text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 italic text-slate-400 text-xs animate-pulse">
                            AIが回答を検討中...
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="メッセージを入力..."
                    className="flex-1 bg-transparent p-4 text-sm outline-none"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-12 h-12 gradient-bg rounded-xl text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
