import { ContractLine } from '../mnp-pro-dashboard/src/db/db';

export const DataExporter = {
    /**
     * Export contract data to CSV
     */
    exportToCSV(data: any[], filename: string = 'mnp_assets_export.csv') {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(','));

        // Add rows
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                const escaped = ('' + value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.click();
    },

    /**
     * Convert for TSV (Tab Separated Values) - often preferred by MNP pros for Excel pasting
     */
    exportToTSV(data: any[], filename: string = 'mnp_assets_export.tsv') {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const tsvRows = [];

        tsvRows.push(headers.join('\t'));

        for (const row of data) {
            const values = headers.map(header => row[header]);
            tsvRows.push(values.join('\t'));
        }

        const tsvString = tsvRows.join('\n');
        const blob = new Blob([tsvString], { type: 'text/tab-separated-values;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.click();
    }
};
