import React from 'react';
import { Complaint, CampusBlockInfo } from '../types';
import { CAMPUS_BLOCKS } from '../data/mockData';
import { BarChart3, TrendingUp, ShieldCheck, Printer, Download, Clock } from 'lucide-react';

interface ReportsViewProps {
  complaints: Complaint[];
  blocks: CampusBlockInfo[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ complaints, blocks }) => {
  // Aggregate category counts
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Calculate block distribution
  const blockStats = blocks.map((b) => {
    const total = complaints.filter((c) => c.blockId === b.id).length;
    const resolved = complaints.filter((c) => c.blockId === b.id && c.status === 'RESOLVED').length;
    return {
      block: b,
      total,
      resolved,
      active: total - resolved,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
            Campus Infrastructure Operations Report
          </h1>
          <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
            Physical plant reliability index, preventive maintenance compliance, and MTTR analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#1C201E] dark:text-[#F1EFEA] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896]" />
            Print Docket Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            CAMPUS RELIABILITY INDEX
          </span>
          <div className="text-2xl font-bold font-tabular text-[#1B4332] dark:text-[#347A57] mt-1">
            96.4 / 100
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            All primary life-safety systems operational
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            MEAN TIME TO RESOLVE (MTTR)
          </span>
          <div className="text-2xl font-bold font-tabular text-[#2D6A6C] dark:text-[#4EA896] mt-1">
            3.4 Hours
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Across urgent, high and medium tickets
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            SLA ADHERENCE RATIO
          </span>
          <div className="text-2xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA] mt-1">
            97.8%
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Standard 4-hour critical response window
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            PREVENTIVE AUDIT RATIO
          </span>
          <div className="text-2xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA] mt-1">
            88.2%
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Quarterly HVAC & electrical cycle
          </p>
        </div>
      </div>

      {/* Block Distribution Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[#1C201E] dark:text-[#F1EFEA]">
          INFRASTRUCTURE HEAT & LOAD BY CAMPUS BLOCK
        </h2>

        <div className="rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#18231E] font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
                <th className="py-2.5 px-4">Block Code</th>
                <th className="py-2.5 px-4">Facility Name</th>
                <th className="py-2.5 px-4">Building Dimensions</th>
                <th className="py-2.5 px-4">Active Tickets</th>
                <th className="py-2.5 px-4">Resolved</th>
                <th className="py-2.5 px-4">Status Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8DE] dark:divide-[#1F2A24]">
              {blockStats.map((item) => (
                <tr key={item.block.id} className="hover:bg-[#FAF9F5] dark:hover:bg-[#18231E]">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#2D6A6C] dark:text-[#4EA896]">
                    {item.block.code}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-[#1C201E] dark:text-[#F1EFEA]">
                    {item.block.name}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#646E68] dark:text-[#8E9B93]">
                    {item.block.dimensions}
                  </td>
                  <td className={`py-2.5 px-4 font-mono font-bold ${
                    item.active > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {item.active} Active
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#646E68] dark:text-[#8E9B93]">
                    {item.resolved} Closed
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px]">
                    {item.active === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">● 100% NOMINAL</span>
                    ) : item.active >= 2 ? (
                      <span className="text-rose-600 dark:text-rose-400">● ELEVATED LOAD</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">● ROUTINE SERVICING</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
