import React from 'react';

/**
 * WindToyIcon Component
 * 
 * Displays an animated spinning wind-toy style SVG icon.
 * 
 * @param {number} size - Width & height of the icon in pixels (default: 24)
 * @param {string} color - Fill color of the icon (default: 'currentColor')
 * @param {object} props - Any additional props to spread on the SVG
 *
 * @returns {JSX.Element} Animated SVG icon
 */
export const WindToyIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    {...props}
  >
    {/* Path with animateTransform to create continuous rotation */}
    <path
      fill="currentColor"
      d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61... (truncated for clarity) ..."
    >
      <animateTransform 
        attributeName="transform"
        dur="1.5s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </path>
  </svg>
);
