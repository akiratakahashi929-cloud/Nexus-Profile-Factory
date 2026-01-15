import { CarrierId } from './MnpNavigator';

export interface CarrierRule {
    carrierId: CarrierId;
    displayName: string;
    safeDurationDays: number;
    blRiskDays: number;
    color: string;
}

export const CARRIER_RULES: Record<CarrierId, CarrierRule> = {
    docomo: { carrierId: 'docomo', displayName: 'docomo', safeDurationDays: 365, blRiskDays: 365, color: '#c6002b' },
    ahamo: { carrierId: 'ahamo', displayName: 'ahamo', safeDurationDays: 365, blRiskDays: 365, color: '#00a5bf' },
    irumo: { carrierId: 'irumo', displayName: 'irumo', safeDurationDays: 365, blRiskDays: 365, color: '#f5a623' },
    eximo: { carrierId: 'eximo', displayName: 'eximo', safeDurationDays: 365, blRiskDays: 365, color: '#8b5cf6' },
    au: { carrierId: 'au', displayName: 'au', safeDurationDays: 211, blRiskDays: 180, color: '#ff5722' },
    povo: { carrierId: 'povo', displayName: 'povo', safeDurationDays: 211, blRiskDays: 180, color: '#ffe135' },
    uq: { carrierId: 'uq', displayName: 'UQ mobile', safeDurationDays: 211, blRiskDays: 180, color: '#e91e8c' },
    softbank: { carrierId: 'softbank', displayName: 'SoftBank', safeDurationDays: 181, blRiskDays: 180, color: '#c0c0c0' },
    linemo: { carrierId: 'linemo', displayName: 'LINEMO', safeDurationDays: 181, blRiskDays: 180, color: '#06c755' },
    ymobile: { carrierId: 'ymobile', displayName: 'Y!mobile', safeDurationDays: 181, blRiskDays: 180, color: '#ff0033' },
    rakuten: { carrierId: 'rakuten', displayName: 'Rakuten', safeDurationDays: 365, blRiskDays: 365, color: '#bf0000' },
    mineo: { carrierId: 'mineo', displayName: 'mineo', safeDurationDays: 181, blRiskDays: 180, color: '#8aba00' },
    iijmio: { carrierId: 'iijmio', displayName: 'IIJmio', safeDurationDays: 181, blRiskDays: 180, color: '#7a3e9d' },
    nifmo: { carrierId: 'nifmo', displayName: 'NifMo', safeDurationDays: 181, blRiskDays: 180, color: '#006699' },
    biglobe: { carrierId: 'biglobe', displayName: 'BIGLOBE', safeDurationDays: 181, blRiskDays: 180, color: '#0055aa' },
    aeon: { carrierId: 'aeon', displayName: 'AEON Mobile', safeDurationDays: 181, blRiskDays: 180, color: '#f10b54' },
    jcom: { carrierId: 'jcom', displayName: 'J:COM Mobile', safeDurationDays: 181, blRiskDays: 180, color: '#00a1e3' },
    nuro: { carrierId: 'nuro', displayName: 'NURO Mobile', safeDurationDays: 181, blRiskDays: 180, color: '#2b2b2b' }
};
