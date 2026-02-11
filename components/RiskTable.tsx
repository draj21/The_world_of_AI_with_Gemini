
import React from 'react';
import { RiskItem } from '../types';
import Badge from './ui/Badge';

interface RiskTableProps {
  risks: RiskItem[];
}

const RiskTable: React.FC<RiskTableProps> = ({ risks }) => {
  if (risks.length === 0) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Summary</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mitigation</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {risks.map((risk) => (
            <tr key={risk.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-normal text-sm font-medium text-slate-900 leading-relaxed">
                {risk.summary}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge type="category" value={risk.category} />
              </td>
              <td className="px-6 py-4 whitespace-normal text-sm text-slate-600 italic">
                {risk.mitigation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge type="priority" value={risk.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
