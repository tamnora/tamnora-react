import React, { useState } from 'react';

const SearchComponent = ({ onSearchChange }) => {
  const [textoBuscar, setTextoBuscar] = useState('');

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTextoBuscar(newValue);
    onSearchChange(newValue); // Notificar al componente padre sobre el cambio
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-neutral-500 dark:text-neutral-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="search"
        name="search"
        autoComplete="off"
        className="block w-full py-2 px-3 ps-10 text-sm font-normal border rounded-lg outline-none shadow-sm bg-neutral-50 text-neutral-600 focus:border-sky-400 dark:bg-neutral-700/50 dark:text-neutral-300 dark:border-neutral-800"
        placeholder="Buscar..."
        value={textoBuscar}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchComponent;
