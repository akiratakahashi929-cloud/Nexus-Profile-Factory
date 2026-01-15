import { GoogleGenAI } from "@google/genai";

// ユーザー指定のスプレッドシートID
const SPREADSHEET_ID = '1wBTahW3YBd46DYsm3EFOCeSdDrd-4VCliL13LezSWas';

// タブ名（シートa/b）
const SHEET_A_NAME = 'X:運用者管理';
const SHEET_B_NAME = 'キャリクラ_Sync';

// ユーザー指定のGoogle DriveフォルダID
const DRIVE_FOLDER_ID = '1IbOAxTDSBJqkSXUWi9WwDM9xTIeJmd68';

export interface NexusProfile {
    accountName: string;
    userId: string;
    bio: string;
    firstPost: string;
    visualBlueprint: string;
    seed: string;
    gmail: string;
    driveLink?: string;
    baseColor?: string;
}

export class NexusProfileFactory {
    private ai: any;
    private token: string;

    constructor(apiKey: string, googleToken: string) {
        this.ai = new GoogleGenAI({ apiKey });
        this.token = googleToken;
    }

    private async callGoogleAPI(url: string, method: string = 'GET', body: any = null) {
        const options: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Google API Error: ${error.error?.message || response.statusText}`);
        }
        return response.json();
    }

    /**
     * シートaから「チェックボックスがTRUE」かつ「未処理」の行を抽出する
     */
    async loadTriggeredSeedsFromSheetA() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_A_NAME)}!A2:D`;
        const data = await this.callGoogleAPI(url);
        const rows = data.values || [];

        return rows
            .map((row: any, index: number) => ({
                gmail: row[0],
                seed: row[1],
                name: row[2],
                isTriggered: row[3] === 'TRUE',
                rowIndex: index + 2
            }))
            .filter((item: any) => item.isTriggered);
    }

    /**
     * 3段階のGeminiフローを実行
     */
    async executeGeminiFlow(item: { gmail: string, seed: string, name: string }): Promise<NexusProfile> {
        const step1Prompt = `
# Role: 統計的エントロピー・プロファイラー (Seed: ${item.seed}, Name: ${item.name})
[解読プロトコル] 
- 1桁目: 権威トーン選定（2:親しみ, 3:効率, 4:論理/師匠）
- 2-3桁目: 物語ナレッジ選択
- 6-7桁目: 語彙シャッフル

# Rules
- **「MNP」は一切出力禁止。** すべて「スマホ物販」で統一。
- バイオ末尾に「スマホ物販 爆益シミュレーター」誘導を挿入。

Output Task: CSV 1行形式で出力せよ。
"[アカウント名]","[ID]","[バイオ]","[初投稿]","[設計図用モチーフ変数]","[最終Seed]"
`;
        const result1 = await this.ai.models.generateContent({
            model: "gemini-2.0-flash-exp", // 安定版
            contents: step1Prompt
        });
        const text1 = (typeof result1.text === 'function' ? result1.text() : result1.text).trim().replace(/```csv|```/g, "");
        const parts = text1.split('","').map(s => s.replace(/"/g, ''));

        const step2Prompt = `
# Role: ビジュアル・アーキテクト
Step 1の結果 [${parts[4]}] に基づき、スマホ物販仕様の Nexus Visual Blueprint を作成せよ。
- 人格連動カラー設計: 背景色を人格に合わせて選定せよ。
- シアン・マゼンタのアクセントを融合。
- Heroic_Copyに句読点は禁止。
`;
        const result2 = await this.ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: step2Prompt
        });
        const blueprint = typeof result2.text === 'function' ? result2.text() : result2.text;

        return {
            accountName: parts[0] || item.name,
            userId: parts[1] || "user",
            bio: parts[2] || "",
            firstPost: parts[3] || "",
            visualBlueprint: blueprint,
            seed: item.seed,
            gmail: item.gmail
        };
    }

    /**
     * Geminiによる画像生成とGoogle Driveへの自動保存
     */
    async generateAndSaveImage(blueprint: string, fileName: string): Promise<string> {
        // 1. Gemini 2.0 Flash による画像生成 (Base64取得)
        const prompt = `超高品質なプロフェッショナル・ブランドビジュアル。
        コンセプト: 【未来・知性・圧倒的収益】 
        要素: ${blueprint} を中心に、デジタルフロー、粒子、ネオンシアンとマゼンタのアクセント、背景は洗練されたダークな質感を指定。
        スタイル: 写実的かつデジタルアートの融合。テキストは含めず、ビジュアルの象徴性だけで「本物」を予感させる。`;

        const imageResult = await this.ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ parts: [{ text: prompt }] }]
        });

        // 2026年仕様: インラインデータからBase64を取得
        const imagePart = imageResult.response?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (!imagePart?.inlineData?.data) {
            throw new Error("Gemini 2.0 による画像生成に失敗しました。設計図が複雑すぎるか、API制限の可能性があります。");
        }

        const base64Data = imagePart.inlineData.data;
        const mimeType = 'image/png';

        // 2. Google Drive へのアップロード (マルチパート)
        const metadata = {
            name: `${fileName}.png`,
            mimeType: mimeType,
            parents: [DRIVE_FOLDER_ID]
        };

        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const multipartBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + mimeType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n\r\n' +
            base64Data +
            close_delim;

        const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': `multipart/related; boundary=${boundary}`,
            },
            body: multipartBody
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`Drive Upload Error: ${err.error?.message || response.statusText}`);
        }

        const file = await response.json();

        // 3. 全員に閲覧権限を付与
        await this.callGoogleAPI(`https://www.googleapis.com/drive/v3/files/${file.id}/permissions`, 'POST', {
            role: 'reader',
            type: 'anyone',
        });

        // 直接URLを取得可能にする
        return `https://drive.google.com/uc?export=view&id=${file.id}`;
    }

    /**
     * 生成結果をシートbに書き戻し、シートaのトリガーをオフにする
     */
    async finalizeProcess(profile: NexusProfile, rowIndex: number) {
        // 1. シートbへ追記
        const valuesB = [[
            profile.accountName,
            profile.userId,
            profile.bio,
            profile.firstPost,
            profile.driveLink || "",
            profile.seed,
            profile.gmail,
            new Date().toISOString()
        ]];

        await this.callGoogleAPI(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_B_NAME)}!A2:append?valueInputOption=USER_ENTERED`,
            'POST',
            { values: valuesB }
        );

        // 2. シートaのチェックボックスをOFFにする
        await this.callGoogleAPI(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_A_NAME)}!D${rowIndex}?valueInputOption=USER_ENTERED`,
            'PUT',
            { values: [['FALSE']] }
        );
    }
}
