
import React from 'react';

// This is a simplified artistic representation of the logo based on its description.
export const CUSTLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Gear Border - Brown */}
    <circle cx="50" cy="50" r="45" className="stroke-cust-brown" strokeWidth="6" />
    {[...Array(12)].map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="5"
        x2="50"
        y2="0"
        transform={`rotate(${i * 30}, 50, 50)`}
        className="stroke-cust-brown"
        strokeWidth="6"
      />
    ))}
    
    {/* Atom Symbol - Blue */}
    <g className="stroke-cust-blue" transform="rotate(30 50 50)">
      <ellipse cx="50" cy="50" rx="30" ry="12" />
      <ellipse cx="50" cy="50" rx="30" ry="12" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="30" ry="12" transform="rotate(120 50 50)" />
      <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
    </g>

    {/* Open Book - Green */}
    <path
      d="M30 75 Q 50 65, 70 75 L 70 30 Q 50 40, 30 30 Z"
      className="stroke-cust-green fill-white"
    />
    <line x1="50" y1="35" x2="50" y2="75" className="stroke-cust-green" />
  </svg>
);
