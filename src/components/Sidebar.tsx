import React from 'react';
import { CampusLogo } from './CampusLogo';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  FileWarning, 
  ClipboardList, 
  Network, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export type NavPage = 
  | 'Dashboard'
  | 'Complaints'
  | 'Assignments'
  | 'Departments'
  | 'Staff'
  | 'Students'
  | 'Feedback'
  | 'Reports'
  | 'Settings';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  openCount: number;
  urgentCount: number;
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  openCount,
  urgentCount,
  className = '',
  onCloseMobile,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems: { label: NavPage; icon: React.ElementType; badge?: number; urgentBadge?: number }[] = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Complaints', icon: FileWarning, badge: openCount, urgentBadge: urgentCount },
    { label: 'Assignments', icon: ClipboardList },
    { label: 'Departments', icon: Network },
    { label: 'Staff', icon: Users },
    { label: 'Students', icon: GraduationCap },
    { label: 'Feedback', icon: MessageSquare },
    { label: 'Reports', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`w-64 shrink-0 flex flex-col justify-between border-r border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#121A16] select-none ${className}`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#E2DCD0] dark:border-[#24322B]">
          <CampusLogo />
        </div>

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1" aria-label="CampusCare Navigation">
          <div className="px-3 py-1.5 text-[10px] font-mono tracking-wider text-[#8E9892] dark:text-[#5E6C63] uppercase">
            OPERATIONS CONSOLE
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.label);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1B4332] text-white dark:bg-[#347A57] shadow-xs'
                    : 'text-[#1C201E] dark:text-[#ECEAE4] hover:bg-[#EFECE3] dark:hover:bg-[#1A241F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#2D6A6C] dark:text-[#4EA896]'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {item.urgentBadge && item.urgentBadge > 0 ? (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                    }`}>
                      {item.urgentBadge} !
                    </span>
                  ) : null}

                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#E5E0D5] dark:bg-[#1E2923] text-[#646E68] dark:text-[#8E9B93]'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Toggle, User Profile & Session Controls */}
      <div className="p-3 border-t border-[#E2DCD0] dark:border-[#24322B] space-y-3 bg-[#FAF8F3] dark:bg-[#121A16]">
        {/* Elegant Theme Toggle Button */}
        <div className="flex items-center justify-between p-2 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#646E68] dark:text-[#8E9B93]">
            {theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-[#4EA896]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="text-[11px] uppercase tracking-wide">
              {theme === 'dark' ? 'DARK BLUEPRINT' : 'LIGHT BLUEPRINT'}
            </span>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#1A241F] hover:bg-[#EFECE3] dark:hover:bg-[#25332C] text-[#1C201E] dark:text-[#F1EFEA] transition-colors"
          >
            SWITCH
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-[#151D19] border border-[#E2DCD0] dark:border-[#24322B]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#1B4332] dark:bg-[#347A57] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              CV
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1C201E] dark:text-[#F1EFEA] truncate">
                Catherine Vance
              </div>
              <div className="text-[10px] text-[#646E68] dark:text-[#8E9B93] truncate font-mono">
                Chief Estates Officer
              </div>
            </div>
          </div>

          <button
            title="Log out or switch workstation"
            className="p-1 rounded text-[#8E9892] hover:text-[#DC2626] dark:hover:text-rose-400 transition-colors"
            onClick={() => {
              // Graceful notification toast or session confirmation
              alert('Workstation Session: Authenticated as Chief Estates Officer (Catherine Vance).');
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
