import React from 'react';

const Tooltip = ({ 
  children, 
  content ="default content", 
  size = 'md', 
  color = 'default', 
  radius = 'rounded-full', 
  placement = 'top' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-3 py-1'
  };

  const colorClasses = {
    default: 'bg-white/30 dark:bg-black/20 text-black dark:text-white',
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    danger: 'bg-red-600 text-white'
  };

  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1.5',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-1.5',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-1.5'
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute whitespace-no-wrap shadow-lg z-10 hidden group-hover:block tmn-fadeIn transition-opacity duration-300 backdrop-filter backdrop-blur-xl
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${radius}
        ${placementClasses[placement]}`}
        >
        {content}
      </div>
    </div>
  );
};

export {Tooltip};
