
import React from 'react';
import { RiskCategory, RiskPriority } from '../../types';

interface BadgeProps {
  type: 'category' | 'priority';
  value: string;
}

const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  const getStyles = () => {
    if (type === 'priority') {
      switch (value) {
        case RiskPriority.HIGH: return 'bg-red-100 text-red-700 border-red-200';
        case RiskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case RiskPriority.LOW: return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    } else {
      switch (value) {
        case RiskCategory.TECHNICAL: return 'bg-blue-100 text-blue-700 border-blue-200';
        case RiskCategory.RESOURCE: return 'bg-purple-100 text-purple-700 border-purple-200';
        case RiskCategory.TIMELINE: return 'bg-orange-100 text-orange-700 border-orange-200';
        case RiskCategory.BUDGET: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {value}
    </span>
  );
};

export default Badge;
