import React from 'react';
import { Complaint, StaffMember } from '../types';
import { ClipboardCheck, Wrench, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface AssignmentsViewProps {
  complaints: Complaint[];
  staff: StaffMember[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  complaints,
  staff,
  onSelectComplaint,
}) => {
  const unassigned = complaints.filter((c) => !c.assignedStaff && c.status !== 'RESOLVED');
  const activeAssignments = complaints.filter((c) => c.assignedStaff && c.status !== 'RESOLVED');
  const completedAssignments = complaints.filter((c) => c.status === 'RESOLVED');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
          Work Order Assignments & Dispatch
        </h1>
        <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
          Active technician work queues, unassigned intake triaging, and dispatch tracking.
        </p>
      </div>

      {/* Unassigned Work Orders Alert Banner */}
      {unassigned.length > 0 && (
        <div className="p-4 rounded-md border border-amber-500/30 bg-amber-500/10 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span>{unassigned.length} UNASSIGNED TICKETS AWAITING DISPATCH</span>
            </div>
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
              DISPATCH QUEUE SLA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {unassigned.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectComplaint(ticket)}
                className="p-3 rounded border border-amber-500/20 bg-white dark:bg-[#151D19] hover:border-[#1B4332] cursor-pointer transition-colors"
              >
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="font-bold text-[#2D6A6C] dark:text-[#4EA896]">{ticket.id}</span>
                  <span className="text-rose-600 font-bold">{ticket.priority.toUpperCase()}</span>
                </div>
                <h4 className="font-semibold text-xs text-[#1C201E] dark:text-[#F1EFEA] line-clamp-1">
                  {ticket.title}
                </h4>
                <div className="flex justify-between items-center text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-2">
                  <span>{ticket.locationDetails}</span>
                  <span className="text-[#2D6A6C] dark:text-[#4EA896] font-semibold flex items-center gap-0.5">
                    Dispatch <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technician Dispatch Columns */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[#1C201E] dark:text-[#F1EFEA]">
          TECHNICIAN WORKLOAD & QUEUES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((tech) => {
            const techComplaints = complaints.filter(
              (c) => c.assignedStaff?.id === tech.id && c.status !== 'RESOLVED'
            );

            return (
              <div
                key={tech.id}
                className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-3"
              >
                <div className="flex items-start justify-between pb-2 border-b border-[#ECE8DE] dark:border-[#1F2A24]">
                  <div>
                    <h3 className="font-bold text-sm text-[#1C201E] dark:text-[#F1EFEA]">
                      {tech.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93]">
                      {tech.trade} · {tech.phone}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[#E2DCD0] dark:border-[#24322B] text-emerald-700 dark:text-emerald-400 bg-[#FAF9F5] dark:bg-[#1A241F]">
                    {tech.status}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="flex justify-between font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] mb-2">
                    <span>ACTIVE WORK ORDERS ({techComplaints.length})</span>
                    <span>LIFETIME: {tech.totalResolvedCount}</span>
                  </div>

                  {techComplaints.length === 0 ? (
                    <div className="py-6 text-center text-[#8E9892] dark:text-[#5E6C63] text-xs">
                      No active tickets in queue. Ready for dispatch.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {techComplaints.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onSelectComplaint(item)}
                          className="p-2 rounded border border-[#ECE8DE] dark:border-[#1F2A24] bg-[#FAF9F5] dark:bg-[#1A241F] hover:border-[#2D6A6C] cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between font-mono text-[10px] mb-0.5">
                            <span className="font-bold text-[#2D6A6C] dark:text-[#4EA896]">{item.id}</span>
                            <span className="text-[#646E68] dark:text-[#8E9B93]">● {item.status}</span>
                          </div>
                          <p className="font-semibold text-xs text-[#1C201E] dark:text-[#F1EFEA] line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[#646E68] dark:text-[#8E9B93] truncate mt-0.5">
                            {item.locationDetails}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
