import React, { useState, useRef, useEffect } from 'react';

export function InputSelect({
  children,
  variant = 'flat',
  color = 'default',
  size = 'md',
  radius = 'rounded-xl',
  label,
  value,
  defaultValue = '',
  placeholder,
  description,
  errorMessage,
  validate,
  labelPlacement = 'inside',
  fullWidth = true,
  isRequiredMessage = '',
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  isInvalid = false,
  isUpperCase = false,
  isLowerCase = false,
  disableAnimation = false,
  baseRef,
  startContent,
  endContent,
  onChange,
  onHandleBlur,
  textClass,
  options = [],
  evalActive = false,
  evalResult = true,
  evalColorTrue = '',
  evalColorFalse = 'red',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  

  const inputRef = useRef(null);
  const optionRefs = useRef([]);

  if (!evalColorTrue) evalColorTrue = color;
  if (!evalColorFalse) evalColorFalse = 'red';

  useEffect(() => {
    const selectedOption = options.find(option => option.value === defaultValue);
    if (selectedOption) {
      setInputValue(selectedOption.label);
    }
  }, [defaultValue, options]);

  

  

  



  

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().startsWith(newValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
      setHighlightedIndex(-1); // Reset highlighted index on new input
    } else {
      setFilteredOptions([]);
      setShowOptions(false);
    }

    if (onChange) {
      const matchedOption = options.find(option => option.label === newValue);
      onChange({ target: { value: newValue, option: matchedOption || {} } });
    }
  };

  const navigateOptions = (e) => {
    if (!showOptions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % filteredOptions.length;
        optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const newIndex = (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
        optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        selectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Tab') {
      setShowOptions(false);
      setFocused(false);
    }
  };

  

  const selectOption = (option) => {
    setInputValue(option.label);
    setShowOptions(false);
    if (onChange) {
      onChange({ target: { value: option.value, option: option } });
    }
    if (onHandleBlur) {
      onHandleBlur({ target: { value: option.value, option: option } });
    }
  };

  
  

  const handleFocus = () => {
    setFocused(true);
    setHasBeenFocused(true);
    setRequiredMessage(isRequiredMessage);
  };

  const handleBlur = (e) => {
    setFocused(false);
    setShowOptions(false);
    if (onHandleBlur) {
      const matchedOption = options.find(option => option.label.toLowerCase().startsWith(inputValue.toLowerCase()));
      if (matchedOption) {
        setInputValue(matchedOption.label);
        onHandleBlur({ target: { value: matchedOption.value, option: matchedOption } });
      } else {
        setInputValue(defaultValue);
        onHandleBlur({ target: { value: defaultValue, option: {} } });
      }
    }
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowOptions(false);
      setFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  

  

  

  const inputProps = {
    role: "autocomplete",
    value: inputValue,
    placeholder,
    ref: baseRef || inputRef,
    required: isRequired,
    disabled: isDisabled,
    readOnly: isReadOnly,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleInputChange,
    onKeyDown: navigateOptions,
    tabIndex: (isReadOnly || isDisabled) ? -1 : 0,
    ...props
  };

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

  const requiredStyles = () => {
    if (isRequired && hasBeenFocused && inputValue === '') {
      if (variant === 'underlined') {
        return '';
      } else {
        if (inputValue == 0 && inputValue != '') {
          return 'outline outline-emerald-600/50 dark:outline-emerald-800 outline-offset-1';
        } else {
          return 'outline outline-red-600/50 dark:outline-red-800 outline-offset-1';
        }
      }
    }
  };

  const renderNuevo = () => {
    if (inputValue == 0 && inputValue != '' && labelPlacement == 'inside') {
      return (
        <span className="absolute top-1 right-1 bg-emerald-600 text-emerald-100 text-xs px-1.5 py-[0.5px] rounded-full ">Nuevo</span>
      );
    }
    if (inputValue == 0 && inputValue != '' && labelPlacement == 'outside') {
      return (
        <span className="absolute right-0 top-[-22px] bg-emerald-600 text-emerald-100 text-xs px-1.5 rounded-full">Nuevo</span>
      );
    }
  };



  const colorMap = {
    default: {
      flat: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700',
      bordered: 'border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
      underlined: 'border-b-2 !shadow-none dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 !px-1',
      faded: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
      tmn: 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
    },
    blue: {
      flat: 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700',
      bordered: 'border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
      underlined: 'border-b-2 !shadow-none dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 !px-1',
      faded: 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
      tmn: 'bg-white dark:bg-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-800/50 border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
    },
    red: {
      flat: 'bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700',
      bordered: 'border-2 border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
      underlined: 'border-b-2 !shadow-none dark:border-red-700 hover:border-red-400 dark:hover:border-red-500 !px-1',
      faded: 'bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 border-2 border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
      tmn: 'bg-red-100 text-red-700 dark:bg-red-800/80 hover:bg-red-50 dark:hover:bg-red-800/50 border border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
    },
    green: {
      flat: 'bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700',
      bordered: 'border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
      underlined: 'border-b-2 !shadow-none dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 !px-1',
      faded: 'bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
      tmn: 'bg-white dark:bg-green-800/80 hover:bg-green-50 dark:hover:bg-green-800/50 border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
    },
    yellow: {
      flat: 'bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700',
      bordered: 'border-2 border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
      underlined: 'border-b-2 !shadow-none dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 !px-1',
      faded: 'bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 border-2 border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
      tmn: 'bg-white dark:bg-yellow-800/80 hover:bg-yellow-50 dark:hover:bg-yellow-800/50 border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
    },
    sky: {
      flat: 'bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700',
      bordered: 'border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500',
      underlined: 'border-b-2 !shadow-none dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500 !px-1',
      faded: 'bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500',
      tmn: 'bg-white dark:bg-sky-800/80 hover:bg-sky-50 dark:hover:bg-sky-800/50 border border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500',
    },
    emerald: {
      flat: 'bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700',
      bordered: 'border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500',
      underlined: 'border-b-2 !shadow-none dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 !px-1',
      faded: 'bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500',
      tmn: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-800/50 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500',
    },
    violet: {
      flat: 'bg-violet-100 dark:bg-violet-800 hover:bg-violet-200 dark:hover:bg-violet-700',
      bordered: 'border-2 border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500',
      underlined: 'border-b-2 !shadow-none dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500 !px-1',
      faded: 'bg-violet-100 dark:bg-violet-800 hover:bg-violet-200 dark:hover:bg-violet-700 border-2 border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500',
      tmn: 'bg-white dark:bg-violet-800/80 hover:bg-violet-50 dark:hover:bg-violet-800/50 border border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500',
    },
    purple: {
      flat: 'bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700',
      bordered: 'border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
      underlined: 'border-b-2 !shadow-none dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 !px-1',
      faded: 'bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
      tmn: 'bg-white dark:bg-purple-800/80 hover:bg-purple-50 dark:hover:bg-purple-800/50 border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
    },
    orange: {
      flat: 'bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700',
      bordered: 'border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500',
      underlined: 'border-b-2 !shadow-none dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 !px-1',
      faded: 'bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500',
      tmn: 'bg-white dark:bg-orange-800/80 hover:bg-orange-50 dark:hover:bg-orange-800/50 border border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500',
    },
    amber: {
      flat: 'bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700',
      bordered: 'border-2 border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500',
      underlined: 'border-b-2 !shadow-none dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500 !px-1',
      faded: 'bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 border-2 border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500',
      tmn: 'bg-white dark:bg-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-800/50 border border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500',
    },
    lime: {
      flat: 'bg-lime-100 dark:bg-lime-800 hover:bg-lime-200 dark:hover:bg-lime-700',
      bordered: 'border-2 border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500',
      underlined: 'border-b-2 !shadow-none dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500 !px-1',
      faded: 'bg-lime-100 dark:bg-lime-800 hover:bg-lime-200 dark:hover:bg-lime-700 border-2 border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500',
      tmn: 'bg-white dark:bg-lime-800/80 hover:bg-lime-50 dark:hover:bg-lime-800/50 border border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500',
    },
    teal: {
      flat: 'bg-teal-100 dark:bg-teal-800 hover:bg-teal-200 dark:hover:bg-teal-700',
      bordered: 'border-2 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500',
      underlined: 'border-b-2 !shadow-none dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500 !px-1',
      faded: 'bg-teal-100 dark:bg-teal-800 hover:bg-teal-200 dark:hover:bg-teal-700 border-2 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500',
      tmn: 'bg-white dark:bg-teal-800/80 hover:bg-teal-50 dark:hover:bg-teal-800/50 border border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500',
    },
  };


  const getColorClass = (xcolor) => {
    if (xcolor) {
      return colorMap[xcolor] ? colorMap[xcolor][variant] || '' : '';
    }
    return colorMap[color] ? colorMap[color][variant] || '' : '';
  };


  const containerEvalTrue = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50'}
    ${isReadOnly && 'opacity-60'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${getColorClass(evalColorTrue)}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}
    `;

  const containerEvalFalse = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50'}
    ${isReadOnly && 'opacity-60'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${getColorClass(evalColorFalse)}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}
    `;


  const containerClassNames = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50'}
    ${isReadOnly && 'opacity-60'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${getColorClass()}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}
    `;

  const labelClassNames = `absolute z-10 text-base font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200 
    text-zinc-600 dark:text-zinc-300 scale-75 -translate-y-2 `;
  const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-400 w-full`;


  return (
    <div className="relative w-full min-w-2xl">
      {labelPlacement === 'outside' && label && (
        <label className={outsideLabelClassNames}>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className={evalActive ? (evalResult ? containerEvalTrue : containerEvalFalse) : containerClassNames}>
        {renderNuevo()}
        {labelPlacement === 'inside' && label && (
          <>
            <label className={labelClassNames} htmlFor={props.id}>
              {label} {isRequired && <span className="text-red-400">*</span>}
            </label>
          </>
        )}
        <div className={`flex w-full items-center h-full ${labelPlacement === 'inside' && 'translate-y-2'}`}>
          {startContent &&
            <div className='text-zinc-400 pe-2 select-none'>
              {startContent}
            </div>
          }
          {textClass &&
            <input
              {...inputProps}
              autoComplete="off"
              className={`w-full bg-transparent outline-none border-0 ${textClass}`}
            />
          }
          {!textClass &&
            <input
              {...inputProps}
              autoComplete="off"
              className={`w-full bg-transparent outline-none dark:text-white placeholder:text-zinc-500 text-sm border-0`}
            />}
          {endContent &&
            <div className='text-zinc-400 ps-2 select-none'>
              {endContent}
            </div>
          }
        </div>
      </div>
      {errorMessage && <p className="text-xs ms-1 mt-1 text-red-400">{errorMessage}</p>}
      {showOptions && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-zinc-800 shadow-lg rounded-xl text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 tmn-fadeIn">
          <ul className="p-2 max-h-72 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                ref={el => optionRefs.current[index] = el}
                className={`flex justify-between items-center cursor-pointer px-2 py-1.5 hover:bg-zinc-200 rounded-lg dark:hover:bg-zinc-700 ${inputValue === option.value ? ' text-sky-700 dark:text-sky-500' : ''}`}
                onClick={() => selectOption(option)}
              >
                {option.label}
              </li>
                
            ))}
          </ul>
        </div>
      )}
      {description && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {description}
        </span>
      )}
      {isRequired && !hasBeenFocused && (
        <span className="text-xs text-red-600 dark:text-red-400 mt-1">
          {requiredMessage}
        </span>
      )}
      {isInvalid && errorMessage && (
        <span className="text-xs text-red-600 dark:text-red-400 mt-1">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
