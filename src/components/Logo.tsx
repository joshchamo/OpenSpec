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

      {/* Left Bracket - Now with the proper left-pointing beak at X=7 */}
      <path 
        d="M 13 6 Q 10 6 10 9.5 Q 10 13 7 13 Q 10 13 10 16.5 Q 10 20 13 20" 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Right Bracket - Now with the proper right-pointing beak at X=29 */}
      <path 
        d="M 23 6 Q 26 6 26 9.5 Q 26 13 29 13 Q 26 13 26 16.5 Q 26 20 23 20" 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Central Slash - Exact same height as brackets (Y: 20 to 6) */}
      <path 
        d="M 13 20 L 23 6" 
        stroke="url(#logoGrad)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
