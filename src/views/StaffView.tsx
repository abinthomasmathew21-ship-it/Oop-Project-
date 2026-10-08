import React from 'react';
import { StaffMember } from '../types';
import { Users, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

interface StaffViewProps {
  staff: StaffMember[];
  onToggleStatus?: (staffId: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ staff, onToggleStatus }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
          Campus Maintenance Staff Directory
        </h1>
        <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
          Licensed technicians, master plumbers, electrical engineers, and safety inspectors on active campus shift.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#2D6A6C] dark:text-[#4EA896]">
                    {member.id}
                  </span>
                  <h3 className="text-base font-bold text-[#1C201E] dark:text-[#F1EFEA] mt-0.5">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#646E68] dark:text-[#8E9B93]">
                    {member.role}
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#E2DCD0] dark:border-[#24322B] text-emerald-700 dark:text-emerald-400 bg-[#FAF9F5] dark:bg-[#1A241F]">
                  {member.status}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-[#646E68] dark:text-[#8E9B93]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896]" />
                  <span className="font-mono text-[11px] text-[#1C201E] dark:text-[#F1EFEA]">
                    {member.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896]" />
                  <span className="text-[11px] text-[#1C201E] dark:text-[#F1EFEA]">
                    {member.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ECE8DE] dark:border-[#1F2A24] flex items-center justify-between text-xs">
              <div className="font-mono text-[11px]">
                <span className="text-[#646E68] dark:text-[#8E9B93]">ACTIVE: </span>
                <strong className="text-[#2D6A6C] dark:text-[#4EA896]">
                  {member.currentAssignedCount} tickets
                </strong>
              </div>
              <div className="font-mono text-[11px]">
                <span className="text-[#646E68] dark:text-[#8E9B93]">RESOLVED: </span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {member.totalResolvedCount}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
