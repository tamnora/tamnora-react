import React from 'react';

const Tab = ({ className = '', children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export { Tab };
