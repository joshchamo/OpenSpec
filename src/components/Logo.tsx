import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      width="36" 
      height="26" 
      viewBox="0 0 36 26" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background & Border */}
      <rect width="36" height="26" rx="8" fill="white" fillOpacity="0.05"/>
      <rect x="0.5" y="0.5" width="35" height="25" rx="7.5" stroke="white" strokeOpacity="0.1"/>
      
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1"/>
          <stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>

      {/* Left Bracket - Drawn exactly to frame the S */}
      <path 
        d="M 12.5 6.5 Q 8.5 6.5 8.5 10 Q 8.5 13 11 13 Q 8.5 13 8.5 16 Q 8.5 19.5 12.5 19.5" 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Right Bracket */}
      <path 
        d="M 23.5 6.5 Q 27.5 6.5 27.5 10 Q 27.5 13 25 13 Q 27.5 13 27.5 16 Q 27.5 19.5 23.5 19.5" 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Central Slash - connecting bottom-left to top-right */}
      <path 
        d="M 12.5 20.5 L 23.5 5.5" 
        stroke="url(#logoGrad)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
