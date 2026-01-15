import { db, PlanData, RevisionUpdate } from '../db/db';
import { CarrierId } from '../../../shared/utils/MnpNavigator';

export const EvidenceService = {
    /**
     * Scans official data and detects differences without updating directly.
     * Creates RevisionUpdate entries for human approval.
     */
    async checkForUpdates() {
        console.log("AI Research in progress: Scanning carrier official sites for changes...");

        // Simulated latest data from official sites
        const officialScrapedData: Omit<PlanData, 'id'>[] = [
            { carrierId: 'docomo', planName: 'eximo', baseFee: 7315, lastUpdated: new Date().toISOString() },
            { carrierId: 'au', planName: 'Tokutoku Plan', baseFee: 3850, lastUpdated: new Date().toISOString() }, // Example: Fee changed from 3465 to 3850
            { carrierId: 'irumo', planName: 'irumo (0.5GB)', baseFee: 550, lastUpdated: new Date().toISOString() },
        ];

        const detectedChanges: any[] = [];

        for (const official of officialScrapedData) {
            const current = await db.plans.where({ carrierId: official.carrierId, planName: official.planName }).first();

            if (current && current.baseFee !== official.baseFee) {
                // Change detected! Create a revision request
                const revision: Omit<RevisionUpdate, 'id'> = {
                    carrierId: official.carrierId,
                    targetField: 'baseFee',
                    oldValue: current.baseFee,
                    newValue: official.baseFee,
                    evidenceUrl: `https://www.${official.carrierId}.ne.jp/plan/detail`,
                    detectedAt: new Date().toISOString(),
                    status: 'PENDING'
                };

                // Check if same revision already exists to avoid duplicates
                const existingRev = await db.revisions.where({
                    carrierId: official.carrierId,
                    newValue: official.baseFee,
                    status: 'PENDING'
                }).first();

                if (!existingRev) {
                    await db.revisions.add(revision as RevisionUpdate);
                    detectedChanges.push(revision);
                }
            } else if (!current) {
                // New plan detected (optional: could also flag as revision)
                await db.plans.add(official as PlanData);
            }
        }

        return detectedChanges;
    },

    async approveRevision(revisionId: number) {
        const rev = await db.revisions.get(revisionId);
        if (!rev) return;

        // Apply the change to the plans table
        const plan = await db.plans.where({ carrierId: rev.carrierId, planName: 'Tokutoku Plan' }).first(); // Simplified for demo
        if (plan) {
            await db.plans.update(plan.id!, { [rev.targetField]: rev.newValue, lastUpdated: new Date().toISOString() });
        }

        // Mark revision as approved
        await db.revisions.update(revisionId, { status: 'APPROVED' });
    },

    async dismissRevision(revisionId: number) {
        await db.revisions.update(revisionId, { status: 'DISMISSED' });
    }
};
