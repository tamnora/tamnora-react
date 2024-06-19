import { useState, useEffect } from 'react';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

export function DarkModeBtn() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className='bg-emerald-900 hover:bg-emerald-950 text-white p-1.5 rounded-full transition-colors duration-200 h-fit w-fit'>
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}