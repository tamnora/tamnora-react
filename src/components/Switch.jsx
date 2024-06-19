import React, { useState } from 'react';

const Switch = ({ name, title, color='blue', size='sm', onChange, defaultChecked = false }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const colorTheme = {
    blue: `peer-checked:bg-blue-600 after:bg-white dark:after:bg-zinc-800 after:border-zinc-300 dark:after:border-zinc-600 peer-checked:after:border-blue-400`,
    zinc: `peer-checked:bg-zinc-600 after:bg-white dark:after:bg-zinc-800 after:border-zinc-300 dark:after:border-zinc-600 peer-checked:after:border-zinc-400`,
    red: `peer-checked:bg-red-600 after:bg-white dark:after:bg-zinc-800 after:border-zinc-300 dark:after:border-zinc-600 peer-checked:after:border-red-400`,
    yellow: `peer-checked:bg-yellow-600 after:bg-white dark:after:bg-zinc-800 after:border-zinc-300 dark:after:border-zinc-600 peer-checked:after:border-yellow-400`,
    sky: `peer-checked:bg-sky-600 after:bg-white dark:after:bg-zinc-800 after:border-zinc-300 dark:after:border-zinc-600 peer-checked:after:border-sky-400`,
    black: ``,
    white: ``,
    zinc: ``,
    emerald: `peer-checked:bg-emerald-600 after:bg-white dark:after:bg-zinc-800 after:border-zinc-300 dark:after:border-zinc-600 peer-checked:after:border-emerald-400`
  };

  const colorFocus = {
    blue: `peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 `,
    zinc: `peer-focus:ring-zinc-500 dark:peer-focus:ring-zinc-800 `,
    red: `peer-focus:ring-red-500 dark:peer-focus:ring-red-800 `,
    yellow: `peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-800 `,
    sky: `peer-focus:ring-sky-500 dark:peer-focus:ring-sky-800 `,
    black: ``,
    white: ``,
    zinc: ``,
    emerald: `peer-focus:ring-emerald-500 dark:peer-focus:ring-emerald-800 `
  };

  const textSize = {
    xs: `text-xs`,
    sm: `text-sm`,
    md: `text-base`,
    lg: `text-lg`,
    xl: `text-xl`
  }

  const iconSize = {
    xs: `w-6 h-3 after:top-0.5 after:left-[1px] after:h-3 after:w-3`,
    sm: `w-8 h-4 after:top-0.5 after:left-[1px] after:h-4 after:w-4`,
    md: `w-10 h-5 after:top-0.5 after:left-[1px] after:h-5 after:w-5`,
    lg: `w-12 h-6 after:top-0.5 after:left-[1px] after:h-6 after:w-6`,
    xl: `w-16 h-8 after:top-0.3 after:left-[1px] after:h-8 after:w-8`
  }

  const handleToggle = () => {
    let valorActual = false;
    if(!isChecked){
      valorActual = true;
    } 
    setIsChecked(!isChecked);
    if(onChange){
      onChange(valorActual)
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer mr-6 w-fit">
      <input
        name={name}
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div
        className={`${iconSize[size]} bg-zinc-300 dark:bg-zinc-700 rounded-full peer peer-focus:ring-2 ${
          isChecked ? colorFocus[color] : 'peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-800'
        } peer-checked:after:translate-x-full  after:content-[''] after:absolute  after:border after:rounded-full  after:transition-all  ${colorTheme[color]}`}
      ></div>
      {title && (
        <span className={`${textSize[size]} text-neutral-900 dark:text-neutral-300 ml-2`}>
        {title}
      </span>
      )}
    </label>
  );
};

export {Switch};
