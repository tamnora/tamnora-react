import React, { useEffect, useRef, useState } from 'react';

const SearchComponent = ({ onSearchChange, onEnter, myRef, name='inputSearch' }) => {
  const [textoBuscar, setTextoBuscar] = useState('');
  const [myPlaceHolder, setMyPlaceHolder] = useState('Buscar...')
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTextoBuscar(newValue);
    onSearchChange(newValue);
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
        className="block w-full py-2 px-3 ps-10 text-sm text-zinc-800 dark:text-zinc-100 font-normal rounded-lg shadow-sm bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus:outline focus:outline-sky-500 dark:focus:outline-sky-700 focus:ring-blue-500 focus:border-sky-500 dark:focus:ring-sky-700 dark:focus:border-sky-700"
        placeholder={myPlaceHolder}
        value={textoBuscar}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export { SearchComponent };
