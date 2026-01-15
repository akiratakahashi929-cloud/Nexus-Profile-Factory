import { GoogleGenAI } from "@google/genai";
// Google Sheets API in a Vite/React context usually requires a backend or specific library
// For this standalone app, we'll use a direct fetch approach with the API Key if possible, 
// or define the structure for a Service Account.

const SPREADSHEET_ID = '1wBTahW3YBd46DYsm3EFOCeSdDrd-4VCliL13LezSWas';
const RANGE = 'キャリクラSYNC!A:G';

export const fetchUserDataFromSheet = async (passcode7: string) => {
    const API_KEY = process.env.VITE_GOOGLE_SHEETS_API_KEY;
    if (!API_KEY) {
        console.warn("Google Sheets API Key is missing.");
        return null;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values) return null;

        // Find user by passcode in Column B (index 1)
        // Passcode in Sheet is "英語5桁+数字7桁"
        const rows = data.values;
        const userRow = rows.find((row: string[]) => {
            const fullPass = row[1] || "";
            return fullPass.endsWith(passcode7);
        });

        if (!userRow) return null;

        // Map columns to Persona structure
        // A: Email, B: PW, C: Name, D: ID, E: Bio, F: FirstPost, G: Icon/Banner
        return {
            email: userRow[0],
            fullPasscode: userRow[1],
            accountName: userRow[2] || null, // Metadata starts from C
            xId: userRow[3] || null,
            bio: userRow[4] || null,
            firstPost: userRow[5] || null,
            iconUrl: userRow[6] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop",
            bannerUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1200&h=400&fit=crop"
        };
    } catch (err) {
        console.error("Sheet Fetch Error:", err);
        return null;
    }
};
