import React, { useState, useMemo } from 'react';
import { Complaint, IssueCategory, IssuePriority, IssueStatus, BlockId } from '../types';
import { CAMPUS_BLOCKS } from '../data/mockData';
import { ComplaintCard } from '../components/ComplaintCard';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Grid, 
  List, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ComplaintsViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNewComplaint: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  onSelectComplaint,
  onNewComplaint,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchId = c.id.toLowerCase().includes(q);
        const matchLoc = c.locationDetails.toLowerCase().includes(q);
        const matchReporter = c.submittedBy.name.toLowerCase().includes(q);
        const matchTag = c.equipmentTag?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchLoc && !matchReporter && !matchTag) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'All' && c.status !== selectedStatus) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'All' && c.priority !== selectedPriority) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }

      // Block filter
      if (selectedBlock !== 'All' && c.blockId !== selectedBlock) {
        return false;
      }

      return true;
    });
  }, [complaints, searchQuery, selectedStatus, selectedPriority, selectedCategory, selectedBlock]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Block', 'Location', 'Category', 'Priority', 'Status', 'Submitted Date', 'Assigned Staff'];
    const rows = filteredComplaints.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.blockId,
      `"${c.locationDetails.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      c.submittedDate,
      c.assignedStaff ? c.assignedStaff.name : 'Unassigned',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campuscare_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityStyle = (priority: IssuePriority) => {
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
    <div className="space-y-5 pb-12">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
            Campus Complaints Register
          </h1>
          <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5 font-sans">
            Comprehensive audit record of student, faculty and facility infrastructure tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#1C201E] dark:text-[#F1EFEA] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896]" />
            Export CSV
          </button>

          <button
            onClick={onNewComplaint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Issue
          </button>
        </div>
      </div>

      {/* Filter Toolbar with Zero-Pill Discipline */}
      <div className="p-3.5 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs / Segmented Control */}
          <div className="flex items-center gap-1 p-0.5 rounded bg-[#FAF8F3] dark:bg-[#18231E] border border-[#E2DCD0] dark:border-[#24322B] overflow-x-auto max-w-full">
            {['All', 'SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-[#1B4332] text-white dark:bg-[#347A57] font-semibold'
                    : 'text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white'
                }`}
              >
                {st === 'All' ? 'All Statuses' : st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Grid or Table */}
          <div className="flex items-center gap-1 border border-[#E2DCD0] dark:border-[#24322B] rounded p-0.5 bg-[#FAF8F3] dark:bg-[#18231E]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-white shadow-xs' : 'text-[#8E9892]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-white shadow-xs' : 'text-[#8E9892]'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#ECE8DE] dark:border-[#1F2A24] text-xs">
          <div>
            <label className="block text-[10px] font-mono text-[#8E9892] dark:text-[#5E6C63] uppercase mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#1A241F] text-[#1C201E] dark:text-[#F1EFEA]"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#8E9892] dark:text-[#5E6C63] uppercase mb-1">
              Trade Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#1A241F] text-[#1C201E] dark:text-[#F1EFEA]"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
              <option value="Structural">Structural</option>
              <option value="IT / AV">IT / AV</option>
              <option value="Safety">Safety</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#8E9892] dark:text-[#5E6C63] uppercase mb-1">
              Campus Block
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#1A241F] text-[#1C201E] dark:text-[#F1EFEA]"
            >
              <option value="All">All Campus Blocks</option>
              {CAMPUS_BLOCKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#8E9892] dark:text-[#5E6C63] uppercase mb-1">
              Active Results
            </label>
            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[#FAF8F3] dark:bg-[#1A241F] border border-[#E2DCD0] dark:border-[#24322B] font-mono font-bold text-[#1C201E] dark:text-[#F1EFEA]">
              <span>{filteredComplaints.length} Records</span>
              {(selectedPriority !== 'All' || selectedCategory !== 'All' || selectedBlock !== 'All' || selectedStatus !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedPriority('All');
                    setSelectedCategory('All');
                    setSelectedBlock('All');
                    setSelectedStatus('All');
                  }}
                  className="text-[10px] text-[#2D6A6C] dark:text-[#4EA896] underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="p-12 text-center rounded-md border border-dashed border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <p className="text-sm font-semibold text-[#1C201E] dark:text-[#F1EFEA]">
            No complaints match current filters
          </p>
          <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-1">
            Try adjusting search terms or clearing status filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onClick={() => onSelectComplaint(c)}
            />
          ))}
        </div>
      ) : (
        /* Professional Compact Blueprint Table */
        <div className="rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] overflow-hidden shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#18231E] font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
                <th className="py-2.5 px-3">Complaint ID</th>
                <th className="py-2.5 px-3">Title & Location</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Submitted</th>
                <th className="py-2.5 px-3">Assigned Staff</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8DE] dark:divide-[#1F2A24]">
              {filteredComplaints.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectComplaint(item)}
                  className="hover:bg-[#F9F7F2] dark:hover:bg-[#1B2621] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2D6A6C] dark:text-[#4EA896] whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 min-w-[220px]">
                    <div className="font-semibold text-[#1C201E] dark:text-[#F1EFEA] group-hover:text-[#2D6A6C] dark:group-hover:text-[#4EA896] transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#646E68] dark:text-[#8E9B93] truncate">
                      {item.locationDetails}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#646E68] dark:text-[#8E9B93] whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className={`py-2.5 px-3 font-mono ${getPriorityStyle(item.priority)} whitespace-nowrap`}>
                    {item.priority}
                  </td>
                  {/* Zero-Pill Status Marker */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className={getStatusDot(item.status)}>●</span>
                      <span className="text-[#1C201E] dark:text-[#F1EFEA]">
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] whitespace-nowrap">
                    {item.submittedDate.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-[#1C201E] dark:text-[#F1EFEA] whitespace-nowrap text-[11px]">
                    {item.assignedStaff ? item.assignedStaff.name : (
                      <span className="text-[#8E9892] dark:text-[#5E6C63] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span className="font-mono text-[11px] text-[#2D6A6C] dark:text-[#4EA896] group-hover:underline flex items-center justify-end gap-1">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
