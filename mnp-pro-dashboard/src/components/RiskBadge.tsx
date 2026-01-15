import React from 'react';
import { CostCalculator } from '../../../shared/utils/CostCalculator';
import { CARRIER_RULES } from '../../../shared/utils/CarrierRules';
import { CarrierId } from '../../../shared/utils/MnpNavigator';

interface RiskBadgeProps {
    contractDate: string;
    carrierId: CarrierId;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ contractDate, carrierId }) => {
    const rule = CARRIER_RULES[carrierId];
    const { level, daysRemaining, progressPercent } = CostCalculator.calculateRisk(
        contractDate,
        rule.safeDurationDays,
        rule.blRiskDays
    );

    const colors = {
        safe: { bg: '#00ff88', text: '#002D56', label: 'SAFE' },
        warning: { bg: '#ffcc00', text: '#002D56', label: 'CAUTION' },
        danger: { bg: '#ff4d4d', text: '#fff', label: 'DANGER' }
    };

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                backgroundColor: colors[level].bg,
                color: colors[level].text,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.6rem',
                fontWeight: 900,
                textTransform: 'uppercase'
            }}>
                {colors[level].label}
            </div>
            {level !== 'safe' && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>
                    あと {daysRemaining} 日
                </span>
            )}
            <div style={{
                width: '40px',
                height: '4px',
                background: 'rgba(0,45,86,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: colors[level].bg,
                    transition: 'width 0.5s ease-out'
                }} />
            </div>
        </div>
    );
};

export default RiskBadge;
