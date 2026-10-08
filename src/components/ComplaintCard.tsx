import React from 'react';
import { Complaint, IssueStatus, IssuePriority } from '../types';
import { MapPin, User, Calendar, Wrench, ChevronRight } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  // Priority color definition
  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'Urgent':
        return 'text-rose-600 dark:text-rose-400 font-bold';
      case 'High':
        return 'text-orange-600 dark:text-orange-400 font-semibold';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'Low':
        return 'text-emerald-600 dark:text-emerald-400';
    }
  };

  // Status dot and text color
  const getStatusDot = (status: IssueStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'text-blue-500';
      case 'VERIFIED':
        return 'text-indigo-500';
      case 'ASSIGNED':
        return 'text-amber-500';
      case 'IN PROGRESS':
        return 'text-orange-500';
      case 'RESOLVED':
        return 'text-emerald-600 dark:text-emerald-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] hover:border-[#2D6A6C] dark:hover:border-[#4EA896] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Header Row: ID, Category & Small Status Marker */}
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2D6A6C] dark:text-[#4EA896]">
              {complaint.id}
            </span>
            <span className="text-[#8E9892] dark:text-[#5E6C63]" aria-hidden="true">·</span>
            <span className="text-[#646E68] dark:text-[#8E9B93]">
              {complaint.category}
            </span>
          </div>

          {/* Small Status Marker (e.g. ● IN PROGRESS) with Zero-Pill Discipline */}
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`text-[10px] ${getStatusDot(complaint.status)}`}>●</span>
            <span className="text-[#1C201E] dark:text-[#F1EFEA] tracking-wider text-[11px]">
              {complaint.status}
            </span>
          </div>
        </div>

        {/* Complaint Title */}
        <h3 className="text-sm font-semibold text-[#1C201E] dark:text-[#F1EFEA] group-hover:text-[#2D6A6C] dark:group-hover:text-[#4EA896] transition-colors line-clamp-2 leading-snug">
          {complaint.title}
        </h3>

        {/* Location & Floor */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#646E68] dark:text-[#8E9B93]">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2D6A6C] dark:text-[#4EA896]" />
          <span className="truncate">{complaint.locationDetails}</span>
        </div>
      </div>

      {/* Footer Row: Priority, Submitted Date, Assigned Staff */}
      <div className="mt-4 pt-3 border-t border-[#ECE8DE] dark:border-[#1F2A24] flex items-center justify-between text-xs text-[#646E68] dark:text-[#8E9B93]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px]">
            PRIORITY: <span className={getPriorityColor(complaint.priority)}>{complaint.priority.toUpperCase()}</span>
          </span>
          <span className="text-[#8E9892] dark:text-[#5E6C63]" aria-hidden="true">·</span>
          <span className="font-mono text-[11px]">
            {complaint.submittedDate.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-[#1C201E] dark:text-[#F1EFEA] truncate max-w-[140px]">
          <User className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896] shrink-0" />
          <span className="truncate">
            {complaint.assignedStaff ? complaint.assignedStaff.name : 'Unassigned'}
          </span>
        </div>
      </div>
    </div>
  );
};
