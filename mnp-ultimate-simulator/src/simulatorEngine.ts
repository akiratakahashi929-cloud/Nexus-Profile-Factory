export interface CarrierTemplate {
    name: string;
    adminFee: number;
    monthlyCost: number;
    penaltyFee: number;
    minMaintenanceMonths: number;
}

export const CARRIER_TEMPLATES: Record<string, CarrierTemplate> = {
    rakuten: { name: '楽天モバイル', adminFee: 0, monthlyCost: 1078, penaltyFee: 0, minMaintenanceMonths: 1 },
    docomo: { name: 'docomo (eximo)', adminFee: 3850, monthlyCost: 7315, penaltyFee: 0, minMaintenanceMonths: 6 },
    au: { name: 'au (povo)', adminFee: 3850, monthlyCost: 0, penaltyFee: 0, minMaintenanceMonths: 6 },
    uqwimax: { name: 'UQモバイル', adminFee: 3850, monthlyCost: 2365, penaltyFee: 0, minMaintenanceMonths: 7 },
    ocn: { name: 'OCN モバイル ONE', adminFee: 3300, monthlyCost: 770, penaltyFee: 0, minMaintenanceMonths: 7 },
};

export interface MnpScenario {
    id: string;
    carrierKey: string;
    lineCount: number;
    deviceSellPrice: number;
    cashbackAmount: number;
    otherCosts: number;
}

export interface CalculationResult {
    totalRevenue: number;
    totalCost: number;
    netProfit: number;
    profitPerLine: number;
    costBreakdown: {
        adminFees: number;
        maintenanceCosts: number;
        penalties: number;
        others: number;
    };
}

export const calculateProfit = (scenario: MnpScenario): CalculationResult => {
    const template = CARRIER_TEMPLATES[scenario.carrierKey] || CARRIER_TEMPLATES.rakuten;

    const adminFees = template.adminFee * scenario.lineCount;
    const maintenanceCosts = template.monthlyCost * template.minMaintenanceMonths * scenario.lineCount;
    const penalties = template.penaltyFee * scenario.lineCount;

    const totalRevenue = (scenario.deviceSellPrice + scenario.cashbackAmount) * scenario.lineCount;
    const totalCost = adminFees + maintenanceCosts + penalties + scenario.otherCosts;
    const netProfit = totalRevenue - totalCost;

    return {
        totalRevenue,
        totalCost,
        netProfit,
        profitPerLine: scenario.lineCount > 0 ? netProfit / scenario.lineCount : 0,
        costBreakdown: {
            adminFees,
            maintenanceCosts,
            penalties,
            others: scenario.otherCosts
        }
    };
};
