import React from 'react';

const Button = ({ color='neutral', onClick=()=>{}, fontSize = 'text-sm', widthBtn = 'w-full' , children }) => {

 const colorTheme = {
    primary: `text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl shadow-blue-600/40 hover:shadow-blue-600/60 dark:from-blue-600 dark:to-blue-700 dark:shadow-blue-800/80`,
    secondary: `text-white bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg hover:shadow-xl shadow-gray-600/40 hover:shadow-gray-600/60 dark:from-gray-600 dark:to-gray-700 dark:shadow-gray-800/80`,
    danger: `text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg hover:shadow-xl shadow-red-600/40 hover:shadow-red-600/60 dark:from-red-600 dark:to-red-700 dark:shadow-red-800/80`,
    warning: `text-white bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl shadow-yellow-600/40 hover:shadow-yellow-600/60 dark:from-yellow-600 dark:to-yellow-700 dark:shadow-yellow-800/80`,
    info: `text-white bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg hover:shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60 dark:from-blue-600 dark:to-blue-700 dark:shadow-blue-800/80`,
    black: `text-white bg-gradient-to-r from-black to-gray-800 shadow-lg hover:shadow-xl shadow-gray-800/40 hover:shadow-gray-800/60 dark:from-gray-800 dark:to-gray-900 dark:shadow-gray-900/80`,
    white: `text-black bg-gradient-to-r from-white to-gray-300 shadow-lg hover:shadow-xl shadow-gray-300/40 hover:shadow-gray-300/60 dark:from-gray-300 dark:to-gray-200 dark:shadow-gray-200/80`,
    neutral: `text-white bg-gradient-to-r from-gray-400 to-gray-500 shadow-lg hover:shadow-xl shadow-gray-500/40 hover:shadow-gray-500/60 dark:from-gray-500 dark:to-gray-600 dark:shadow-gray-600/80`,
    success: `text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60
    dark:from-emerald-600 dark:to-emerald-700 dark:shadow-emerald-800/80`
  };

  const buttonStyles = `
    flex justify-center items-center rounded-lg px-4 py-2 ${fontSize} font-medium focus:outline-none shadow-lg hover:shadow-xl active:translate-y-0.5
    transition-all duration-100 scale-95 hover:scale-100 dark:shadow-lg text-center ${colorTheme[color]} ${widthBtn}`;

  return (
    <button type="button" className={buttonStyles} onClick={onClick}>
      {children}
    </button>
  );
};

export { Button };