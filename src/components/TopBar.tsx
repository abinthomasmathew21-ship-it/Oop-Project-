import React, { useState } from 'react';
import { NavPage } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Complaint } from '../types';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  Check, 
  AlertTriangle, 
  Plus, 
  X,
  Building,
  User
} from 'lucide-react';

interface TopBarProps {
  currentPage: NavPage;
  onOpenMobileMenu: () => void;
  onNewComplaint: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  urgentComplaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onOpenMobileMenu,
  onNewComplaint,
  searchQuery,
  onSearchChange,
  urgentComplaints,
  onSelectComplaint,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  return (
    <header className="h-14 border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#121A16] px-4 sm:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Zone 1: Mobile toggle & Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-[#646E68] dark:text-[#8E9B93] hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono truncate">
          <span className="text-[#8E9892] dark:text-[#5E6C63] hidden sm:inline">
            CAMPUS OPERATIONS /
          </span>
          <h1 className="text-sm font-bold text-[#1C201E] dark:text-[#F1EFEA] uppercase tracking-wide truncate">
            {currentPage}
          </h1>
        </div>
      </div>

      {/* Zone 2: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9892] dark:text-[#5E6C63]" />
          <input
            type="text"
            placeholder="Search tickets (e.g., CC-2026, Lab 304, Chiller, Evelyn)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-xs text-[#1C201E] dark:text-[#F1EFEA] placeholder:text-[#8E9892] dark:placeholder:text-[#5E6C63] focus:outline-hidden focus:border-[#2D6A6C] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E9892] hover:text-[#1C201E] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Actions, Notifications & Light/Dark Theme Control */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Log Issue Action */}
        <button
          onClick={onNewComplaint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] text-white transition-colors shrink-0 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Issue</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setNotificationsRead(true);
            }}
            aria-label="View urgent notifications"
            className="relative p-2 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-[#F1EFEA] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {urgentComplaints.length > 0 && !notificationsRead && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            )}
            {urgentComplaints.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600" />
            )}
          </button>

          {/* Notifications Flyout Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] shadow-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DCD0] dark:border-[#24322B] mb-2 font-mono">
                <span className="font-bold text-[#1C201E] dark:text-[#F1EFEA]">
                  FACILITY ALERTS & NOTICES
                </span>
                <span className="text-[11px] text-[#646E68] dark:text-[#8E9B93]">
                  {urgentComplaints.length} Urgent / High
                </span>
              </div>

              {urgentComplaints.length === 0 ? (
                <div className="py-4 text-center text-[#8E9892] dark:text-[#5E6C63]">
                  No urgent infrastructure hazards reported.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {urgentComplaints.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectComplaint(item);
                        setShowNotifications(false);
                      }}
                      className="p-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF9F5] dark:bg-[#1A241F] hover:border-[#2D6A6C] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#DC2626] dark:text-rose-400 font-bold mb-0.5">
                        <span>{item.id} · {item.priority.toUpperCase()}</span>
                        <span>{item.submittedDate.split(' ')[1]}</span>
                      </div>
                      <div className="font-semibold text-[#1C201E] dark:text-[#F1EFEA] line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-0.5">
                        {item.locationDetails}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Elegant Light / Dark Theme Control in Top Bar */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle visual theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Blueprint`}
          className="p-2 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#646E68] dark:text-[#8E9B93] hover:text-[#1C201E] dark:hover:text-[#F1EFEA] transition-colors"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-[#4EA896]" />
          ) : (
            <Sun className="w-4 h-4 text-amber-600" />
          )}
        </button>

        {/* Top bar compact user avatar */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E2DCD0] dark:border-[#24322B]">
          <div className="w-7 h-7 rounded bg-[#1B4332] dark:bg-[#347A57] text-white flex items-center justify-center font-bold text-[11px] font-mono">
            CV
          </div>
          <span className="text-xs font-medium text-[#1C201E] dark:text-[#F1EFEA] hidden md:inline">
            C. Vance
          </span>
        </div>
      </div>
    </header>
  );
};
