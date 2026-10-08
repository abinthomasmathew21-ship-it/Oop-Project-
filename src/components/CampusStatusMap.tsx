import React, { useState } from 'react';
import { CampusBlockInfo, Complaint, BlockId, IssuePriority, IssueCategory } from '../types';
import { 
  Building2, 
  AlertTriangle, 
  ShieldCheck, 
  Wrench, 
  ChevronRight, 
  Compass, 
  Layers, 
  Plus, 
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  X
} from 'lucide-react';

interface CampusStatusMapProps {
  blocks: CampusBlockInfo[];
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNewComplaintForBlock: (blockId: BlockId) => void;
  selectedBlockId?: BlockId | null;
  onSelectBlock?: (blockId: BlockId | null) => void;
}

export const CampusStatusMap: React.FC<CampusStatusMapProps> = ({
  blocks,
  complaints,
  onSelectComplaint,
  onNewComplaintForBlock,
  selectedBlockId: controlledSelectedBlockId,
  onSelectBlock: controlledOnSelectBlock,
}) => {
  const [internalSelectedBlockId, setInternalSelectedBlockId] = useState<BlockId | null>('lab_block');
  const [hoveredBlockId, setHoveredBlockId] = useState<BlockId | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeFloorFilter, setActiveFloorFilter] = useState<string>('All');
  const [showBlueprintGrid, setShowBlueprintGrid] = useState<boolean>(true);

  const selectedBlockId = controlledSelectedBlockId !== undefined 
    ? controlledSelectedBlockId 
    : internalSelectedBlockId;

  const handleSelectBlock = (id: BlockId | null) => {
    if (controlledOnSelectBlock) {
      controlledOnSelectBlock(id);
    } else {
      setInternalSelectedBlockId(id);
    }
  };

  // Helper to calculate active issues for a block
  const getBlockStats = (blockId: BlockId) => {
    const blockComplaints = complaints.filter(
      (c) => c.blockId === blockId && c.status !== 'RESOLVED'
    );

    let highestPriority: IssuePriority | 'None' = 'None';
    if (blockComplaints.some((c) => c.priority === 'Urgent')) {
      highestPriority = 'Urgent';
    } else if (blockComplaints.some((c) => c.priority === 'High')) {
      highestPriority = 'High';
    } else if (blockComplaints.some((c) => c.priority === 'Medium')) {
      highestPriority = 'Medium';
    } else if (blockComplaints.some((c) => c.priority === 'Low')) {
      highestPriority = 'Low';
    }

    // Determine status color code:
    // Green: No active issues
    // Yellow: Low/medium active issues
    // Orange: High priority issue
    // Red: Urgent issue
    let statusTheme = {
      label: 'Nominal',
      color: '#16A34A', // Green
      bgClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      dotColor: '#16A34A',
      fillClass: 'fill-emerald-500/10 hover:fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(22,163,74,0.25)]',
    };

    if (highestPriority === 'Urgent') {
      statusTheme = {
        label: 'Urgent Issue Active',
        color: '#DC2626', // Red
        bgClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
        dotColor: '#DC2626',
        fillClass: 'fill-rose-500/15 hover:fill-rose-500/25 stroke-rose-600 dark:stroke-rose-400',
        glow: 'shadow-[0_0_14px_rgba(220,38,38,0.35)]',
      };
    } else if (highestPriority === 'High') {
      statusTheme = {
        label: 'High Priority Issue',
        color: '#EA580C', // Orange
        bgClass: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
        dotColor: '#EA580C',
        fillClass: 'fill-orange-500/15 hover:fill-orange-500/25 stroke-orange-600 dark:stroke-orange-400',
        glow: 'shadow-[0_0_12px_rgba(234,88,12,0.3)]',
      };
    } else if (highestPriority === 'Medium' || highestPriority === 'Low') {
      statusTheme = {
        label: 'Active Maintenance',
        color: '#D97706', // Yellow/Amber
        bgClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
        dotColor: '#D97706',
        fillClass: 'fill-amber-500/15 hover:fill-amber-500/25 stroke-amber-600 dark:stroke-amber-400',
        glow: 'shadow-[0_0_10px_rgba(217,119,6,0.25)]',
      };
    }

    // Categories breakdown
    const categoryCount: Record<string, number> = {};
    blockComplaints.forEach((c) => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });

    // Assigned staff in this block
    const assignedStaff = Array.from(
      new Set(
        blockComplaints
          .filter((c) => c.assignedStaff)
          .map((c) => c.assignedStaff!.name)
      )
    );

    const latestComplaint = blockComplaints[0] || null;

    return {
      activeCount: blockComplaints.length,
      highestPriority,
      statusTheme,
      categoryCount,
      assignedStaff,
      latestComplaint,
      allBlockComplaints: blockComplaints,
    };
  };

  const selectedBlockInfo = blocks.find((b) => b.id === selectedBlockId);
  const selectedStats = selectedBlockId ? getBlockStats(selectedBlockId) : null;

  // Layout geometries for the 7 Campus Blocks on a 800x520 architectural canvas
  const blockCoordinates: Record<BlockId, {
    x: number;
    y: number;
    width: number;
    height: number;
    labelX: number;
    labelY: number;
    dimensionText: string;
    roomsSchematic: { x: number; y: number; w: number; h: number }[];
  }> = {
    // Top Row: Living & Recreation
    hostel: {
      x: 60,
      y: 40,
      width: 220,
      height: 120,
      labelX: 170,
      labelY: 100,
      dimensionText: '96m x 36m // RES-WING',
      roomsSchematic: [
        { x: 70, y: 50, w: 95, h: 45 },
        { x: 175, y: 50, w: 95, h: 45 },
        { x: 70, y: 105, w: 95, h: 45 },
        { x: 175, y: 105, w: 95, h: 45 },
      ],
    },
    sports_area: {
      x: 320,
      y: 40,
      width: 420,
      height: 120,
      labelX: 530,
      labelY: 100,
      dimensionText: '110m x 65m // ATHLETICS',
      roomsSchematic: [
        { x: 335, y: 50, w: 180, h: 100 },
        { x: 530, y: 50, w: 95, h: 100 },
        { x: 635, y: 50, w: 90, h: 100 },
      ],
    },

    // Center Row: Academic Core
    main_block: {
      x: 60,
      y: 195,
      width: 260,
      height: 145,
      labelX: 190,
      labelY: 268,
      dimensionText: '84m x 42m // CORE ACADEMIC',
      roomsSchematic: [
        { x: 70, y: 205, w: 115, h: 60 },
        { x: 195, y: 205, w: 115, h: 60 },
        { x: 70, y: 272, w: 75, h: 58 },
        { x: 153, y: 272, w: 78, h: 58 },
        { x: 239, y: 272, w: 71, h: 58 },
      ],
    },
    lab_block: {
      x: 350,
      y: 195,
      width: 210,
      height: 145,
      labelX: 455,
      labelY: 268,
      dimensionText: '72m x 45m // RESEARCH LABS',
      roomsSchematic: [
        { x: 360, y: 205, w: 90, h: 60 },
        { x: 460, y: 205, w: 90, h: 60 },
        { x: 360, y: 275, w: 90, h: 55 },
        { x: 460, y: 275, w: 90, h: 55 },
      ],
    },
    library: {
      x: 585,
      y: 195,
      width: 155,
      height: 145,
      labelX: 662,
      labelY: 268,
      dimensionText: '58m x 38m // ARCHIVES',
      roomsSchematic: [
        { x: 595, y: 205, w: 135, h: 60 },
        { x: 595, y: 275, w: 65, h: 55 },
        { x: 668, y: 275, w: 62, h: 55 },
      ],
    },

    // Bottom Row: Public & Admin
    admin_block: {
      x: 60,
      y: 370,
      width: 320,
      height: 115,
      labelX: 220,
      labelY: 428,
      dimensionText: '52m x 30m // BURSARY & EXEC',
      roomsSchematic: [
        { x: 70, y: 380, w: 95, h: 95 },
        { x: 175, y: 380, w: 95, h: 95 },
        { x: 280, y: 380, w: 90, h: 95 },
      ],
    },
    canteen: {
      x: 410,
      y: 370,
      width: 330,
      height: 115,
      labelX: 575,
      labelY: 428,
      dimensionText: '48m x 32m // FOOD COMMONS',
      roomsSchematic: [
        { x: 420, y: 380, w: 185, h: 95 },
        { x: 615, y: 380, w: 115, h: 95 },
      ],
    },
  };

  return (
    <div className="blueprint-card rounded-md bg-white dark:bg-[#151D19] border border-[#E2DCD0] dark:border-[#24322B] overflow-hidden shadow-xs">
      {/* Blueprint Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF8F3] dark:bg-[#18231E]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded border border-[#2D6A6C]/30 bg-[#2D6A6C]/10 dark:bg-[#4EA896]/15 text-[#2D6A6C] dark:text-[#4EA896]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-[#1C201E] dark:text-[#F1EFEA] uppercase font-mono">
                CAMPUS STATUS MAP
              </h2>
              <span className="text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] px-1.5 py-0.5 rounded bg-white dark:bg-[#151D19] border border-[#E2DCD0] dark:border-[#24322B]">
                CAD-PLAN // REV 2026.4
              </span>
            </div>
            <p className="text-xs text-[#646E68] dark:text-[#8E9B93]">
              Real-time architectural facility visualization & active issue density
            </p>
          </div>
        </div>

        {/* Legend Indicator Pills / Unboxed Status Items */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-muted text-[11px] font-medium text-[#646E68] dark:text-[#8E9B93]">
              Nominal (0)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-muted text-[11px] font-medium text-[#646E68] dark:text-[#8E9B93]">
              Low/Medium Active
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
            <span className="text-muted text-[11px] font-medium text-[#646E68] dark:text-[#8E9B93]">
              High Priority
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0 animate-pulse" />
            <span className="text-muted text-[11px] font-medium text-[#646E68] dark:text-[#8E9B93]">
              Urgent Issue
            </span>
          </div>
        </div>
      </div>

      {/* Main Map Content: Split into Visualization Canvas and Detail Inspection Sidecar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left: Interactive Blueprint Campus Map */}
        <div className="lg:col-span-8 p-4 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2DCD0] dark:border-[#24322B] bg-[#F7F5EE] dark:bg-[#121A16] overflow-x-auto">
          {/* Subtle Technical Map Controls & Filters */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E2DCD0]/60 dark:border-[#24322B]/60 text-xs text-[#646E68] dark:text-[#8E9B93]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#2D6A6C] dark:text-[#4EA896] uppercase font-semibold">
                CAMPUS INFRASTRUCTURE MATRIX:
              </span>
              <span className="font-mono text-[11px]">7 BLOCKS MONITORED</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBlueprintGrid(!showBlueprintGrid)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
                  showBlueprintGrid
                    ? 'bg-[#1B4332] text-white border-[#1B4332] dark:bg-[#347A57] dark:border-[#347A57]'
                    : 'bg-white dark:bg-[#151D19] border-[#E2DCD0] dark:border-[#24322B] text-[#646E68] dark:text-[#8E9B93]'
                }`}
              >
                GRID {showBlueprintGrid ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => handleSelectBlock(null)}
                className="px-2 py-1 rounded text-[11px] font-mono bg-white dark:bg-[#151D19] border border-[#E2DCD0] dark:border-[#24322B] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                RESET FOCUS
              </button>
            </div>
          </div>

          {/* SVG Campus Floor-plan Visualization */}
          <div className="relative w-full aspect-[800/520] min-w-[580px] select-none rounded bg-[#FAF9F5] dark:bg-[#141C18] border border-[#E2DCD0] dark:border-[#24322B]">
            {/* Blueprint Grid Lines inside CAD Canvas */}
            {showBlueprintGrid && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30" 
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(45,106,108,0.12) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(45,106,108,0.12) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
            )}

            <svg
              viewBox="0 0 800 520"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Campus Perimeter & Technical Coordinates */}
              <rect
                x="20"
                y="15"
                width="760"
                height="490"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                className="text-[#646E68]/30 dark:text-[#8E9B93]/30"
              />

              {/* Campus Roads and Walkways Pathway lines */}
              <g stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" className="text-[#2D6A6C]/25 dark:text-[#4EA896]/30">
                {/* Horizontal main campus spine boulevard */}
                <line x1="30" y1="175" x2="770" y2="175" />
                <line x1="30" y1="352" x2="770" y2="352" />
                {/* Vertical walkways */}
                <line x1="300" y1="20" x2="300" y2="500" />
                <line x1="570" y1="180" x2="570" y2="350" />
                <line x1="395" y1="360" x2="395" y2="500" />
              </g>

              {/* Pathway Walkway Text Labels */}
              <g className="font-mono text-[8px] fill-current text-[#646E68]/50 dark:text-[#8E9B93]/50">
                <text x="310" y="170">NORTH CONCOURSE WALKWAY</text>
                <text x="310" y="347">CENTRAL QUADRANGLE COMMONS</text>
                <text x="38" y="500">CAMPUS SOUTH GATEWAY (MAIN ACCESS)</text>
              </g>

              {/* Campus Blocks Rendering */}
              {blocks.map((block) => {
                const geom = blockCoordinates[block.id];
                if (!geom) return null;
                const stats = getBlockStats(block.id);
                const isSelected = selectedBlockId === block.id;
                const isHovered = hoveredBlockId === block.id;

                return (
                  <g
                    key={block.id}
                    onClick={() => handleSelectBlock(block.id)}
                    onMouseEnter={() => setHoveredBlockId(block.id)}
                    onMouseLeave={() => setHoveredBlockId(null)}
                    className="cursor-pointer transition-all duration-150"
                  >
                    {/* Building Shadow / Depth */}
                    <rect
                      x={geom.x + 3}
                      y={geom.y + 3}
                      width={geom.width}
                      height={geom.height}
                      className="fill-black/5 dark:fill-black/30"
                      rx="2"
                    />

                    {/* Outer Building Footprint Walls */}
                    <rect
                      x={geom.x}
                      y={geom.y}
                      width={geom.width}
                      height={geom.height}
                      rx="2"
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.5'}
                      stroke={
                        isSelected
                          ? '#1B4332'
                          : stats.statusTheme.color
                      }
                      fill={
                        isSelected
                          ? 'rgba(45, 106, 108, 0.16)'
                          : isHovered
                          ? 'rgba(45, 106, 108, 0.10)'
                          : 'rgba(255, 255, 255, 0.85)'
                      }
                      className={`dark:fill-[#18231E]/90 transition-colors ${
                        stats.highestPriority === 'Urgent'
                          ? 'animate-pulse'
                          : ''
                      }`}
                    />

                    {/* Inner CAD room partitions / wall structural geometry */}
                    {geom.roomsSchematic.map((room, rIdx) => (
                      <rect
                        key={rIdx}
                        x={room.x}
                        y={room.y}
                        width={room.w}
                        height={room.h}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeDasharray="2 2"
                        className="text-[#646E68]/30 dark:text-[#8E9B93]/35"
                      />
                    ))}

                    {/* CAD Corner tick markers */}
                    <path
                      d={`M ${geom.x - 4} ${geom.y} L ${geom.x + 4} ${geom.y} M ${geom.x} ${geom.y - 4} L ${geom.x} ${geom.y + 4}`}
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-[#2D6A6C] dark:text-[#4EA896]"
                    />
                    <path
                      d={`M ${geom.x + geom.width - 4} ${geom.y + geom.height} L ${geom.x + geom.width + 4} ${geom.y + geom.height} M ${geom.x + geom.width} ${geom.y + geom.height - 4} L ${geom.x + geom.width} ${geom.y + geom.height + 4}`}
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-[#2D6A6C] dark:text-[#4EA896]"
                    />

                    {/* Block Code & Dimension Line Text */}
                    <text
                      x={geom.x + 10}
                      y={geom.y + 18}
                      className="font-mono text-[10px] font-bold fill-current text-[#1C201E] dark:text-[#F1EFEA]"
                    >
                      {block.code}
                    </text>
                    <text
                      x={geom.x + 10}
                      y={geom.y + 28}
                      className="font-mono text-[8px] fill-current text-[#646E68] dark:text-[#8E9B93]"
                    >
                      {geom.dimensionText}
                    </text>

                    {/* Block Primary Title */}
                    <text
                      x={geom.labelX}
                      y={geom.labelY}
                      textAnchor="middle"
                      className="text-[13px] font-bold tracking-wider fill-current text-[#1C201E] dark:text-[#F1EFEA]"
                    >
                      {block.name}
                    </text>

                    {/* Floor Count / Capacity Subtitle */}
                    <text
                      x={geom.labelX}
                      y={geom.labelY + 14}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-current text-[#646E68] dark:text-[#8E9B93]"
                    >
                      {block.floorsCount} FLOORS // {block.totalRooms} ROOMS
                    </text>

                    {/* Status Indicator Marker inside block */}
                    <g transform={`translate(${geom.x + geom.width - 24}, ${geom.y + 16})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="6"
                        fill={stats.statusTheme.color}
                      />
                      {stats.activeCount > 0 ? (
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          className="font-mono text-[8px] font-bold fill-white"
                        >
                          {stats.activeCount}
                        </text>
                      ) : (
                        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                      )}
                    </g>

                    {/* Selected Box Perimeter Accent Lines */}
                    {isSelected && (
                      <rect
                        x={geom.x - 3}
                        y={geom.y - 3}
                        width={geom.width + 6}
                        height={geom.height + 6}
                        fill="none"
                        stroke="#2D6A6C"
                        strokeWidth="1.2"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Compass & Technical Metadata Footer on CAD Canvas */}
          <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2D6A6C] dark:text-[#4EA896]" />
                CAMPUS MASTERPLAN DATUM 42°18'N 71°04'W
              </span>
              <span>·</span>
              <span>SCALE 1:500 ARCHITECTURAL</span>
            </div>
            <div>CLICK ANY BLOCK TO INSPECT MAINTENANCE TELEMETRY</div>
          </div>
        </div>

        {/* Right: Selected Block Detail Inspection Panel */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white dark:bg-[#151D19]">
          {selectedBlockInfo && selectedStats ? (
            <div className="space-y-4">
              {/* Inspection Header */}
              <div className="pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#1B2420] text-[#2D6A6C] dark:text-[#4EA896] border border-[#E2DCD0] dark:border-[#24322B]">
                    {selectedBlockInfo.code}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: selectedStats.statusTheme.color }} 
                    />
                    <span className="font-mono text-[11px] uppercase" style={{ color: selectedStats.statusTheme.color }}>
                      {selectedStats.statusTheme.label}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
                  {selectedBlockInfo.name}
                </h3>
                <p className="text-xs text-[#646E68] dark:text-[#8E9B93] leading-relaxed mt-0.5">
                  {selectedBlockInfo.subTitle}
                </p>
              </div>

              {/* Quick Facility Metric Specs */}
              <div className="grid grid-cols-3 gap-2 py-2 text-center border-b border-[#E2DCD0] dark:border-[#24322B]">
                <div className="px-2 py-1.5 rounded bg-[#FAF9F5] dark:bg-[#1A241F]">
                  <div className="text-[10px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase">
                    Floors
                  </div>
                  <div className="text-sm font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
                    {selectedBlockInfo.floorsCount}
                  </div>
                </div>
                <div className="px-2 py-1.5 rounded bg-[#FAF9F5] dark:bg-[#1A241F]">
                  <div className="text-[10px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase">
                    Rooms
                  </div>
                  <div className="text-sm font-bold font-tabular text-[#1C201E] dark:text-[#F1EFEA]">
                    {selectedBlockInfo.totalRooms}
                  </div>
                </div>
                <div className="px-2 py-1.5 rounded bg-[#FAF9F5] dark:bg-[#1A241F]">
                  <div className="text-[10px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase">
                    Active Issues
                  </div>
                  <div className={`text-sm font-bold font-tabular ${
                    selectedStats.activeCount > 0 ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#16A34A] dark:text-emerald-400'
                  }`}>
                    {selectedStats.activeCount}
                  </div>
                </div>
              </div>

              {/* Highest Priority & Supervisor Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#646E68] dark:text-[#8E9B93]">
                  <span>Highest Priority:</span>
                  <span className={`font-mono font-semibold ${
                    selectedStats.highestPriority === 'Urgent'
                      ? 'text-rose-600 dark:text-rose-400'
                      : selectedStats.highestPriority === 'High'
                      ? 'text-orange-600 dark:text-orange-400'
                      : selectedStats.highestPriority === 'Medium'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {selectedStats.highestPriority === 'None' ? 'None (All Clear)' : selectedStats.highestPriority.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start justify-between text-[#646E68] dark:text-[#8E9B93]">
                  <span>Supervisor:</span>
                  <span className="text-right text-[#1C201E] dark:text-[#F1EFEA] font-medium max-w-[190px]">
                    {selectedBlockInfo.supervisor}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#646E68] dark:text-[#8E9B93]">
                  <span>Assigned Staff:</span>
                  <span className="text-[#1C201E] dark:text-[#F1EFEA] font-medium">
                    {selectedStats.assignedStaff.length > 0
                      ? selectedStats.assignedStaff.join(', ')
                      : 'None on site'}
                  </span>
                </div>
              </div>

              {/* Category Distribution */}
              {selectedStats.activeCount > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#E2DCD0] dark:border-[#24322B]">
                  <span className="text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase">
                    Active Categories Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selectedStats.categoryCount).map(([cat, count]) => (
                      <span
                        key={cat}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#1A241F] border border-[#E2DCD0] dark:border-[#24322B] text-[#1C201E] dark:text-[#F1EFEA]"
                      >
                        {cat}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Issue for this Block */}
              <div className="pt-2 border-t border-[#E2DCD0] dark:border-[#24322B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase">
                    Active Complaints ({selectedStats.activeCount})
                  </span>
                </div>

                {selectedStats.allBlockComplaints.length === 0 ? (
                  <div className="py-4 text-center rounded bg-[#FAF9F5] dark:bg-[#18231E] border border-dashed border-[#E2DCD0] dark:border-[#24322B]">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                    <p className="text-xs font-medium text-[#1C201E] dark:text-[#F1EFEA]">
                      No Active Maintenance Issues
                    </p>
                    <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93]">
                      All mechanical, electrical & civil systems nominal.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                    {selectedStats.allBlockComplaints.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectComplaint(item)}
                        className="p-2.5 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-[#FAF9F5] dark:bg-[#1A241F] hover:border-[#2D6A6C] dark:hover:border-[#4EA896] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-[#2D6A6C] dark:text-[#4EA896] font-semibold">
                            {item.id}
                          </span>
                          <span className="text-[#646E68] dark:text-[#8E9B93]">
                            ● {item.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#1C201E] dark:text-[#F1EFEA] line-clamp-1 group-hover:text-[#2D6A6C] dark:group-hover:text-[#4EA896]">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-[#646E68] dark:text-[#8E9B93] mt-1.5">
                          <span>{item.locationDetails}</span>
                          <span className="flex items-center gap-0.5 text-[#2D6A6C] dark:text-[#4EA896]">
                            View Docket <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[#646E68] dark:text-[#8E9B93]">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Select a campus block</p>
              <p className="text-xs">Click any block on the blueprint map to view technical telemetry.</p>
            </div>
          )}

          {/* Quick Action Button */}
          {selectedBlockInfo && (
            <div className="pt-4 mt-3 border-t border-[#E2DCD0] dark:border-[#24322B]">
              <button
                onClick={() => onNewComplaintForBlock(selectedBlockInfo.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] dark:hover:bg-[#3F9369] rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                Log Issue for {selectedBlockInfo.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
