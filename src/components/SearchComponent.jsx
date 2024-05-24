import React, { useEffect, useRef, useState } from 'react';

const SearchComponent = ({ onSearchChange, onEnter, shortcut }) => {
  const [textoBuscar, setTextoBuscar] = useState('');
  const [myPlaceHolder, setMyPlaceHolder] = useState('Buscar...')
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTextoBuscar(newValue);
    onSearchChange(newValue); // Notificar al componente padre sobre el cambio
  };
  
  const handleKeyDown = (e)=>{
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if(onEnter){
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

  useEffect(()=>{
      if(shortcut){
        setMyPlaceHolder(`${shortcut} > Buscar ...`)
        window.addEventListener('keydown', (e)=>{
          if(e.key === shortcut){
            searchRef.current.focus();
          }
        })
      }
  },[shortcut])

  return (
    <div className="relative w-full sm:max-w-96 ">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500 dark:text-zinc-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        ref={searchRef}
        type="search"
        name="search"
        autoComplete="off"
        className="block w-full py-2 px-3 ps-10 text-sm font-normal border rounded-lg outline-none shadow-sm bg-zinc-50 text-zinc-600  dark:bg-zinc-700/50 dark:text-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-500 dark:focus:border-sky-500"
        placeholder={myPlaceHolder}
        value={textoBuscar}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export { SearchComponent };
