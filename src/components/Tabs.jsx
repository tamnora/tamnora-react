import React, { useState, useEffect } from 'react';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        const key = event.key.toLowerCase();
        const tabIndex = children.findIndex((tab) => tab.props.accessKey.toLowerCase() === key);
        if (tabIndex !== -1) {
          setActiveTab(tabIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [children]);

  return (
    <div>
      <div className="flex border-b border-zinc-200 dark:border-zinc-700/70">
        {children.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 -mb-px text-sm font-medium border-b transition-colors duration-500 ${
              activeTab === index ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-zinc-500 hover:text-zinc-600 hover:border-zinc-600 dark:hover:text-zinc-200 dark:hover:border-zinc-200'
            }`}
            onClick={() => handleTabClick(index)}
            aria-label={`Alt+${tab.props.accessKey}`}
          >
            {tab.props.label} {tab.props.accessKey && <span className='pl-2 text-xs text-zinc-400 dark:text-zinc-700 hover:text-zinc-600'>[Alt+{tab.props.accessKey}]</span>}
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
