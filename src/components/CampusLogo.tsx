import React from 'react';

interface CampusLogoProps {
  className?: string;
  collapsed?: boolean;
}

export const CampusLogo: React.FC<CampusLogoProps> = ({ className = '', collapsed = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Blueprint-inspired Minimal Architectural Campus Symbol */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-md bg-[#1B4332] dark:bg-[#347A57] text-white shadow-xs border border-[#143527] dark:border-[#408B65] shrink-0">
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-6 h-6 stroke-current"
          strokeWidth="1.8"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Location pin outer contour with architectural crown */}
          <path d="M16 3C10.5 3 6.5 7.2 6.5 12.8C6.5 19.4 16 29 16 29C16 29 25.5 19.4 25.5 12.8C25.5 7.2 21.5 3 16 3Z" strokeOpacity="0.35" fill="none" />
          
          {/* Campus building: Gable / roofline & classic columns */}
          <path d="M11 13L16 9L21 13" stroke="currentColor" />
          <path d="M12.5 14V19" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 14V19" stroke="currentColor" strokeWidth="1.5" />
          <path d="M19.5 14V19" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Base foundation line */}
          <path d="M10 20H22" stroke="currentColor" strokeWidth="1.6" />
          
          {/* Check / repair indicator overlay */}
          <path d="M17.5 19.5L19.5 21.5L23.5 16.5" stroke="#4EA896" className="dark:stroke-[#A3E5D4]" strokeWidth="2.2" />
        </svg>

        {/* Blueprint coordinate corner ticks */}
        <span className="absolute -top-[2px] -left-[2px] w-1.5 h-1.5 border-t border-l border-[#1B4332]/40 dark:border-[#347A57]/60 pointer-events-none" />
        <span className="absolute -bottom-[2px] -right-[2px] w-1.5 h-1.5 border-b border-r border-[#1B4332]/40 dark:border-[#347A57]/60 pointer-events-none" />
      </div>

      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
              CAMPUS<span className="text-[#2D6A6C] dark:text-[#4EA896]">CARE</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-1 py-0.2 rounded border border-[#E2DCD0] dark:border-[#24322B] text-[#646E68] dark:text-[#8E9B93] bg-[#F8F6F0] dark:bg-[#151D19]">
              OPS
            </span>
          </div>
          <span className="text-[11px] font-normal text-[#646E68] dark:text-[#8E9B93] truncate leading-tight tracking-normal">
            Campus Issue & Infrastructure Management
          </span>
        </div>
      )}
    </div>
  );
};
