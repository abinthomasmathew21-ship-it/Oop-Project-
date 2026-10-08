import React, { useState } from 'react';
import { Complaint, IssueStatus, StaffMember, TimelineEntry } from '../types';
import { 
  X, 
  MapPin, 
  User, 
  Calendar, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  Printer
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  staffList: StaffMember[];
  onClose: () => void;
  onUpdateComplaint: (updated: Complaint) => void;
}

const STAGES_ORDER: IssueStatus[] = [
  'SUBMITTED',
  'VERIFIED',
  'ASSIGNED',
  'IN PROGRESS',
  'RESOLVED',
];

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  staffList,
  onClose,
  onUpdateComplaint,
}) => {
  if (!complaint) return null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'actions'>('timeline');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    complaint.assignedStaff?.id || (staffList[0]?.id ?? '')
  );
  const [actionNote, setActionNote] = useState<string>('');
  const [operatorName, setOperatorName] = useState<string>('Catherine Vance (Estates Ops)');

  // Helper to find timeline event for a stage
  const getStageEvent = (stage: IssueStatus): TimelineEntry | undefined => {
    return complaint.history.find((h) => h.stage === stage);
  };

  const currentStageIndex = STAGES_ORDER.indexOf(complaint.status);

  // Advance to next stage handler
  const handleAdvanceStage = () => {
    if (currentStageIndex >= STAGES_ORDER.length - 1) return;
    const nextStage = STAGES_ORDER[currentStageIndex + 1];

    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;

    let assignedStaff = complaint.assignedStaff;
    if (nextStage === 'ASSIGNED' || !assignedStaff) {
      const staff = staffList.find((s) => s.id === selectedStaffId);
      if (staff) {
        assignedStaff = {
          id: staff.id,
          name: staff.name,
          trade: staff.trade,
          phone: staff.phone,
        };
      }
    }

    const defaultNotes: Record<IssueStatus, string> = {
      SUBMITTED: 'Ticket registered into CampusCare dispatch system.',
      VERIFIED: 'Inspected and confirmed physical site parameters & safety status.',
      ASSIGNED: `Assigned work order to ${assignedStaff?.name || 'facility technician'}.`,
      'IN PROGRESS': 'Maintenance crew on-site with required replacement components.',
      RESOLVED: 'Repairs completed and functional tests signed off.',
    };

    const newHistoryEntry: TimelineEntry = {
      id: `HIS-${Date.now()}`,
      stage: nextStage,
      timestamp: formattedDate,
      actor: operatorName,
      role: nextStage === 'RESOLVED' ? 'Maintenance Inspector' : 'Operations Coordinator',
      note: actionNote.trim() || defaultNotes[nextStage],
    };

    const updatedComplaint: Complaint = {
      ...complaint,
      status: nextStage,
      assignedStaff,
      resolvedAt: nextStage === 'RESOLVED' ? formattedDate : complaint.resolvedAt,
      history: [...complaint.history, newHistoryEntry],
    };

    onUpdateComplaint(updatedComplaint);
    setActionNote('');
  };

  // Add custom note to history
  const handleAddNote = () => {
    if (!actionNote.trim()) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;

    const newHistoryEntry: TimelineEntry = {
      id: `HIS-${Date.now()}`,
      stage: complaint.status,
      timestamp: formattedDate,
      actor: operatorName,
      role: 'Operations Desk',
      note: actionNote.trim(),
    };

    const updatedComplaint: Complaint = {
      ...complaint,
      history: [...complaint.history, newHistoryEntry],
    };

    onUpdateComplaint(updatedComplaint);
    setActionNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-[#151D19] border border-[#E2DCD0] dark:border-[#24322B] rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Blueprint Docket Header */}
        <div className="px-6 py-4 border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#18231E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-[#1B4332] text-white dark:bg-[#347A57]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2D6A6C] dark:text-[#4EA896] tracking-wide">
                  WORK ORDER DOCKET: {complaint.id}
                </span>
                <span className="text-[#646E68] dark:text-[#8E9B93] text-xs">·</span>
                <span className="text-xs font-mono text-[#646E68] dark:text-[#8E9B93]">
                  {complaint.category}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#1C201E] dark:text-[#F1EFEA] tracking-tight">
                {complaint.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print work docket"
              className="p-1.5 rounded text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Docket Metadata Stripe */}
        <div className="px-6 py-2.5 border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#F7F5EE] dark:bg-[#121A16] flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono text-[#646E68] dark:text-[#8E9B93]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#1C201E] dark:text-[#F1EFEA]">
              <MapPin className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896]" />
              {complaint.locationDetails} ({complaint.floor})
            </span>
            <span>·</span>
            <span>
              PRIORITY: <strong className={
                complaint.priority === 'Urgent' ? 'text-rose-600 dark:text-rose-400' :
                complaint.priority === 'High' ? 'text-orange-600 dark:text-orange-400' :
                complaint.priority === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'
              }>{complaint.priority.toUpperCase()}</strong>
            </span>
            <span>·</span>
            <span>STATUS: <strong className="text-[#1C201E] dark:text-[#F1EFEA]">● {complaint.status}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>SUBMITTED:</span>
            <span className="font-semibold text-[#1C201E] dark:text-[#F1EFEA]">
              {complaint.submittedDate}
            </span>
          </div>
        </div>

        {/* Modal Body / Tabs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Segmented Tab Bar */}
          <div className="flex items-center justify-between border-b border-[#E2DCD0] dark:border-[#24322B] pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-[#1B4332] text-white dark:bg-[#347A57]'
                    : 'text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white'
                }`}
              >
                Lifecycle Timeline
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  activeTab === 'details'
                    ? 'bg-[#1B4332] text-white dark:bg-[#347A57]'
                    : 'text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white'
                }`}
              >
                Docket Details
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  activeTab === 'actions'
                    ? 'bg-[#1B4332] text-white dark:bg-[#347A57]'
                    : 'text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-white'
                }`}
              >
                Dispatch & Update
              </button>
            </div>

            {/* Stage Advance Quick Button */}
            {currentStageIndex < STAGES_ORDER.length - 1 && (
              <button
                onClick={handleAdvanceStage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#2D6A6C] hover:bg-[#235557] dark:bg-[#4EA896] dark:hover:bg-[#429584] text-white transition-colors"
              >
                Advance to {STAGES_ORDER[currentStageIndex + 1]}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TAB 1: VISUAL TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-[#FAF9F5] dark:bg-[#1A241F] p-4 rounded border border-[#E2DCD0] dark:border-[#24322B]">
                <h3 className="text-xs font-mono font-bold uppercase text-[#2D6A6C] dark:text-[#4EA896] mb-1">
                  FACILITY RESOLUTION AUDIT TRAIL
                </h3>
                <p className="text-xs text-[#646E68] dark:text-[#8E9B93]">
                  Verifiable stage progression recorded with date/time and responsible personnel.
                </p>
              </div>

              {/* Exact Visual Timeline as Specified in Prompt:
                  SUBMITTED
                      │
                      ●
                  VERIFIED
                      │
                      ●
                  ASSIGNED
                      │
                      ●
                  IN PROGRESS
                      │
                      ●
                  RESOLVED
              */}
              <div className="relative pl-6 sm:pl-10 space-y-6 font-mono">
                {STAGES_ORDER.map((stage, idx) => {
                  const event = getStageEvent(stage);
                  const isReached = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isLast = idx === STAGES_ORDER.length - 1;

                  return (
                    <div key={stage} className="relative flex items-start gap-4">
                      {/* Vertical Connecting Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[7px] top-[18px] bottom-[-24px] w-[2px] transition-colors ${
                            idx < currentStageIndex
                              ? 'bg-[#1B4332] dark:bg-[#347A57]'
                              : 'bg-[#E2DCD0] dark:bg-[#2B3931]'
                          }`}
                        />
                      )}

                      {/* Timeline Stage Dot Marker */}
                      <div
                        className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
                          isReached
                            ? 'bg-[#1B4332] border-[#1B4332] text-white dark:bg-[#347A57] dark:border-[#347A57]'
                            : 'bg-white dark:bg-[#151D19] border-[#D0C9BB] dark:border-[#3A4B41]'
                        } ${isCurrent ? 'ring-4 ring-[#2D6A6C]/20 dark:ring-[#4EA896]/20' : ''}`}
                      >
                        {isReached && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      {/* Stage Information Card */}
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span
                            className={`text-sm font-bold tracking-wider ${
                              isReached
                                ? 'text-[#1C201E] dark:text-[#F1EFEA]'
                                : 'text-[#8E9892] dark:text-[#5E6C63]'
                            }`}
                          >
                            {stage}
                          </span>

                          {event ? (
                            <span className="text-xs text-[#646E68] dark:text-[#8E9B93]">
                              {event.timestamp}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#8E9892] dark:text-[#5E6C63] italic">
                              Pending
                            </span>
                          )}
                        </div>

                        {event && (
                          <div className="mt-1 p-2.5 rounded bg-[#FAF9F5] dark:bg-[#19231E] border border-[#E2DCD0]/70 dark:border-[#24322B]/80 text-xs">
                            <div className="flex items-center gap-1.5 text-[#2D6A6C] dark:text-[#4EA896] font-semibold text-[11px] mb-0.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{event.actor}</span>
                              <span className="text-[#8E9892] dark:text-[#5E6C63]">
                                ({event.role})
                              </span>
                            </div>
                            <p className="text-[#1C201E] dark:text-[#F1EFEA] font-sans text-xs mt-1 leading-relaxed">
                              {event.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Section if Resolved */}
              {complaint.feedback && (
                <div className="mt-6 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      USER SIGN-OFF & SATISFACTION: {'★'.repeat(complaint.feedback.rating)}
                    </span>
                    <span className="text-[#646E68] dark:text-[#8E9B93] text-[11px]">
                      {complaint.feedback.submittedAt}
                    </span>
                  </div>
                  <p className="text-[#1C201E] dark:text-[#F1EFEA] italic">
                    "{complaint.feedback.comment}"
                  </p>
                  <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
                    — {complaint.feedback.studentName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCKET DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded bg-[#FAF9F5] dark:bg-[#1A241F] border border-[#E2DCD0] dark:border-[#24322B]">
                <h4 className="font-mono text-[11px] uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                  Full Issue Description
                </h4>
                <p className="text-sm text-[#1C201E] dark:text-[#F1EFEA] leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-2">
                  <h4 className="font-mono text-[11px] uppercase font-bold text-[#2D6A6C] dark:text-[#4EA896] pb-1 border-b border-[#E2DCD0] dark:border-[#24322B]">
                    Reporter Information
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#646E68] dark:text-[#8E9B93]">Name:</span>
                      <span className="font-medium text-[#1C201E] dark:text-[#F1EFEA]">
                        {complaint.submittedBy.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#646E68] dark:text-[#8E9B93]">Role / Dept:</span>
                      <span className="text-[#1C201E] dark:text-[#F1EFEA]">
                        {complaint.submittedBy.role} · {complaint.submittedBy.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#646E68] dark:text-[#8E9B93]">ID Number:</span>
                      <span className="font-mono text-[#1C201E] dark:text-[#F1EFEA]">
                        {complaint.submittedBy.idNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#646E68] dark:text-[#8E9B93]">Email:</span>
                      <span className="text-[#2D6A6C] dark:text-[#4EA896]">
                        {complaint.submittedBy.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-2">
                  <h4 className="font-mono text-[11px] uppercase font-bold text-[#2D6A6C] dark:text-[#4EA896] pb-1 border-b border-[#E2DCD0] dark:border-[#24322B]">
                    Assigned Technician
                  </h4>
                  {complaint.assignedStaff ? (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#646E68] dark:text-[#8E9B93]">Technician:</span>
                        <span className="font-medium text-[#1C201E] dark:text-[#F1EFEA]">
                          {complaint.assignedStaff.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#646E68] dark:text-[#8E9B93]">Trade / Craft:</span>
                        <span className="text-[#1C201E] dark:text-[#F1EFEA]">
                          {complaint.assignedStaff.trade}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#646E68] dark:text-[#8E9B93]">Contact Radio:</span>
                        <span className="font-mono text-[#1C201E] dark:text-[#F1EFEA]">
                          {complaint.assignedStaff.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#646E68] dark:text-[#8E9B93]">Est. Resolution:</span>
                        <span className="font-mono text-[#1C201E] dark:text-[#F1EFEA]">
                          {complaint.estimatedResolutionHours || 3} Hours
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-[#646E68] dark:text-[#8E9B93]">
                      <p>Unassigned.</p>
                      <button
                        onClick={() => setActiveTab('actions')}
                        className="mt-2 text-xs font-semibold text-[#2D6A6C] dark:text-[#4EA896] underline"
                      >
                        Assign Technician Now
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {complaint.equipmentTag && (
                <div className="flex items-center gap-2 p-2.5 rounded bg-[#FAF9F5] dark:bg-[#1A241F] border border-[#E2DCD0] dark:border-[#24322B] font-mono text-[11px]">
                  <Wrench className="w-4 h-4 text-[#2D6A6C] dark:text-[#4EA896]" />
                  <span className="text-[#646E68] dark:text-[#8E9B93]">CAMPUS ASSET TAG:</span>
                  <span className="font-bold text-[#1C201E] dark:text-[#F1EFEA]">
                    {complaint.equipmentTag}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISPATCH & UPDATE */}
          {activeTab === 'actions' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                    Operating Admin / Dispatcher
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                    Assign / Reassign Staff
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
                  >
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} — {st.trade} ({st.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#646E68] dark:text-[#8E9B93] mb-1">
                  Add Dispatcher Note / Maintenance Log Entry
                </label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Enter details on parts replaced, diagnostic findings, or maintenance instructions..."
                  className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!actionNote.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-[#1C201E] dark:text-[#F1EFEA] disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Append Note to Log
                </button>

                {currentStageIndex < STAGES_ORDER.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAdvanceStage}
                    className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] font-semibold text-white transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save & Advance to {STAGES_ORDER[currentStageIndex + 1]}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#18231E] flex items-center justify-between text-xs text-[#646E68] dark:text-[#8E9B93]">
          <span className="font-mono text-[11px]">
            CAMPUSCARE VERIFIED AUDIT REPOSITORY // COMPLAINT_HISTORY
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#1C201E] dark:text-[#F1EFEA] font-semibold transition-colors"
          >
            Close Docket
          </button>
        </div>
      </div>
    </div>
  );
};
