import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Zap, Shield, Sparkles } from 'lucide-react';

/*
  DEFY CHATBOT - THE ULTIMATE INSIGHT ENGINE
  Design: Cyber-Premium / Glassmorphism
*/

const DefyChatbot: React.FC = () => {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { role: 'ai', content: 'ようこそ。私は Defy。常識という名の牢獄を破壊し、あなたの「スマホ物販」に革命を起こすために設計された。' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // TODO: Integrate Gemini API
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: `「${userMsg}」について、2026年最新アルゴリズムの視点から解析を行っている。今お伝えできるのは、現状維持こそが最大の「損失」であるということだ。` }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#040B14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '"Inter", sans-serif',
            color: '#fff'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px',
                height: '80vh',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '32px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 0, 255, 0.05) 100%)'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                    }}>
                        <Bot size={24} color="#000" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, letterSpacing: '0.05em' }}>DEFY CHATBOT</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF99', animation: 'pulse 2s infinite' }} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.6 }}>SYSTEM ACTIVE | V2.0 optimized</span>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            gap: '6px'
                        }}>
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                padding: '14px 18px',
                                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                                border: `1px solid ${msg.role === 'user' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                                fontWeight: 500
                            }}>
                                {msg.content}
                            </div>
                            <span style={{ fontSize: '0.6rem', opacity: 0.4, fontWeight: 700 }}>
                                {msg.role === 'user' ? 'YOU' : 'DEFY AI'}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '10px' }}>
                            <div className="typing-dot" style={{ width: '6px', height: '6px', background: '#00FFFF', borderRadius: '50%', animation: 'bounce 0.6s infinite 0.1s' }} />
                            <div className="typing-dot" style={{ width: '6px', height: '6px', background: '#FF00FF', borderRadius: '50%', animation: 'bounce 0.6s infinite 0.2s' }} />
                            <div className="typing-dot" style={{ width: '6px', height: '6px', background: '#00FFFF', borderRadius: '50%', animation: 'bounce 0.6s infinite 0.3s' }} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{ padding: '24px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="問いかけを入力..."
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '16px 50px 16px 20px',
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                width: '40px',
                                height: '40px',
                                background: 'rgba(0, 255, 255, 0.1)',
                                border: 'none',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#00FFFF'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        opacity: 0.4
                    }}>
                        <Shield size={14} />
                        <Zap size={14} />
                        <Sparkles size={14} />
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
};

export default DefyChatbot;
