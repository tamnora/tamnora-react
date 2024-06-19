import React, { useState } from 'react';

export const Checkbox = ({
  size = 'sm',
  color = 'blue',
  radius = 'rounded-md',
  lineThrough = false,
  checked = false,
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  withBorder = false,
  withBackground = false,
  value,
  label,
  details,
  name,
  labelClassNames = 'flex flex-col cursor-pointer p-2 rounded-lg select-none ',
  onChange = () => { },
  ...props
}) => {

  const [isChecked, setIsChequed] = useState(checked);

  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const sizeBorder = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-2',
    xl: 'border-2'
  };

  const sizeText = {
    xs: 'text-xs ml-2 text-zinc-800 dark:text-zinc-200',
    sm: 'text-sm ml-2 text-zinc-800 dark:text-zinc-200',
    md: 'text-normal ml-2 text-zinc-800 dark:text-zinc-200',
    lg: 'text-lg ml-2 text-zinc-800 dark:text-zinc-200',
    xl: 'text-xl ml-2 text-zinc-800 dark:text-zinc-200'
  }

  const sizeDetails = {
    xs: 'text-xs ml-6 text-zinc-500 dark:text-zinc-400',
    sm: 'text-xs ml-6 text-zinc-500 dark:text-zinc-400',
    md: 'text-sm ml-6 text-zinc-500 dark:text-zinc-400',
    lg: 'text-normal ml-6 text-zinc-500 dark:text-zinc-400',
    xl: 'text-lg ml-6 text-zinc-500 dark:text-zinc-400'
  }

  const checkStyle = `after:absolute after:left-0 after:top-0 after:h-full after:w-full
  checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPmljb25fYnlfUG9zaGx5YWtvdjEwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4wMDAwMDAsIDI2LjAwMDAwMCkiPjxwYXRoIGQ9Ik0xNy45OTk5ODc4LDMyLjQgTDEwLjk5OTk4NzgsMjUuNCBDMTAuMjI2Nzg5MSwyNC42MjY4MDE0IDguOTczMTg2NDQsMjQuNjI2ODAxNCA4LjE5OTk4Nzc5LDI1LjQgTDguMTk5OTg3NzksMjUuNCBDNy40MjY3ODkxNCwyNi4xNzMxOTg2IDcuNDI2Nzg5MTQsMjcuNDI2ODAxNCA4LjE5OTk4Nzc5LDI4LjIgTDE2LjU4NTc3NDIsMzYuNTg1Nzg2NCBDMTcuMzY2ODIyOCwzNy4zNjY4MzUgMTguNjMzMTUyOCwzNy4zNjY4MzUgMTkuNDE0MjAxNCwzNi41ODU3ODY0IEw0MC41OTk5ODc4LDE1LjQgQzQxLjM3MzE4NjQsMTQuNjI2ODAxNCA0MS4zNzMxODY0LDEzLjM3MzE5ODYgNDAuNTk5OTg3OCwxMi42IEw0MC41OTk5ODc4LDEyLjYgQzM5LjgyNjc4OTEsMTEuODI2ODAxNCAzOC41NzMxODY0LDExLjgyNjgwMTQgMzcuNzk5OTg3OCwxMi42IEwxNy45OTk5ODc4LDMyLjQgWiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==')] 
  after:bg-[length:30px] after:bg-center after:bg-no-repeat after:content-['']`

  const colorClasses = {
    zinc: 'checked:hover:bg-zinc-400 checked:bg-zinc-400 checked:border-zinc-400 dark:checked:border-zinc-600 dark:checked:bg-zinc-600 dark:hover:checked:bg-zinc-600',
    blue: 'checked:hover:bg-blue-500 checked:bg-blue-500 checked:border-blue-500 dark:checked:border-blue-600 dark:checked:bg-blue-600 dark:hover:checked:bg-blue-600',
    purple: 'checked:hover:bg-purple-500 checked:bg-purple-500 checked:border-purple-500 dark:checked:border-purple-600 dark:checked:bg-purple-600 dark:hover:checked:bg-purple-600',
    sky: 'checked:hover:bg-sky-500 checked:bg-sky-500 checked:border-sky-500 dark:checked:border-sky-600 dark:checked:bg-sky-600 dark:hover:checked:bg-sky-600',
    emerald: 'checked:hover:bg-emerald-500 checked:bg-emerald-500 checked:border-emerald-500 dark:checked:border-emerald-600 dark:checked:bg-emerald-600 dark:hover:checked:bg-emerald-600',
    yellow: 'checked:hover:bg-yellow-500 checked:bg-yellow-500 checked:border-yellow-500 dark:checked:border-yellow-600 dark:checked:bg-yellow-600 dark:hover:checked:bg-yellow-600',
    red: 'checked:hover:bg-red-500 checked:bg-red-500 checked:border-red-500 dark:checked:border-red-600 dark:checked:bg-red-600 dark:hover:checked:bg-red-600',
    green: 'checked:hover:bg-green-500 checked:bg-green-500 checked:border-green-500 dark:checked:border-green-600 dark:checked:bg-green-600 dark:hover:checked:bg-green-600',
  };

  const colorBorder = {
    default: 'dark:border-zinc-700',
    zinc: 'border-zinc-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    sky: 'border-sky-500',
    emerald: 'border-emerald-500',
    yellow: 'border-yellow-500',
    red: 'border-red-500',
    green: 'border-green-500',
  };

  const colorBackground = {
    default: 'bg-zinc-700',
    zinc: 'bg-zinc-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
  };

  const checkboxClass = `peer relative shrink-0 appearance-none focus:outline-none cursor-pointer
  border-2 border-zinc-300 hover:bg-black/5 dark:border-zinc-700 dark:hover:bg-white/5
  ${checkStyle} ${sizeClasses[size]} ${colorClasses[color]} ${radius}
  ${isDisabled && 'cursor-not-allowed opacity-50'}`

  const handleChange = (e) => {
    onChange(e.target.value, e.target.checked)
    setIsChequed(e.target.checked);
  }

  return (
    <label className={`${labelClassNames} ${withBorder ? sizeBorder[size] : ''} ${withBackground ? 'bg-white dark:bg-zinc-800' : '' }  ${ isChecked ? colorBorder[color] : colorBorder['default']}`}>
      <div className='flex items-center'>
        <input
          type="checkbox"
          className={checkboxClass}
          defaultValue={value}
          defaultChecked={isChecked}
          onChange={handleChange}
          {...props}
        />
        {label && <p className={sizeText[size]}>{label}</p>}
      </div>
      {details && <p className={sizeDetails[size]}>{details}</p>}
    </label>
  );
};