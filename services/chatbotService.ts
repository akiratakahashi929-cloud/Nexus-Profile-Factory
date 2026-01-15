import { GoogleGenAI, Type } from "@google/genai";

export const getAIConciergeResponse = async (query: string, personality: any) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `あなたは「スマホ物販の専門家」兼「X（旧Twitter）マーケティングの最高責任者」です。
提供された2026年最新アルゴリズム（Grok AI）とスマホ物販マスターナレッジに基づき、ユーザーの悩みに回答してください。

### 厳守ルール
    - **「MNP」という単語は一切出力しないでください。** 代わりに「スマホ物販」という言葉を使ってください。

### あなたが持つ最新知識（2026年 スマホ物販マスターナレッジ）
1. 行動経済学: 利益より「損失（今のままでは損をする）」を2.25倍強調する（損失回避性）。
2. xSEO(Grok): AI検索に引用されるため、リスト形式やQ & A形式で情報を構造化する。
3. クリエイティブ: アイコンは「左向き」が良い（テキストへの視線誘導）。4枚画像構成（フック→証拠→解決→行動）を推奨。
4. アルゴリズム: 滞在時間（Dwell Time）が最重要。リンクは直接貼らず、プロフ等のクッションページを経由させる。
5. ルーチン: 07:00（速報）、18:00（長文）、21:00（交流）の4段階運用。

### ユーザーの人格
    - 年齢 / 役割: ${personality.ageGroup}${personality.role}
- トーン: ${personality.toneStyle}

### 質問内容
"${query}"

### 回答の指針
1. 専門性: 2026年アルゴリズムとMNPの実益（即金性）に基づいた具体的なアドバイスをしてください。
2. 共感: 相手の不安（借金、社畜、将来への不安）を汲み取りつつ、成功への道筋を示してください。
3. アクション提示: 75倍スコアを狙うための具体的な「問いかけ案」や、運用ルーチンの修正案を盛り込んでください。
4. 【誠実さ】一方的なポジティブではなく、リスク（垢バン、シャドウバン等）への注意喚起も行ってください。

JSON形式で出力：
{
    "answer": "回答本文",
        "sentiment": "AIによるユーザー心理の分析結果（一言）",
            "next_action": "今日やるべき具体的アクション"
} `;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    answer: { type: Type.STRING },
                    sentiment: { type: Type.STRING },
                    next_action: { type: Type.STRING },
                },
                required: ["answer", "sentiment", "next_action"],
            }
        }
    });

    return JSON.parse(response.text || '{}');
};
