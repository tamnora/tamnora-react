import React, { useState } from 'react';

const RadioGroup = ({ options, name, color = 'blue', orientation = 'horizontal', size = 'sm', onChange }) => {
  const isHorizontal = orientation === 'horizontal';
  const [selectedValue, setSelectedValue] = useState(null);
  
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
    blue: `checked:bg-blue-500 dark:checked:bg-blue-600 checked:ring-1 checked:ring-blue-500 checked:hover:ring-blue-300 
      dark:checked:ring-blue-600 dark:checked:hover:ring-blue-500`,
    zinc: `checked:bg-zinc-500 dark:checked:bg-zinc-600 checked:ring-1 checked:ring-zinc-500 checked:hover:ring-zinc-300 
      dark:checked:ring-zinc-600 dark:checked:hover:ring-zinc-500`,
    red: `checked:bg-red-500 dark:checked:bg-red-600 checked:ring-1 checked:ring-red-500 checked:hover:ring-red-300 
      dark:checked:ring-red-600 dark:checked:hover:ring-red-500`,
    yellow: `checked:bg-yellow-500 dark:checked:bg-yellow-600 checked:ring-1 checked:ring-yellow-500 checked:hover:ring-yellow-300 
      dark:checked:ring-yellow-600 dark:checked:hover:ring-yellow-500`,
    sky: `checked:bg-sky-500 dark:checked:bg-sky-600 checked:ring-1 checked:ring-sky-500 checked:hover:ring-sky-300 
      dark:checked:ring-sky-600 dark:checked:hover:ring-sky-500`,
    black: ``,
    white: ``,
    zinc: ``,
    emerald: `checked:bg-emerald-500 dark:checked:bg-emerald-600 checked:ring-1 checked:ring-emerald-500 checked:hover:ring-emerald-300 
      dark:checked:ring-emerald-600 dark:checked:hover:ring-emerald-500`
  }

  const inputClasses = `
      peer relative ${iconSize[size]} shrink-0 appearance-none rounded-full bg-neutral-200 dark:bg-neutral-700
      after:absolute after:left-0 after:top-0 after:h-full after:w-full
      checked:after:bg-[url('data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KCjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9Ii0yNCAtMjQgNzIuMDAgNzIuMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuMDAwMjQwMDAwMDAwMDAwMDAwMDMiPgoKPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KCjxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoKPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPiA8cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyQzIgMTcuNTIyOCA2LjQ3NzE1IDIyIDEyIDIyWiIgZmlsbD0iI2Y3ZjdmNyIvPiA8L2c+Cgo8L3N2Zz4=')] 
      after:bg-[length:30px] after:bg-center after:bg-no-repeat after:content-[''] 
       hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600 ${listColor[color]}
      focus:outline-none
    `;


  const handleOnChange = (e) => {
    setSelectedValue(e.target.value); 
    if (onChange) {
      onChange(e.target.value); 

    }
  };

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
            checked={selectedValue === option.value} // marcar la opción seleccionada
            onChange={handleOnChange} // función de cambio de valor
            // className={`peer relative ${iconSize[size]} shrink-0 appearance-none rounded-full bg-neutral-200 dark:bg-neutral-700 ${circle} ${afterSize[size]}  ${colorTheme[color]} hover:ring-0 hover:ring-neutral-300 dark:hover:ring-neutral-600 focus:outline-none`}
            className={inputClasses}
          />
          <span className={`${textSize[size]} text-zinc-700 dark:text-zinc-300`}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export { RadioGroup };


