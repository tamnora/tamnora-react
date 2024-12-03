import React, { useState, useEffect } from 'react';

const RadioGroup = ({ options, name, color = 'blue', orientation = 'horizontal', size = 'sm', onChange, defaultValue = null }) => {
  const isHorizontal = orientation === 'horizontal';
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  
  const textSize = {
    xs: `text-xs`,
    sm: `text-sm`,
    md: `text-base`,
    lg: `text-lg`,
    xl: `text-xl`
  }

  const iconSize = {
    xs: `h-3 w-3`,
    sm: `h-4 w-4`,
    md: `h-4 w-4`,
    lg: `h-5 w-5`,
    xl: `h-6 w-6`
  }

  const listColor = {
    blue: `checked:bg-blue-500 dark:checked:bg-blue-600 checked:ring-2 checked:ring-blue-500 checked:hover:ring-blue-300 dark:checked:ring-blue-600 dark:checked:hover:ring-blue-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    zinc: `checked:bg-zinc-500 dark:checked:bg-zinc-600 checked:ring-2 checked:ring-zinc-500 checked:hover:ring-zinc-300 dark:checked:ring-zinc-600 dark:checked:hover:ring-zinc-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    red: `checked:bg-red-500 dark:checked:bg-red-600 checked:ring-2 checked:ring-red-500 checked:hover:ring-red-300 dark:checked:ring-red-600 dark:checked:hover:ring-red-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    yellow: `checked:bg-yellow-500 dark:checked:bg-yellow-600 checked:ring-2 checked:ring-yellow-500 checked:hover:ring-yellow-300 dark:checked:ring-yellow-600 dark:checked:hover:ring-yellow-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    sky: `checked:bg-sky-500 dark:checked:bg-sky-600 checked:ring-2 checked:ring-sky-500 checked:hover:ring-sky-300 dark:checked:ring-sky-600 dark:checked:hover:ring-sky-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    neutral: `checked:bg-neutral-500 dark:checked:bg-neutral-600 checked:ring-2 checked:ring-neutral-500 checked:hover:ring-neutral-300 dark:checked:ring-neutral-600 dark:checked:hover:ring-neutral-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    lime: `checked:bg-lime-500 dark:checked:bg-lime-600 checked:ring-2 checked:ring-lime-500 checked:hover:ring-lime-500 dark:checked:ring-lime-600 dark:checked:hover:ring-lime-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    emerald: `checked:bg-emerald-500 dark:checked:bg-emerald-600 checked:ring-2 checked:ring-emerald-500 checked:hover:ring-emerald-300 dark:checked:ring-emerald-600 dark:checked:hover:ring-emerald-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    green: `checked:bg-green-500 dark:checked:bg-green-600 checked:ring-2 checked:ring-green-500 checked:hover:ring-green-300 dark:checked:ring-green-600 dark:checked:hover:ring-green-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
    purple: `checked:bg-purple-500 dark:checked:bg-purple-600 checked:ring-2 checked:ring-purple-500 checked:hover:ring-purple-300 dark:checked:ring-purple-600 dark:checked:hover:ring-purple-500 hover:ring-neutral-300 dark:hover:ring-neutral-600`,
  }

  const inputClasses = `peer relative ${iconSize[size]} shrink-0 appearance-none rounded bg-neutral-200 dark:bg-neutral-700 after:absolute after:left-0 after:top-0 after:h-full after:w-full checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPmljb25fYnlfUG9zaGx5YWtvdjEwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4wMDAwMDAsIDI2LjAwMDAwMCkiPjxwYXRoIGQ9Ik0xNy45OTk5ODc4LDMyLjQgTDEwLjk5OTk4NzgsMjUuNCBDMTAuMjI2Nzg5MSwyNC42MjY4MDE0IDguOTczMTg2NDQsMjQuNjI2ODAxNCA4LjE5OTk4Nzc5LDI1LjQgTDguMTk5OTg3NzksMjUuNCBDNy40MjY3ODkxNCwyNi4xNzMxOTg2IDcuNDI2Nzg5MTQsMjcuNDI2ODAxNCA4LjE5OTk4Nzc5LDI4LjIgTDE2LjU4NTc3NDIsMzYuNTg1Nzg2NCBDMTcuMzY2ODIyOCwzNy4zNjY4MzUgMTguNjMzMTUyOCwzNy4zNjY4MzUgMTkuNDE0MjAxNCwzNi41ODU3ODY0IEw0MC41OTk5ODc4LDE1LjQgQzQxLjM3MzE4NjQsMTQuNjI2ODAxNCA0MS4zNzMxODY0LDEzLjM3MzE5ODYgNDAuNTk5OTg3OCwxMi42IEw0MC41OTk5ODc4LDEyLjYgQzM5LjgyNjc4OTEsMTEuODI2ODAxNCAzOC41NzMxODY0LDExLjgyNjgwMTQgMzcuNzk5OTg3OCwxMi42IEwxNy45OTk5ODc4LDMyLjQgWiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==')] after:bg-[length:30px] after:bg-center after:bg-no-repeat after:content-[''] ${listColor[color]} hover:ring-2  focus:outline-none`;


  const handleOnChange = (e) => {
    setSelectedValue(e.target.value); 
    if (onChange) {
      onChange(e.target.value); 

    }
  };

   // Actualizar textoBuscar si defaultValue cambia
   useEffect(() => {
    if(defaultValue != null){
      setSelectedValue(defaultValue); 
    if (onChange) {
      onChange(defaultValue); 

    }
    }
  }, [defaultValue]);

  return (
    <div className={`flex ${isHorizontal ? 'flex-row space-x-4' : 'flex-col space-y-2'} w-fit`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center cursor-pointer ${isHorizontal ? 'space-x-2' : 'space-x-2'}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue == option.value} // marcar la opción seleccionada
            onChange={handleOnChange} // función de cambio de valor
            className={inputClasses}
          />
          <span className={`${textSize[size]} text-zinc-700 dark:text-zinc-300`}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export { RadioGroup };


