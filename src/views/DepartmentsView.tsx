import React from 'react';
import { DepartmentInfo } from '../types';
import { INITIAL_DEPARTMENTS } from '../data/mockData';
import { Network, CheckCircle2, Clock, Users, ArrowUpRight } from 'lucide-react';

interface DepartmentsViewProps {
  departments?: DepartmentInfo[];
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments = INITIAL_DEPARTMENTS,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
          Campus Infrastructure Departments
        </h1>
        <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
          Divisions responsible for campus physical plants, civil maintenance, mechanical systems, and safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-5 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#2D6A6C] dark:text-[#4EA896]">
                  {dept.code}
                </span>
                <span className="text-[#646E68] dark:text-[#8E9B93]">
                  {dept.staffCount} STAFF
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1C201E] dark:text-[#F1EFEA]">
                {dept.name}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs text-[#646E68] dark:text-[#8E9B93]">
                <div className="flex justify-between">
                  <span>Head of Department:</span>
                  <span className="font-medium text-[#1C201E] dark:text-[#F1EFEA]">
                    {dept.headOfDepartment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>HQ Office:</span>
                  <span className="text-[#1C201E] dark:text-[#F1EFEA]">
                    {dept.officeLocation}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ECE8DE] dark:border-[#1F2A24] grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#FAF9F5] dark:bg-[#1A241F]">
                <div className="text-[10px] font-mono text-[#646E68] dark:text-[#8E9B93]">OPEN</div>
                <div className="font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
                  {dept.openIssuesCount}
                </div>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] dark:bg-[#1A241F]">
                <div className="text-[10px] font-mono text-[#646E68] dark:text-[#8E9B93]">SLA</div>
                <div className="font-bold font-tabular text-emerald-600 dark:text-emerald-400">
                  {dept.slaCompliancePercent}%
                </div>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] dark:bg-[#1A241F]">
                <div className="text-[10px] font-mono text-[#646E68] dark:text-[#8E9B93]">MTTR</div>
                <div className="font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
                  {dept.avgResolutionHours}h
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
