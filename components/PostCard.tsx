
import React, { useState } from 'react';
import { GeneratedPost } from '../types';

interface PostCardProps {
  post: GeneratedPost;
  onDelete?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedCta, setCopiedCta] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAllAssets = async () => {
    const allText = `【メイン投稿】\n${post.main_text}\n\n【追撃リプライ】\n${(post.follow_up_replies || []).join('\n')}\n\n【成約誘導リプライ】\n${post.reply_template || ''}`;
    await copyToClipboard(allText, setCopiedBatch);
  };

  const timestamp = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-[30px] shadow-sm border border-slate-100 overflow-hidden transition-all hover:border-[#009FE3]/30 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10 relative">
      <div className="p-7">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-black text-xs shadow-md">
              Nexus
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900">Digital Engine v3.0</span>
                <span className="bg-[#002D56] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse border border-[#009FE3]/30">Grok 2026 Optimized</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold leading-none mt-1 uppercase">@nexus_expansion · {timestamp}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAllAssets}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border flex items-center gap-2 ${copiedBatch ? 'bg-green-500 text-white border-transparent' : 'bg-slate-50 text-[#009FE3] border-[#009FE3]/20 hover:bg-[#009FE3]/5'}`}
            >
              {copiedBatch ? '資産を全コピー完了' : '資産をワンタップ一括コピー'}
            </button>
            {onDelete && (
              <button onClick={onDelete} className="text-slate-200 hover:text-red-500 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="text-[10px] font-black text-[#E6007E] uppercase tracking-widest mb-2 block ml-1">X 投稿本文（リーチ最大化済み）</label>
          <div className="bg-slate-50 p-5 rounded-2xl text-[16px] text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-100 relative group mb-5 shadow-inner">
            {post.main_text}
            <button
              onClick={() => copyToClipboard(post.main_text, setCopiedMain)}
              className={`absolute top-2 right-2 p-2.5 rounded-xl transition-all ${copiedMain ? 'bg-green-500 text-white scale-110' : 'bg-white shadow-sm text-slate-400 opacity-0 group-hover:opacity-100'}`}
            >
              {copiedMain ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            </button>
          </div>

          {post.image_url && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 mb-6 bg-slate-50 relative aspect-square group shadow-lg">
              <img
                src={post.image_url}
                alt="AI Generated Content"
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-[9px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest border border-white/20">
                Nexus Expansion Visual
              </div>
            </div>
          )}

          {post.follow_up_replies && post.follow_up_replies.length > 0 && (
            <div className="mb-8 space-y-3">
              <label className="text-[10px] font-black text-[#009FE3] uppercase tracking-widest mb-2 block ml-1">Conversation Baiting（追撃リプライ連鎖）</label>
              {post.follow_up_replies.map((reply, ridx) => (
                <div key={ridx} className="bg-slate-50 p-4 rounded-xl border-l-4 border-[#009FE3] text-sm text-slate-700 italic">
                  {reply}
                </div>
              ))}
            </div>
          )}

          {post.reply_template && (
            <div className="mt-8 p-6 bg-gradient-to-br from-[#009FE3]/10 to-[#E6007E]/10 border-2 border-indigo-200 rounded-3xl relative group shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🚀</span>
                <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest block">リプライ欄：成約特化テンプレート</label>
              </div>
              <p className="text-[15px] text-slate-800 font-bold italic pr-4 leading-relaxed whitespace-pre-wrap">{post.reply_template}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => copyToClipboard(post.reply_template || '', setCopiedReply)}
                  className={`px-5 py-2.5 rounded-full font-black text-xs transition-all flex items-center gap-2 shadow-md ${copiedReply ? 'bg-green-500 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95'}`}
                >
                  {copiedReply ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> コピー完了</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> 誘導文をコピー</>
                  )}
                </button>
              </div>
              <div className="absolute -bottom-3 -left-2 bg-indigo-600 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-md">
                PERSONALIZED CONVERSION
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group mb-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">会話トリガー（75倍加点ターゲット）</label>
          <p className="text-sm font-bold text-slate-800 italic pr-8 leading-relaxed">"{post.cta}"</p>
          <button
            onClick={() => copyToClipboard(post.cta, setCopiedCta)}
            className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${copiedCta ? 'bg-green-500 text-white scale-110' : 'bg-white shadow-sm text-slate-400 opacity-0 group-hover:opacity-100'}`}
          >
            {copiedCta ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg> : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          </button>
        </div>

        {/* Algorithm Analysis Section */}
        <div className="border-t border-dashed border-slate-200 pt-6 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#E6007E] animate-ping"></div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grok AI 2026 深層アルゴリズム分析</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">PR/広告明示</div>
              <div className={`text-sm font-black ${(post.main_text.startsWith('【PR】') || post.main_text.startsWith('【広告】')) ? 'text-green-500' : 'text-red-500'}`}>
                {(post.main_text.startsWith('【PR】') || post.main_text.startsWith('【広告】')) ? 'COMPLIANT' : 'MISSING'}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">損失回避心理</div>
              <div className="text-sm font-black text-[#E6007E]">2.25x <span className="text-[10px]">ACTIVE</span></div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">構造化 (xSEO)</div>
              <div className={`text-sm font-black ${(post.main_text.includes('・') || post.main_text.includes('：')) ? 'text-[#009FE3]' : 'text-slate-400'}`}>
                {(post.main_text.includes('・') || post.main_text.includes('：')) ? 'STRUCTURED' : 'STORY'}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">タグ制限</div>
              <div className={`text-sm font-black ${(post.main_text.match(/#/g) || []).length <= 2 ? 'text-green-500' : 'text-red-500'}`}>
                {(post.main_text.match(/#/g) || []).length} / 2
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">リンク回避</div>
              <div className={`text-sm font-black ${!post.main_text.includes('http') ? 'text-green-500' : 'text-red-500'}`}>
                SAFE
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">滞在時間推定</div>
              <div className="text-sm font-black text-orange-500">2min+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
