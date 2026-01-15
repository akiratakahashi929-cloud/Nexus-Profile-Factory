export type CarrierId =
    | 'docomo' | 'ahamo' | 'irumo' | 'eximo'
    | 'au' | 'povo' | 'uq'
    | 'softbank' | 'linemo' | 'ymobile'
    | 'rakuten'
    | 'mineo' | 'iijmio' | 'nifmo' | 'biglobe' | 'aeon' | 'jcom' | 'nuro';

export const MnpNavigator = {
    CARRIER_GROUPS: {
        docomo: ['docomo', 'ahamo', 'irumo', 'eximo'],
        au: ['au', 'povo', 'uq'],
        softbank: ['softbank', 'linemo', 'ymobile'],
        rakuten: ['rakuten'],
        mvno: ['mineo', 'iijmio', 'nifmo', 'biglobe', 'aeon', 'jcom', 'nuro']
    },

    checkGroupContamination(fromCarrier: CarrierId, toCarrier: CarrierId) {
        const fromGroup = Object.entries(this.CARRIER_GROUPS).find(([_, list]) => list.includes(fromCarrier))?.[0];
        const toGroup = Object.entries(this.CARRIER_GROUPS).find(([_, list]) => list.includes(toCarrier))?.[0];

        if (fromGroup === toGroup && fromGroup !== undefined && fromGroup !== 'mvno') {
            return {
                isContaminated: true,
                warning: `同一グループ内 (${fromGroup.toUpperCase()}) の移行は、短期解約リスクや特典対象外となる可能性があります。`
            };
        }

        return { isContaminated: false, warning: null };
    }
};
