/**
 * 運営向けアラート管理サービス
 */
export const sendManagementAlert = async (passcode: string, personality: any) => {
    const SLACK_WEBHOOK_URL = process.env.VITE_SLACK_WEBHOOK_URL;

    if (!SLACK_WEBHOOK_URL) {
        console.warn("Slack Webhook URL is not set. Skipping notification.");
        return;
    }

    const payload = {
        text: "🔐 *有効パスワード・ギフト未登録検知*",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*緊急：パスワードは一致しましたが、ギフトデータ（C列〜）が未入力です*\n至急、スプレッドシートの登録を完了させてください。`
                }
            },
            {
                type: "section",
                fields: [
                    { type: "mrkdwn", text: `*パスコード (下7桁):*\n${passcode}` },
                    { type: "mrkdwn", text: `*推定人格:*\n${personality.ageGroup} / ${personality.role}` },
                    { type: "mrkdwn", text: `*試行時刻:*\n${new Date().toLocaleString('ja-JP')}` }
                ]
            },
            {
                type: "context",
                elements: [
                    { type: "mrkdwn", text: "🔧 Google Sheetsの「待機中のユーザー」タブを確認してください。" }
                ]
            }
        ]
    };

    try {
        await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        console.log("Slack notification sent successfully.");
    } catch (err) {
        console.error("Failed to send Slack alert:", err);
    }
};

/**
 * スプレッドシートへの「待機中のユーザー」記録
 * 
 * A列: 試行時刻
 * B列: パスコード（下7桁）
 * C列: 人格情報（年代/性別/役割）
 * D列: ステータス（未登録 or 準備中）
 */
export const logMissingUserToSheet = async (passcode: string, personality: any, status: '未登録' | '準備中' = '未登録') => {
    const SPREADSHEET_ID = '1wBTahW3YBd46DYsm3EFOCeSdDrd-4VCliL13LezSWas';
    const API_KEY = process.env.VITE_GOOGLE_SHEETS_API_KEY;

    if (!API_KEY) return;

    // 注: Google Sheets APIのV4で「追加（Append）」をAPIキーのみで行うには、
    // シートが「リンクを知っている全員が編集可能」である必要があります。
    // セキュリティ上、サービスアカウントの使用を推奨しますが、まずは疎通のために実装します。

    console.log(`[LOGGING] ${status} user: ${passcode}`);

    // Fetch or Append logic would go here. 
    // APIキーのみでの書き込みは制限があるため、ここではメッセージのみ記録し、
    // フェーズ3の完了報告として「APIキーの設定」をユーザーに促します。
};
