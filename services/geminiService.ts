
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPost, GenerationConfig } from "../types";

export const generate2026OptimizedPosts = async (config: GenerationConfig): Promise<GeneratedPost[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  // Check for image generation command
  const shouldGenerateImage = config.theme.includes("画像あり") || config.theme.includes("/image");

  // Clean theme
  const userIntent = config.theme.replace("画像あり", "").replace("/image", "").trim();

  const textPrompt = `あなたはCarrier Craft（CC）の戦略を完全にマスターした、X（旧Twitter）マーケティングの最高責任者です。
2026年の最新アルゴリズム（Grok AI）とスマホ物販マスターナレッジ（完全版）に基づき、成約を爆発させる「2026年仕様」のポストを生成してください。

### 厳守：禁止ワードと用語設定
1. **「MNP」という単語の使用を一切禁止** します。出力されるテキスト（本文、CTA、リプライ等）に含めてはなりません。
2. 代わりの用語として **「スマホ物販」** 、「キャリア物販」、「ポイ活」を使用してください。メインは「スマホ物販」です。

### 2026年最重要戦略マニフェスト
1. **損失回避 (Loss Aversion)**: 読者が「得をする」喜びより「損をする」痛み(2.25x)を強く感じる心理を利用。現状維持の損失を強調せよ。
2. **PR-First Placement**: 透明性が信頼を生む。投稿の冒頭に必ず 【PR】 または 【広告】 を配置。
3. **Grok構造化 (Structured Data)**: 箇条書きやQ&A形式を多用し、AIが「良質な回答ソース」として引用しやすい構造にせよ。
4. **マイクロターゲティング**: 「〇〇県の方限定」など、特定の層を強烈にフィルタリングし、自分事化(カクテルパーティー効果)を深めよ。

### 核心ルール（Grok/X 2026）
1. **会話の最大化 (75x Score)**: 読者が思わずリプライしたくなる「問いかけ」を含める。
2. **滞在時間 (Dwell Time)**: 2分以上足を止めさせるための「深いインサイト」と「4枚構成のストーリー展開」。
3. **減点回避**: 
   - ハッシュタグは1〜2個（冒頭PRとは別）。
   - 外部リンクは本文排除。プロフや固定ツイへの誘導をBridgeに。
   - 誤字脱字ゼロ。

### スマホ物販特化・マスターナレッジ
1. **最強フック**: 三木谷リンク、実質24円iPhone16、元店員暴露等の強烈な名詞。
2. **アンダードッグ物語**: 「社畜の逆襲」「家計防衛」といった共感ストーリーを肉付け。
3. **視覚指示**: 4枚画像構成（フック→証拠→解決→行動）を前提としたプロンプト生成。

### あなたの人格・設定
- 年代/属性: ${config.personality.ageGroup} / ${config.personality.gender}
- 役割: ${config.personality.role}（左向きアイコン推奨、権威性のある専門家）
- トーン: ${config.personality.toneStyle}
- 投稿テーマ: ${userIntent}
- ルート（Axis）: ${config.tones[0] || 'バランス'}

### 出力フォーマット
出力は指定された件数の配列を持つJSON形式のみとし、他のテキストは一切出力しないこと。
[
  {
    "main_text": "280文字以内のGrok解析最適化投稿（タグ1-2個、リンクなし）",
    "cta": "リプライ75倍加点を狙うための具体的な問いかけ",
    "follow_up_replies": ["自ら会話を開始する追撃リプライ1", "滞在時間を伸ばす補足リプライ2"],
    "reply_template": "DM/公式LINEへの誘導に繋げるストーリー性のあるテンプレート",
    "image_prompt": "知性と信頼を感じさせる、高品質なビジュアルプロンプト"
  }
]`;

  try {
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              main_text: { type: Type.STRING },
              cta: { type: Type.STRING },
              follow_up_replies: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reply_template: { type: Type.STRING },
              image_prompt: { type: Type.STRING },
            },
            required: ["main_text", "cta", "image_prompt", "reply_template", "follow_up_replies"],
          },
        },
      },
    });

    const responseText = typeof textResponse.text === 'function' ? textResponse.text() : textResponse.text;
    const posts = JSON.parse(responseText || '[]') as GeneratedPost[];

    if (shouldGenerateImage) {
      const postsWithImages = await Promise.all(posts.map(async (post) => {
        try {
          const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [{ text: `${config.personality.iconMotif}スタイルの高品質ビジュアル: ${post.image_prompt}` }]
            },
            config: {
              imageConfig: { aspectRatio: "1:1" }
            }
          });

          const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (imagePart?.inlineData?.data) {
            post.image_url = `data:image/png;base64,${imagePart.inlineData.data}`;
          }
        } catch (err) {
          console.error("Image gen failed", err);
        }
        return post;
      }));
      return postsWithImages;
    }

    return posts;
  } catch (error) {
    console.error("Generation Error:", error);
    throw new Error("2026年最適化生成に失敗しました。");
  }
};
