import React from 'react';

export const BlueprintBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" 
      aria-hidden="true"
    >
      {/* Base architectural CAD grid pattern */}
      <div className="absolute inset-0 blueprint-grid-bg opacity-70" />

      {/* SVG Architectural vector blueprints: subtle building outlines, measurement lines, survey markers */}
      <svg 
        className="absolute inset-0 w-full h-full stroke-current text-[#1B4332] dark:text-[#4EA896] opacity-[0.045] dark:opacity-[0.065]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cad-dots" width="64" height="64" patternUnits="userSpaceOnUse">
            <circle cx="32" cy="32" r="0.6" fill="currentColor" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cad-dots)" />

        {/* Outer boundary coordinate survey crosshairs */}
        <g strokeWidth="0.8">
          <path d="M 60 40 L 60 60 M 50 50 L 70 50" />
          <path d="M 500 50 L 520 50 M 510 40 L 510 60" />
          <path d="M 1200 50 L 1220 50 M 1210 40 L 1210 60" />
          <path d="M 60 700 L 60 720 M 50 710 L 70 710" />
          <path d="M 1200 700 L 1220 700 M 1210 690 L 1210 710" />
        </g>

        {/* Faint campus perimeter boundary dashed lines */}
        <path 
          d="M 120 120 H 1340 V 820 H 120 Z" 
          strokeDasharray="8 6" 
          strokeWidth="0.8" 
        />

        {/* Architectural dimension lines and measurement leaders */}
        <g strokeWidth="0.75" className="font-mono text-[9px] fill-current">
          {/* Top dimension line */}
          <line x1="180" y1="95" x2="680" y2="95" />
          <line x1="180" y1="90" x2="180" y2="100" />
          <line x1="680" y1="90" x2="680" y2="100" />
          <text x="430" y="90" textAnchor="middle" stroke="none">240.00m EAST-WEST AXIS</text>

          {/* Vertical dimension line */}
          <line x1="95" y1="160" x2="95" y2="600" />
          <line x1="90" y1="160" x2="100" y2="160" />
          <line x1="90" y1="600" x2="100" y2="600" />
          <text x="85" y="380" textAnchor="middle" transform="rotate(-90 85 380)" stroke="none">185.50m NORTH-SOUTH TRANSECT</text>
        </g>

        {/* Subtle schematic building footprints in background */}
        <g strokeWidth="0.9">
          {/* Main Academic Complex footprint schematic */}
          <rect x="220" y="160" width="280" height="180" strokeDasharray="3 3" />
          <rect x="250" y="180" width="220" height="140" strokeWidth="0.5" />
          <line x1="220" y1="160" x2="250" y2="180" strokeWidth="0.5" />
          <line x1="500" y1="160" x2="470" y2="180" strokeWidth="0.5" />
          <line x1="220" y1="340" x2="250" y2="320" strokeWidth="0.5" />
          <line x1="500" y1="340" x2="470" y2="320" strokeWidth="0.5" />

          {/* Research & Lab Wing footprint schematic */}
          <rect x="620" y="160" width="240" height="200" strokeDasharray="4 2" />
          <circle cx="740" cy="260" r="45" strokeWidth="0.5" />

          {/* Library Quadrangle schematic */}
          <rect x="940" y="180" width="220" height="160" strokeDasharray="2 4" />
          <line x1="940" y1="260" x2="1160" y2="260" strokeWidth="0.5" />
          <line x1="1050" y1="180" x2="1050" y2="340" strokeWidth="0.5" />

          {/* Sports area circular running track curve */}
          <ellipse cx="1060" cy="560" rx="140" ry="90" strokeWidth="0.6" strokeDasharray="5 5" />
          <ellipse cx="1060" cy="560" rx="110" ry="65" strokeWidth="0.4" />

          {/* Technical coordinate labels */}
          <g className="font-mono text-[8px] fill-current" stroke="none">
            <text x="230" y="152">ZONE A1 // ACADEMIC</text>
            <text x="630" y="152">ZONE L2 // RESEARCH LABS</text>
            <text x="950" y="172">ZONE C3 // KNOWLEDGE CORE</text>
            <text x="1000" y="680">ZONE S4 // ATHLETICS COMPLEX</text>
          </g>
        </g>

        {/* North symbol and blueprint scale index */}
        <g transform="translate(1360, 90)" strokeWidth="0.8">
          <circle cx="0" cy="0" r="18" strokeWidth="0.6" />
          <line x1="0" y1="-24" x2="0" y2="24" />
          <line x1="-24" y1="0" x2="24" y2="0" />
          <polygon points="0,-22 4,-10 0,-13 -4,-10" fill="currentColor" stroke="none" />
          <text x="0" y="-28" textAnchor="middle" className="font-mono text-[9px] font-bold fill-current" stroke="none">N</text>
        </g>
      </svg>
    </div>
  );
};
