import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './ChevronDownIcon';

export function Select({
  variant = 'flat',
  size = 'md',
  radius = 'rounded-xl',
  label,
  value,
  defaultValue,
  placeholder,
  labelPlacement = 'inside',
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  options = [],
  onChange,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const optionsRef = useRef(null);
  const optionRefs = useRef([]);

  const toggleOptions = () => {
    if (isDisabled || isReadOnly) return;
    setFocused(true);
    setShowOptions(prev => !prev);
    setHighlightedIndex((prevIndex) => (prevIndex + 1) % options.length);
  };

  const selectOption = (option) => {
    setSelectedValue(option.value);
    onChange && onChange(option.value);
    setShowOptions(false);
    setFocused(true);
    selectRef.current.focus();
  };

  const navigateOptions = (e) => {
    if (!showOptions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % options.length;
        optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const newIndex = (prevIndex - 1 + options.length) % options.length;
        optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        selectOption(options[highlightedIndex]);
      }
    } else if (e.key === 'Tab') {
      setShowOptions(false);
      setFocused(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target) && optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
      setFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [showOptions]);

  const heightMap = {
    inside: {
      sm: 'h-12',
      md: 'h-14',
      lg: 'h-16',
    },
    outside: {
      sm: 'h-auto',
      md: 'h-10',
      lg: 'h-12',
    },
  };

  const getHeightClass = () => {
    return heightMap[labelPlacement] ? heightMap[labelPlacement][size] || '' : '';
  };

  const selectedLabel = options.find(option => option.value === selectedValue)?.label;
  
  const containerClassNames = `
    relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${isDisabled && 'opacity-50'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${variant === 'flat' ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700' : ''}
    ${variant === 'bordered' ? 'border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${variant === 'underlined' ? 'border-b-2 !shadow-none dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 !px-1' : ''}
    ${variant === 'faded' ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${variant === 'tmn' ? 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}`;

  const labelClassNames = `
    absolute z-10 text-md font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200
    ${selectedLabel || focused || placeholder ? 'text-zinc-600 dark:text-zinc-300 scale-75 -translate-y-2' : 'scale-100 translate-y-0 text-zinc-500 dark:text-zinc-400'}
  `;

  const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-400 `;

  return (
    <div className="relative">
      {labelPlacement === 'outside' && label && (
        <label className={outsideLabelClassNames} htmlFor={props.id}>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      )}
      <button
        onClick={toggleOptions}
        className={containerClassNames}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={navigateOptions}
        type="button"
        role="select"
        ref={selectRef}
        {...props}
      >
        {labelPlacement === 'inside' && label && (
          <label className={labelClassNames} htmlFor={props.id}>
            {label} {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}
        <span className={`${selectedLabel ? 'dark:text-white' : 'text-zinc-500'} text-sm ${labelPlacement === 'inside' && 'translate-y-2'}`}>
          {selectedLabel || placeholder}
        </span>
        <span className='text-zinc-700 dark:text-white absolute right-3'>
          <ChevronDownIcon className={`h-4 w-4 transition-transform duration-150 ease motion-reduce:transition-none ${showOptions ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {showOptions && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-zinc-800 shadow-lg rounded-xl text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 tmn-fadeIn">
          <ul className="p-2 max-h-72 overflow-y-auto" ref={optionsRef}>
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`flex justify-between items-center cursor-pointer px-2 py-1.5 hover:bg-zinc-200 rounded-lg dark:hover:bg-zinc-700 ${highlightedIndex === index ? 'bg-zinc-200 dark:bg-zinc-700' : ''} ${selectedValue === option.value ? ' text-sky-700 dark:text-sky-500' : ''}`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectOption(option)}
              ref={el => optionRefs.current[index] = el}
            >
              {option.label}
              {selectedValue === option.value ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 text-sky-700 dark:text-sky-500">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              
              ): ''}
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
}
