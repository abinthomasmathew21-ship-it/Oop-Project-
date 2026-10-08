import React, { useState } from 'react';
import { BlockId, Complaint, IssueCategory, IssuePriority } from '../types';
import { CAMPUS_BLOCKS } from '../data/mockData';
import { X, Plus, AlertCircle, FilePlus2 } from 'lucide-react';

interface NewComplaintModalProps {
  initialBlockId?: BlockId | null;
  onClose: () => void;
  onSubmit: (newComplaint: Complaint) => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  initialBlockId,
  onClose,
  onSubmit,
}) => {
  const [blockId, setBlockId] = useState<BlockId>(initialBlockId || 'main_block');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Electrical');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  const [floor, setFloor] = useState('Ground Floor');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Sarah Jenkins');
  const [reporterRole, setReporterRole] = useState<'Student' | 'Faculty' | 'Staff' | 'Administrator'>('Staff');
  const [reporterDept, setReporterDept] = useState('Academic Operations');
  const [reporterEmail, setReporterEmail] = useState('s.jenkins@univ.edu');
  const [reporterId, setReporterId] = useState('STF-1044');
  const [equipmentTag, setEquipmentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationDetails.trim() || !description.trim()) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CC-2026-${randomTicketNum}`;

    const newComplaint: Complaint = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      blockId,
      locationDetails: locationDetails.trim(),
      floor,
      category,
      priority,
      status: 'SUBMITTED',
      submittedBy: {
        name: reporterName,
        role: reporterRole,
        department: reporterDept,
        email: reporterEmail,
        idNumber: reporterId,
      },
      submittedDate: formattedDate,
      equipmentTag: equipmentTag.trim() || undefined,
      history: [
        {
          id: `HIS-${Date.now()}`,
          stage: 'SUBMITTED',
          timestamp: formattedDate,
          actor: reporterName,
          role: `${reporterRole} Reporter`,
          note: `New issue registered via CampusCare dispatch console. Category: ${category}, Priority: ${priority}.`,
        },
      ],
    };

    onSubmit(newComplaint);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-[#151D19] border border-[#E2DCD0] dark:border-[#24322B] rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#18231E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-[#1B4332] text-white dark:bg-[#347A57]">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#2D6A6C] dark:text-[#4EA896] uppercase">
                CAMPUS INFRASTRUCTURE LOG
              </span>
              <h2 className="text-base font-bold text-[#1C201E] dark:text-[#F1EFEA]">
                Log New Maintenance Issue
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Water Riser Valve Leakage in Washroom 204"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Campus Block *
              </label>
              <select
                value={blockId}
                onChange={(e) => setBlockId(e.target.value as BlockId)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              >
                {CAMPUS_BLOCKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} — {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Floor Level *
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              >
                <option value="Basement">Basement / Underground</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="Floor 1">Floor 1 / Level 1</option>
                <option value="Floor 2">Floor 2 / Level 2</option>
                <option value="Floor 3">Floor 3 / Level 3</option>
                <option value="Floor 4">Floor 4 / Level 4</option>
                <option value="Roof / Exterior">Roof / Exterior Grounds</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
              Exact Location / Room / Corridor *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Room 304, Organic Chemistry Lab, North Wall"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Trade Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="HVAC">HVAC & Climate</option>
                <option value="Structural">Structural & Carpentry</option>
                <option value="IT / AV">IT / AV Systems</option>
                <option value="Furniture">Furniture</option>
                <option value="Safety">Safety & Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              >
                <option value="Low">Low — Minor aesthetic / scheduled</option>
                <option value="Medium">Medium — Standard facility repair</option>
                <option value="High">High — Disrupts academic/office function</option>
                <option value="Urgent">Urgent — Safety hazard / active flood / power out</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe symptoms, noise, leaks, safety hazards, or affected students/classes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Reporter Name *
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Reporter Role
              </label>
              <select
                value={reporterRole}
                onChange={(e) => setReporterRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              >
                <option value="Staff">University Staff</option>
                <option value="Faculty">Faculty / Professor</option>
                <option value="Student">Student Resident</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Reporter Email
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                Equipment / Asset Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., PLMB-VALVE-LB304-A"
                value={equipmentTag}
                onChange={(e) => setEquipmentTag(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2DCD0] dark:border-[#24322B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#1C201E] dark:text-[#F1EFEA] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Register Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
