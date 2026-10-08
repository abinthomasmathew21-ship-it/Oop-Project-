import React from 'react';
import { CampusBlockInfo, Complaint, StaffMember, BlockId } from '../types';
import { CampusStatusMap } from '../components/CampusStatusMap';
import { ComplaintCard } from '../components/ComplaintCard';
import { 
  Building2, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  Plus,
  Radio
} from 'lucide-react';

interface DashboardViewProps {
  blocks: CampusBlockInfo[];
  complaints: Complaint[];
  staff: StaffMember[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNewComplaint: (blockId?: BlockId) => void;
  onNavigateToComplaints: () => void;
  selectedBlockId: BlockId | null;
  onSelectBlock: (blockId: BlockId | null) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  blocks,
  complaints,
  staff,
  onSelectComplaint,
  onNewComplaint,
  onNavigateToComplaints,
  selectedBlockId,
  onSelectBlock,
}) => {
  // Determine time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  // Calculate compact statistics
  const totalIssues = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'VERIFIED'
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'ASSIGNED' || c.status === 'IN PROGRESS'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  const urgentCount = complaints.filter(
    (c) => (c.priority === 'Urgent' || c.priority === 'High') && c.status !== 'RESOLVED'
  ).length;

  // Recent unresolved or updated complaints
  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Operations Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <div>
          <span className="font-mono text-xs font-bold tracking-wider text-[#2D6A6C] dark:text-[#4EA896] uppercase">
            {greeting}, CATHERINE VANCE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA] mt-0.5">
            Campus Operations Overview
          </h1>
          <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-1 font-sans">
            Real-time physical plant telemetry, campus block status, and trade technician dispatch.
          </p>
        </div>

        {/* Quick Action Button & Shift Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#151D19] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#646E68] dark:text-[#8E9B93]">DISPATCH DESK ACTIVE</span>
          </div>

          <button
            onClick={() => onNewComplaint()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-semibold bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] text-white transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Log Campus Issue
          </button>
        </div>
      </div>

      {/* Compact Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* TOTAL ISSUES */}
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#646E68] dark:text-[#8E9B93]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
              TOTAL ISSUES
            </span>
            <Building2 className="w-4 h-4 text-[#2D6A6C] dark:text-[#4EA896]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
              {totalIssues}
            </span>
            <span className="text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93]">
              ● Recorded Semester
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#ECE8DE] dark:border-[#1F2A24] text-[11px] text-[#646E68] dark:text-[#8E9B93]">
            7 campus infrastructure blocks
          </div>
        </div>

        {/* PENDING */}
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#646E68] dark:text-[#8E9B93]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
              PENDING
            </span>
            <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
              {pendingCount}
            </span>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
              ● Awaiting verification
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#ECE8DE] dark:border-[#1F2A24] text-[11px] text-[#646E68] dark:text-[#8E9B93]">
            {urgentCount > 0 ? `${urgentCount} urgent/high safety flags` : 'Queue within standard SLA'}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#646E68] dark:text-[#8E9B93]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
              IN PROGRESS
            </span>
            <Wrench className="w-4 h-4 text-[#2D6A6C] dark:text-[#4EA896]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
              {inProgressCount}
            </span>
            <span className="text-[11px] font-mono text-[#2D6A6C] dark:text-[#4EA896]">
              ● Crews dispatched
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#ECE8DE] dark:border-[#1F2A24] text-[11px] text-[#646E68] dark:text-[#8E9B93]">
            6 technicians actively assigned
          </div>
        </div>

        {/* RESOLVED */}
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#646E68] dark:text-[#8E9B93]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
              RESOLVED
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
              {resolvedCount}
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              ● Sign-off complete
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#ECE8DE] dark:border-[#1F2A24] text-[11px] text-[#646E68] dark:text-[#8E9B93]">
            94.8% SLA adherence rate
          </div>
        </div>
      </div>

      {/* MAIN UNIQUE COMPONENT: CAMPUS STATUS MAP */}
      <section aria-label="Campus Status Map">
        <CampusStatusMap
          blocks={blocks}
          complaints={complaints}
          onSelectComplaint={onSelectComplaint}
          onNewComplaintForBlock={(bId) => onNewComplaint(bId)}
          selectedBlockId={selectedBlockId}
          onSelectBlock={onSelectBlock}
        />
      </section>

      {/* Lower Section: Recent Issue Stream & On-Duty Technicians */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Complaints List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DCD0] dark:border-[#24322B]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#1C201E] dark:text-[#F1EFEA]">
                ACTIVE COMPLAINT QUEUE
              </h2>
              <span className="text-xs text-[#646E68] dark:text-[#8E9B93]">
                · Live Work Order Stream
              </span>
            </div>

            <button
              onClick={onNavigateToComplaints}
              className="text-xs font-semibold text-[#2D6A6C] dark:text-[#4EA896] hover:underline flex items-center gap-1"
            >
              View Full Register <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => onSelectComplaint(complaint)}
              />
            ))}
          </div>
        </div>

        {/* Right: Field Technicians On-Duty Roster */}
        <div className="lg:col-span-4 p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E2DCD0] dark:border-[#24322B] mb-3">
              <span className="font-mono text-xs font-bold uppercase text-[#1C201E] dark:text-[#F1EFEA]">
                FIELD TECHNICIAN ROSTER
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                ● 6 ON DUTY
              </span>
            </div>

            <div className="space-y-2.5">
              {staff.map((tech) => (
                <div
                  key={tech.id}
                  className="p-2 rounded border border-[#ECE8DE] dark:border-[#1F2A24] bg-[#FAF9F5] dark:bg-[#1A241F] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-[#1C201E] dark:text-[#F1EFEA] truncate">
                      {tech.name}
                    </div>
                    <div className="text-[11px] text-[#646E68] dark:text-[#8E9B93] truncate">
                      {tech.trade} · {tech.phone}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] font-semibold text-[#2D6A6C] dark:text-[#4EA896]">
                      {tech.currentAssignedCount} active
                    </span>
                    <div className="text-[10px] text-[#8E9892] dark:text-[#5E6C63] font-mono">
                      {tech.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#ECE8DE] dark:border-[#1F2A24] text-[11px] text-[#646E68] dark:text-[#8E9B93] font-mono flex items-center justify-between">
            <span>24/7 FACILITIES EXT: #4400</span>
            <span className="text-emerald-600 dark:text-emerald-400">PAGING NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
