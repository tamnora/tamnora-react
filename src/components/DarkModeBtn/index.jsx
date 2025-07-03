import { useState, useEffect } from 'react';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

export function DarkModeBtn({
  bgColor = 'bg-white dark:bg-zinc-800',
  textColor = 'text-zinc-800 dark:text-zinc-200',
}) {
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
      className={`p-1.5 rounded-full transition-colors duration-200 h-fit w-fit ${bgColor} ${textColor}`}>
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}