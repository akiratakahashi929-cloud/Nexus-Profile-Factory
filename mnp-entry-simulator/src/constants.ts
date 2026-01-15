export interface ScenarioCase {
    id: string;
    title: string;
    carrier: string;
    profitPerLine: number;
    description: string;
    tags: string[];
}

export const SUCCESS_SCENARIOS: ScenarioCase[] = [
    {
        id: 'pixel-9-sb',
        title: 'Pixel 9 一括特価案件',
        carrier: 'softbank',
        profitPerLine: 45000,
        description: '端末売却利益 + 公式ポイント還元の最強コンボ。都内併売店での実例。',
        tags: ['端末売却', '高額CB']
    },
    {
        id: 'iphone-16-au',
        title: 'iPhone 16 実質24円+特盛CB',
        carrier: 'au',
        profitPerLine: 35000,
        description: '2年返却プログラムを利用し、浮いた予算をキャッシュバックに回した例。',
        tags: ['返却プログラム', '即金性']
    },
    {
        id: 'irumo-sim-only',
        title: 'irumo SIMのみ契約特典',
        carrier: 'irumo',
        profitPerLine: 20000,
        description: '端末不要。手軽に回線追加してポイント還元を狙う安定ルート。',
        tags: ['SIM単体', 'ポイント還元']
    },
    {
        id: 'rakuten-saikyo',
        title: '楽天モバイル最強プラン特典',
        carrier: 'rakuten',
        profitPerLine: 13000,
        description: '紹介キャンペーン + 楽天市場ポイント倍率アップによる間接収益。',
        tags: ['紹介プログラム', 'ポイントUP']
    },
    {
        id: 'linemo-best',
        title: 'LINEMO ベストプラン還元',
        carrier: 'linemo',
        profitPerLine: 15000,
        description: 'PayPayポイント還元祭での回線追加。維持費の安さが魅力。',
        tags: ['PayPay還元', '低維持費']
    },
    {
        id: 'uq-special',
        title: 'UQ mobile 店頭限定CB',
        carrier: 'uq',
        profitPerLine: 25000,
        description: '家電量販店での週末限定キャッシュバック。即日現金化が可能。',
        tags: ['週末限定', '現金CB']
    }
];

export const CARRIER_BASELINES = {
    docomo: { name: 'docomo', safeDays: 365, baseAdminFee: 3850 },
    au: { name: 'au', safeDays: 211, baseAdminFee: 3850 },
    softbank: { name: 'SoftBank', safeDays: 181, baseAdminFee: 3850 },
    rakuten: { name: 'Rakuten', safeDays: 365, baseAdminFee: 0 }
};
