import React from 'react';

// Card Component
const Card = ({ children }) => {
  return (
    <div className="bg-neutral-100/50 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 rounded-lg overflow-hidden transition-all ease-in-out duration-500">
      {children}
    </div>
  );
};

// CardBody Component
const CardBody = ({ children }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};

export { Card, CardBody };
