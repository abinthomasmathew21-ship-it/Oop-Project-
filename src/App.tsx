/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BlueprintBackground } from './components/BlueprintBackground';
import { Sidebar, NavPage } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './views/DashboardView';
import { ComplaintsView } from './views/ComplaintsView';
import { AssignmentsView } from './views/AssignmentsView';
import { DepartmentsView } from './views/DepartmentsView';
import { StaffView } from './views/StaffView';
import { StudentsView } from './views/StudentsView';
import { FeedbackView } from './views/FeedbackView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { NewComplaintModal } from './components/NewComplaintModal';
import { 
  INITIAL_COMPLAINTS, 
  CAMPUS_BLOCKS, 
  INITIAL_STAFF, 
  INITIAL_DEPARTMENTS 
} from './data/mockData';
import { Complaint, BlockId, StaffMember } from './types';

export default function App() {
  return (
    <ThemeProvider>
      <MainApplication />
    </ThemeProvider>
  );
}

function MainApplication() {
  const [currentPage, setCurrentPage] = useState<NavPage>('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState<BlockId | null>('lab_block');

  // Load complaints from localStorage or fallback to initial data
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('campuscare_complaints_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load persisted complaints', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);

  // Modals state
  const [activeComplaintDocket, setActiveComplaintDocket] = useState<Complaint | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [newComplaintBlockTarget, setNewComplaintBlockTarget] = useState<BlockId | null>(null);

  // Sync complaints to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('campuscare_complaints_v1', JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to persist complaints', e);
    }
  }, [complaints]);

  // Urgent and open counts for badges
  const openCount = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const urgentComplaints = complaints.filter(
    (c) => (c.priority === 'Urgent' || c.priority === 'High') && c.status !== 'RESOLVED'
  );

  // Handlers
  const handleUpdateComplaint = (updated: Complaint) => {
    setComplaints((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setActiveComplaintDocket(updated);
  };

  const handleAddNewComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    setIsNewComplaintOpen(false);
    setNewComplaintBlockTarget(null);
    // Automatically inspect the newly logged docket
    setActiveComplaintDocket(newComplaint);
  };

  const handleOpenNewComplaint = (blockId?: BlockId) => {
    setNewComplaintBlockTarget(blockId || selectedBlockId || null);
    setIsNewComplaintOpen(true);
  };

  return (
    <div className="relative min-h-screen flex text-[#1C201E] dark:text-[#F1EFEA] font-sans antialiased overflow-x-hidden">
      {/* Blueprint Architectural Ambient Vector Background */}
      <BlueprintBackground />

      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden lg:flex relative z-20 h-screen sticky top-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          openCount={openCount}
          urgentCount={urgentComplaints.length}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full flex flex-col">
            <Sidebar
              currentPage={currentPage}
              onNavigate={(page) => {
                setCurrentPage(page);
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              openCount={openCount}
              urgentCount={urgentComplaints.length}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Strict Top Bar Contract */}
        <TopBar
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNewComplaint={() => handleOpenNewComplaint()}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim() && currentPage !== 'Complaints') {
              setCurrentPage('Complaints');
            }
          }}
          urgentComplaints={urgentComplaints}
          onSelectComplaint={(c) => setActiveComplaintDocket(c)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {currentPage === 'Dashboard' && (
            <DashboardView
              blocks={CAMPUS_BLOCKS}
              complaints={complaints}
              staff={staff}
              onSelectComplaint={(c) => setActiveComplaintDocket(c)}
              onNewComplaint={handleOpenNewComplaint}
              onNavigateToComplaints={() => setCurrentPage('Complaints')}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />
          )}

          {currentPage === 'Complaints' && (
            <ComplaintsView
              complaints={complaints}
              onSelectComplaint={(c) => setActiveComplaintDocket(c)}
              onNewComplaint={() => handleOpenNewComplaint()}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {currentPage === 'Assignments' && (
            <AssignmentsView
              complaints={complaints}
              staff={staff}
              onSelectComplaint={(c) => setActiveComplaintDocket(c)}
            />
          )}

          {currentPage === 'Departments' && (
            <DepartmentsView departments={INITIAL_DEPARTMENTS} />
          )}

          {currentPage === 'Staff' && (
            <StaffView staff={staff} />
          )}

          {currentPage === 'Students' && (
            <StudentsView
              complaints={complaints}
              onSelectComplaint={(c) => setActiveComplaintDocket(c)}
              onNewComplaint={() => handleOpenNewComplaint('hostel')}
            />
          )}

          {currentPage === 'Feedback' && (
            <FeedbackView complaints={complaints} />
          )}

          {currentPage === 'Reports' && (
            <ReportsView
              complaints={complaints}
              blocks={CAMPUS_BLOCKS}
            />
          )}

          {currentPage === 'Settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Work Order Detail Modal with Visual Lifecycle Timeline */}
      {activeComplaintDocket && (
        <ComplaintDetailModal
          complaint={activeComplaintDocket}
          staffList={staff}
          onClose={() => setActiveComplaintDocket(null)}
          onUpdateComplaint={handleUpdateComplaint}
        />
      )}

      {/* New Complaint Intake Modal */}
      {isNewComplaintOpen && (
        <NewComplaintModal
          initialBlockId={newComplaintBlockTarget}
          onClose={() => {
            setIsNewComplaintOpen(false);
            setNewComplaintBlockTarget(null);
          }}
          onSubmit={handleAddNewComplaint}
        />
      )}
    </div>
  );
}
