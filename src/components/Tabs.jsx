import React, { useState } from 'react';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="flex border-b border-neutral-200 dark:border-neutral-700/70">
        {children.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 -mb-px text-sm font-medium border-b  transition-colors duration-500 ${
              activeTab === index ? 'border-blue-500 text-blue-500' : 'border-transparent text-neutral-500 hover:text-neutral-600 hover:border-neutral-600 dark:hover:text-neutral-200 dark:hover:border-neutral-200'
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {children[activeTab]}
      </div>
    </div>
  );
};

export { Tabs };
