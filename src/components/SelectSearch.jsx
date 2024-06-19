import React, { useState } from 'react';

const SelectSearch = ({ options, selectedOption, onChange, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedOption || 'Automático');
  const [inputValue, setInputValue] = useState('');

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
    if(onSelect){
        onSelect(selected, inputValue)
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onChange) {
      onChange(selected, inputValue);
    }
  };

  return (
    <div className="flex">
      <div onClick={() => setIsOpen(!isOpen)} className="relative inline-block w-auto flex-shrink-0 z-10 py-2.5 px-2 text-sm font-medium text-zinc-500 bg-zinc-100 hover:bg-zinc-200 border-t border-b border-l border-zinc-300 rounded-l-lg dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700/50 cursor-pointer select-none">
        <div className="flex justify-start items-center relative w-full" >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"></path>
          </svg>
          <span>{selected}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ml-2 ${isOpen ? 'hidden' : ''}`}>
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ml-2 ${isOpen ? '' : 'hidden'}`}>
            <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd"></path>
          </svg>
        </div>
        {isOpen && (
          <ul className="absolute mt-3 w-full py-1 text-sm font-medium text-zinc-500 bg-white border border-zinc-300 dark:border-zinc-700/50 rounded-lg shadow-lg dark:bg-zinc-800 dark:text-zinc-300">
            {options.map((option) => (
              <li key={option} onClick={() => handleOptionClick(option)} className="px-4 py-2 hover:text-emerald-500 cursor-pointer">
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="uppercase bg-zinc-50 border border-zinc-300 text-emerald-600 text-sm font-semibold placeholder-zinc-400 rounded-r-lg focus:bg-white block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-700/50 dark:placeholder-zinc-400 dark:text-emerald-500 dark:focus:bg-zinc-800 focus:outline-none"
        placeholder=". . ."
      />
    </div>
  );
};

export {SelectSearch};
