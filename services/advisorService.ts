import { GoogleGenAI, Type } from "@google/genai";

export interface DiagnosisResult {
    score: number;
    accountInfo: {
        handle: string;
        detectedType: string;
    };
    analysis: {
        visual: {
            score: number;
            feedback: string;
            improvement: string;
        };
        psychology: {
            score: number;
            feedback: string;
            improvement: string;
        };
        algorithm: {
            score: number;
            feedback: string;
            improvement: string;
        };
    };
    topIssues: string[];
    actionPlan: string[];
}

export const diagnoseXAccount = async (accountUrl: string, personality: any): Promise<DiagnosisResult> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    // Extract handle from URL for simulation
    const handle = accountUrl.split('/').pop()?.replace('@', '') || 'unknown';

    const prompt = `あなたはX（旧Twitter）マーケティングの最高責任者であり、2026年最新アルゴリズム（Grok AI）の設計に関わったエキスパートです。
以下のXアカウントURLを分析（シミュレーション）し、スマホ物販マスターナレッジに基づいた深層診断を行ってください。

### 厳守：禁止用語
- **診断結果に「MNP」という単語を一切含めないでください。** 代わりに「スマホ物販」を使用してください。

### 解析対象アカウント
URL: ${accountUrl}
ハンドル名: @${handle}

### あなたが持つ最新知識（診断基準）
1. **視覚心理（Visual）**: アイコンは「左向き」か？（テキストへの視線誘導）。親しみやすい動物・キャラか？
2. **行動経済学（Psychology）**: プロフィール文に「損失回避（しないと損をする）」トリガーがあるか？ 具体的な実績数字があるか？
3. **アルゴリズム適合性（Algorithm）**: 
   - Grok xSEO: 投稿が構造化（リスト、Q&A）されているか。
   - 滞在時間: 2分以上足を止めさせる「深み」があるか。
   - 減点回避: 【PR】表記の徹底、リンク直接貼りの回避、タグ制限(1-2個)。

### 診断の制約
- まるで実際にアカウントをリアルタイムスキャニングしたかのような、具体的で鋭いフィードバックを行ってください。
- ユーザーを否定するのではなく、「ここを直せば爆伸びする」という建設的なトーンで回答してください。

### 出力フォーマット (JSON)
{
  "score": 0-100の総合スコア,
  "accountInfo": { "handle": "${handle}", "detectedType": "スマホ物販発信者/副業垢等" },
  "analysis": {
    "visual": { "score": 0-100, "feedback": "アイコンの現状分析", "improvement": "左向きへの変更、背景色の調整など具体的な指示" },
    "psychology": { "score": 0-100, "feedback": "プロフィールの心理学分析", "improvement": "損失回避フレーズの挿入例など" },
    "algorithm": { "score": 0-100, "feedback": "投稿傾向とGrok適合性分析", "improvement": "構造化リストの導入、リンク集約の提案など" }
  },
  "topIssues": ["最優先で改善すべき点1", "2"],
  "actionPlan": ["今日すぐやるべきこと1", "2"]
}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        accountInfo: {
                            type: Type.OBJECT,
                            properties: {
                                handle: { type: Type.STRING },
                                detectedType: { type: Type.STRING },
                            }
                        },
                        analysis: {
                            type: Type.OBJECT,
                            properties: {
                                visual: {
                                    type: Type.OBJECT,
                                    properties: {
                                        score: { type: Type.NUMBER },
                                        feedback: { type: Type.STRING },
                                        improvement: { type: Type.STRING },
                                    }
                                },
                                psychology: {
                                    type: Type.OBJECT,
                                    properties: {
                                        score: { type: Type.NUMBER },
                                        feedback: { type: Type.STRING },
                                        improvement: { type: Type.STRING },
                                    }
                                },
                                algorithm: {
                                    type: Type.OBJECT,
                                    properties: {
                                        score: { type: Type.NUMBER },
                                        feedback: { type: Type.STRING },
                                        improvement: { type: Type.STRING },
                                    }
                                }
                            }
                        },
                        topIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                        actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["score", "accountInfo", "analysis", "topIssues", "actionPlan"],
                }
            }
        });

        return JSON.parse(response.text || '{}') as DiagnosisResult;
    } catch (error) {
        console.error("Diagnosis Error:", error);
        throw new Error("アカウント診断に失敗しました。URLを確認してください。");
    }
};
