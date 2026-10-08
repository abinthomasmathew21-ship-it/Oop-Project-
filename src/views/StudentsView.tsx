import React from 'react';
import { Complaint } from '../types';
import { GraduationCap, Home, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface StudentsViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNewComplaint: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  complaints,
  onSelectComplaint,
  onNewComplaint,
}) => {
  const studentComplaints = complaints.filter(
    (c) => c.submittedBy.role === 'Student' || c.blockId === 'hostel'
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
            Student Housing & Residential Services
          </h1>
          <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
            Student-reported hostel dorm issues, study lounge maintenance, and student council liaison.
          </p>
        </div>

        <button
          onClick={onNewComplaint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] text-white transition-colors"
        >
          Submit Student Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            HOSTEL TOWER CAPACITY
          </span>
          <div className="text-2xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA] mt-1">
            450 Residents
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Tower A (North) & Tower B (South)
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            ACTIVE STUDENT DOCKETS
          </span>
          <div className="text-2xl font-bold font-tabular text-[#2D6A6C] dark:text-[#4EA896] mt-1">
            {studentComplaints.filter((c) => c.status !== 'RESOLVED').length} Tickets
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Standard residential turnaround: &lt; 24h
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            STUDENT SATISFACTION SCORE
          </span>
          <div className="text-2xl font-bold font-tabular text-emerald-600 dark:text-emerald-400 mt-1">
            4.85 / 5.0
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Based on post-repair student sign-offs
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[#1C201E] dark:text-[#F1EFEA]">
          STUDENT & HOSTEL ISSUE TICKETS
        </h2>

        <div className="rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] overflow-hidden">
          <div className="divide-y divide-[#ECE8DE] dark:divide-[#1F2A24]">
            {studentComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="p-3.5 hover:bg-[#FAF9F5] dark:hover:bg-[#18231E] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] mb-1">
                    <span className="font-bold text-[#2D6A6C] dark:text-[#4EA896]">{item.id}</span>
                    <span>·</span>
                    <span className="text-[#646E68] dark:text-[#8E9B93]">{item.locationDetails}</span>
                    <span>·</span>
                    <span className="font-bold">● {item.status}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#1C201E] dark:text-[#F1EFEA]">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
                    Reported by: {item.submittedBy.name} ({item.submittedBy.department})
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[11px] text-[#2D6A6C] dark:text-[#4EA896] font-semibold flex items-center gap-1 sm:justify-end">
                    View Docket <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
