import Dexie, { Table } from 'dexie';
import { CarrierId } from '../../../shared/utils/MnpNavigator';

export type CBStatus = 'PENDING' | 'CLEARED' | 'MISSED';
export type InventoryStatus = 'IN_STORAGE' | 'USING' | 'SHIPPED' | 'SOLD';

export interface ContractLine {
    id?: number;
    phoneNumber: string;
    carrier: CarrierId;
    planName: string;
    contractDate: string;
    activationDate?: string;
    adminFee: number;
    deviceCost: number;
    initialPlanCost: number;
    runningCost: number;
    cashbackAmount: number;
    depositAmount: number;
    cbStatus: CBStatus;
    isArchived: boolean;
    linkedInventoryId?: string;
}

export interface InventoryItem {
    id?: number;
    deviceName: string;
    deviceModel: string;
    purchasePrice: number;
    currentValue: number;
    expectedSalePrice: number;
    soldPrice?: number;
    status: InventoryStatus;
    linkedContractId?: string;
    purchaseDate: string;
}

export interface FiberContract {
    id?: number;
    providerName: string;
    contractDate: string;
    commission: number;
    status: 'PENDING' | 'CLEARED';
}

export interface PlanData {
    id?: number;
    carrierId: CarrierId;
    planName: string;
    baseFee: number;
    lastUpdated: string;
}

export interface RevisionUpdate {
    id?: number;
    carrierId: CarrierId;
    targetField: string;
    oldValue: any;
    newValue: any;
    evidenceUrl: string;
    detectedAt: string;
    status: 'PENDING' | 'APPROVED' | 'DISMISSED';
}

export class MnpDatabase extends Dexie {
    lines!: Table<ContractLine>;
    inventory!: Table<InventoryItem>;
    fiberContracts!: Table<FiberContract>;
    plans!: Table<PlanData>;
    revisions!: Table<RevisionUpdate>;

    constructor() {
        super('MnpBakuekiDB');
        this.version(4).stores({
            lines: '++id, phoneNumber, carrier, contractDate, cbStatus, isArchived',
            inventory: '++id, deviceName, status, linkedContractId',
            fiberContracts: '++id, providerName, contractDate, status',
            plans: '++id, carrierId, planName, lastUpdated',
            revisions: '++id, carrierId, status, detectedAt'
        });
    }
}

export const db = new MnpDatabase();
