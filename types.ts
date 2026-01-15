
export interface GeneratedPost {
  main_text: string;
  image_prompt: string;
  cta: string;
  reply_template?: string;
  follow_up_replies?: string[];
  image_url?: string;
  optimization_status?: {
    hashtags: number;
    url_optimized: boolean;
    conversation_trigger: boolean;
  };
}

export type PostTone = '💡 有益重視' | '🤝 共感重視' | '💭 議論誘発' | '👑 権威性';
export type PostFormat = '📄 単発ポスト' | '🧵 スレッド形式';

export interface PersonalityProfile {
  ageGroup: string;
  gender: string;
  role: string;
  toneStyle: string;
  nameStyle: string;
  targetAudience: string;
  iconMotif: string;
}

export interface GenerationConfig {
  theme: string;
  count: number;
  tones: PostTone[];
  format: PostFormat;
  personality: PersonalityProfile;
  optimizations: {
    hashtagLimit: boolean;
    urlRemoval: boolean;
    conversationIntensity: 'low' | 'medium' | 'high';
    emojiStyle: string;
    trendInjection?: string;
  };
}
