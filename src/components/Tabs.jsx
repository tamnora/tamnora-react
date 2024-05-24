import React, { useState } from 'react';

const Tabs = ({ ariaLabel, items, children }) => {
  const [activeTab, setActiveTab] = useState(items[0].id);

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="flex border-b border-neutral-200 dark:border-neutral-700/70">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeTab === item.id}
            className={`px-4 py-2 text-sm font-medium hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === item.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            } transition-colors ease-in-out duration-500`}
            onClick={() => handleTabClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {items.map((item) =>
          activeTab === item.id ? React.cloneElement(children(item), { key: item.id }) : null
        )}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return <div className='transition-all ease-in-out duration-500'>{children}</div>;
};

export { Tabs, Tab };

