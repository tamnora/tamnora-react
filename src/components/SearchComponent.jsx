import React, { useEffect, useRef, useState } from 'react';
import { inputColor, inputOutline } from '../js/tamnora';

const SearchComponent = ({ onSearchChange, onEnter, myRef, name = 'inputSearch', placeholder = 'Buscar ...', outline = 'default' }) => {
  const [textoBuscar, setTextoBuscar] = useState('');
  const [myPlaceHolder, setMyPlaceHolder] = useState(placeholder)
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTextoBuscar(newValue);
    onSearchChange(newValue);
  };

  const typesOutlines = {
    default: 'focus:outline focus:outline-zinc-600/50 dark:focus:outline-zinc-100/50 outline-offset-0',
    blue: 'focus:outline focus:outline-blue-500 dark:focus:outline-blue-600 outline-offset-0',
    red: 'focus:outline focus:outline-red-500 dark:focus:outline-red-600 outline-offset-0',
    green: 'focus:outline focus:outline-green-500 dark:focus:outline-green-600 outline-offset-0',
    yellow: 'focus:outline focus:outline-yellow-500 dark:focus:outline-yellow-600 outline-offset-0',
    sky: 'focus:outline focus:outline-sky-500 dark:focus:outline-sky-600 outline-offset-0',
    emerald: 'focus:outline focus:outline-emerald-500 dark:focus:outline-emerald-600 outline-offset-0',
    violet: 'focus:outline focus:outline-violet-500 dark:focus:outline-violet-600 outline-offset-0',
    purple: 'focus:outline focus:outline-purple-500 dark:focus:outline-purple-600 outline-offset-0',
    orange: 'focus:outline focus:outline-orange-500 dark:focus:outline-orange-600 outline-offset-0',
    amber: 'focus:outline focus:outline-amber-500 dark:focus:outline-amber-600 outline-offset-0',
    lime: 'focus:outline focus:outline-lime-500 dark:focus:outline-lime-600 outline-offset-0',
    teal: 'focus:outline focus:outline-teal-500 dark:focus:outline-teal-600 outline-offset-0',
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (onEnter) {
          onEnter();
        }
        break;
      default:
        break;
    }
  }

 

  const searchElement = searchRef.current;

  if (searchElement) {
    searchElement.addEventListener('keydown', handleKeyDown);
  }

  if (myRef) {
    myRef(searchRef);
  }

  return (
    <div className="relative w-full sm:max-w-96 ">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500 dark:text-zinc-400 ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        ref={searchRef}
        type="search"
        name={name}
        autoComplete="off"
        className={`block w-full ring-0 py-3 px-3 ps-10 text-sm text-zinc-800 dark:text-zinc-100 font-normal rounded-lg shadow-sm bg-white dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700  ${typesOutlines[outline]}`}
        placeholder={myPlaceHolder}
        value={textoBuscar}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      
    </div>
  );
};

export { SearchComponent };
