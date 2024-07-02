import React, { useState } from 'react';

const Dropdown = ({ title = 'title', onSelect, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative">
      <button
        id="dropdownNavbarLink"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 px-3 text-zinc-900 rounded hover:bg-zinc-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-zinc-700 dark:hover:bg-zinc-700 md:dark:hover:bg-transparent"
      >
        {title}
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          id="dropdownNavbar"
          className="z-10 font-normal bg-white divide-y divide-zinc-100 rounded-lg shadow w-44 dark:bg-zinc-700 dark:divide-zinc-600 absolute mt-2"
        >
          <ul className="py-2 text-sm text-zinc-700 dark:text-zinc-400" aria-labelledby="dropdownLargeButton">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleOptionClick(option)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { Dropdown };