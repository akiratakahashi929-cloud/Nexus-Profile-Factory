import { GoogleGenAI, Type } from "@google/genai";

interface DMConfig {
    targetType: string;
    personality: any;
    objection?: string;
}

export const generateStrategicDM = async (config: DMConfig) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `あなたはSNSマーケティングと心理学のスペシャリストです。
以下の「ターゲット層」に対し、成約率を最大化するDM戦略とメッセージを作成してください。

### ターゲット情報
- 属性: ${config.targetType}
- 悩み: CIC異動、借金、融資不可、即金が必要な状況

### 発信者（あなた）の人格
- 属性: ${config.personality.ageGroup}${config.personality.role}
- トーン: ${config.personality.toneStyle}

### 生成ルール
1. 3ステップで構成してください：
   - Step 1: 心理的障壁を下げる「共感お声がけ」
   - Step 2: 解決策（スマホ物販）の「ベネフィット提示」
   - Step 3: 次の行動（リンクや返信）への「クロージング」
2. 【2027年仕様】AIらしさを消し、あたかも知人から届いたような「温度感」のある文章にしてください。

JSON形式で出力してください：
{
  "step1": "...",
  "step2": "...",
  "step3": "...",
  "advice": "このターゲットに送る際の注意点やタイミング"
}`;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    step1: { type: Type.STRING },
                    step2: { type: Type.STRING },
                    step3: { type: Type.STRING },
                    advice: { type: Type.STRING },
                },
                required: ["step1", "step2", "step3", "advice"],
            }
        }
    });

    return JSON.parse(response.text || '{}');
};

export const handleObjection = async (objection: string, personality: any) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `ユーザーから以下の「拒絶・懸念」が届きました。
これに対し、相手の不安を払拭しつつ、スマホ物販の価値を再認識させる「神切り返し文」を作成してください。

### 相手の拒絶内容
"${objection}"

### あなたの人格
- ${personality.ageGroup}${personality.role} / ${personality.toneStyle}

### 切り返しルール
- 相手を否定せず、一度「受け止める（イエスセット）」。
- 2027年のアルゴリズムに合わせ、誠実さと専門性を両立させる。
- 300文字以内で、次の一言が出るような展開にする。

JSON形式で出力：
{
  "reply": "切り返し文案",
  "psychology": "なぜこの言い方が効くのかの解説"
}`;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    reply: { type: Type.STRING },
                    psychology: { type: Type.STRING },
                },
                required: ["reply", "psychology"],
            }
        }
    });

    return JSON.parse(response.text || '{}');
};
