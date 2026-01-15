export const CostCalculator = {
    /**
     * Calculate risk assessment based on contract date and carrier rules
     */
    calculateRisk(contractDate: string, safeDurationDays: number, blRiskDays: number) {
        const start = new Date(contractDate);
        const today = new Date();
        const diffTime = today.getTime() - start.getTime();
        const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const daysRemaining = Math.max(0, safeDurationDays - daysElapsed);
        const progressPercent = Math.min(100, Math.round((daysElapsed / safeDurationDays) * 100));

        let level: 'safe' | 'warning' | 'danger';
        if (daysElapsed >= safeDurationDays) {
            level = "safe";
        } else if (daysElapsed >= safeDurationDays - blRiskDays) {
            level = "warning";
        } else {
            level = "danger";
        }

        return { level, daysRemaining, daysElapsed, progressPercent };
    },

    /**
     * Project profit over a maintenance period
     */
    calculateProjectedProfit(params: {
        adminFee: number;
        deviceCost: number;
        initialPlanCost: number;
        runningCost: number;
        months: number;
        cashback: number;
        terminalSalePrice?: number;
        fiberCommission?: number;
    }) {
        const totalInitial = params.adminFee + params.deviceCost;
        const totalRunning = params.initialPlanCost + (params.runningCost * (params.months - 1));
        const totalCost = totalInitial + totalRunning;

        const totalRevenue = params.cashback + (params.terminalSalePrice || 0) + (params.fiberCommission || 0);
        const netProfit = totalRevenue - totalCost;

        return {
            totalCost,
            totalRevenue,
            netProfit,
            roi: totalCost > 0 ? (netProfit / totalCost) * 100 : 0,
            breakdown: {
                initial: totalInitial,
                running: totalRunning,
                revenue: totalRevenue
            }
        };
    },

    /**
     * Advanced Asset Stacking: Consolidates mobile, fiber, and others
     */
    calculateStackedProfit(mobileLines: any[], fiberContracts: any[]) {
        const totalMobileProfit = mobileLines.reduce((acc, line) => acc + line.netProfit, 0);
        const totalFiberProfit = fiberContracts.reduce((acc, fc) => acc + fc.commission, 0);

        return {
            totalMobileProfit,
            totalFiberProfit,
            grandTotal: totalMobileProfit + totalFiberProfit
        };
    }
};
