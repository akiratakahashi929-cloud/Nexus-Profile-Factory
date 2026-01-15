import { google } from 'googleapis';
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
    private sheets: any;
    private drive: any;
    private genAI: any;

    constructor(apiKey: string, googleToken: string) {
        this.genAI = new GoogleGenAI(apiKey);
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: googleToken });
        this.sheets = google.sheets({ version: 'v4', auth });
        this.drive = google.drive({ version: 'v3', auth });
    }

    /**
     * シートaから「チェックボックスがTRUE」かつ「未処理」の行を抽出する
     * 想定: A:Gmail, B:Password, C:名前, D:チェックボックス(TRUE/FALSE)
     */
    async loadTriggeredSeedsFromSheetA() {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_A_NAME}!A2:D`,
        });

        const rows = response.data.values || [];
        // D列(index 3)が "TRUE" の行のみをフィルタリング
        return rows
            .map((row: any, index: number) => ({
                gmail: row[0],
                seed: row[1],
                name: row[2],
                isTriggered: row[3] === 'TRUE',
                rowIndex: index + 2 // スプレッドシートの行番号(1-indexed, header除外)
            }))
            .filter((item: any) => item.isTriggered);
    }

    /**
     * 3段階のGeminiフローを実行
     */
    async executeGeminiFlow(item: { gmail: string, seed: string, name: string }): Promise<NexusProfile> {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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
        const result1 = await model.generateContent(step1Prompt);
        const text1 = result1.response.text().trim().replace(/```csv|```/g, "");
        const parts = text1.split('","').map(s => s.replace(/"/g, ''));

        const step2Prompt = `
# Role: ビジュアル・アーキテクト
Step 1の結果 [${parts[4]}] に基づき、スマホ物販仕様の Nexus Visual Blueprint を作成せよ。
- 人格連動カラー設計: 背景色を人格に合わせて選定せよ。
- シアン・マゼンタのアクセントを融合。
- Heroic_Copyに句読点は禁止。
`;
        const result2 = await model.generateContent(step2Prompt);
        const blueprint = result2.response.text();

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
     * 画像をGoogle Driveに保存
     */
    async saveImageToDrive(imageBuffer: any, fileName: string) {
        const fileMetadata = {
            name: fileName,
            parents: [DRIVE_FOLDER_ID],
        };
        const media = { mimeType: 'image/png', body: imageBuffer };

        const file = await this.drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        await this.drive.permissions.create({
            fileId: file.data.id,
            requestBody: { role: 'reader', type: 'anyone' },
        });

        return file.data.webViewLink;
    }

    /**
     * 生成結果をシートbに書き戻し、シートaのトリガーをオフにする（または完了マーク）
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

        await this.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_B_NAME}!A2`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: valuesB },
        });

        // 2. シートaのチェックボックスをOFFにする（処理済みトリガー）
        await this.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_A_NAME}!D${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [['FALSE']] },
        });
    }
}
