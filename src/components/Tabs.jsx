import React, { useState, useEffect } from 'react';

const Tabs = ({ 
  children, 
  textClass = 'text-sm font-medium',
  colorActive = 'border-sky-500 text-sky-600 dark:text-sky-500', 
  colorInactive = 'border-transparent text-zinc-500 hover:text-zinc-600 hover:border-zinc-600 dark:hover:text-zinc-200 dark:hover:border-zinc-200', 
}) => {
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
            className={`flex items-center gap-2 pl-2 pr-6 py-2 -mb-px ${textClass} border-b transition-colors duration-500 ${
              activeTab === index ? colorActive : colorInactive
            }`}
            onClick={() => handleTabClick(index)}
            aria-label={`Alt+${tab.props.accessKey}`}
          >
            {tab.props.position !== 'right' && tab.props.icon}
            {tab.props.label}
            {tab.props.accessKey && tab.props.showAccessKey  && <span className='border border-zinc-400 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-400 dark:text-zinc-700 hover:text-zinc-600'>{tab.props.accessKey}</span>}
            {tab.props.position === 'right' && tab.props.icon}
          </button>
        ))}
      </div>
      <div className="pt-6 pb-3">
        {children[activeTab]}
      </div>
    </div>
  );
};

export { Tabs };


