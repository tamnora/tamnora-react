import React, { useState, useRef, useEffect } from 'react';

const InputSpace = ({
  children,
  variant = 'flat',
  color = 'default',
  size = 'md',
  radius = 'rounded-xl',
  label,
  value,
  defaultValue,
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
  evalActive = false,
  evalResult = true,
  evalColorTrue,
  evalColorFalse = 'red',
  baseRef,
  startContent,
  endContent,
  onChange,
  onHandleBlur,
  textClass,
  options,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [initialValue, setInitialValue] = useState(defaultValue || '');
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState('');
  const [inputUpdated, setInputUpdated] = useState(false);
  const inputRef = useRef(null);

  if (!color) color = 'default';
  if (!evalColorTrue) evalColorTrue = color;
  if (!evalColorFalse) evalColorFalse = 'red';

  const handleDivClick = () => {
    setFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // const handleInputChange = (e) => {
  //   let newValue = e.target.value;
  //   if (isUpperCase) {
  //     newValue = e.target.value.toUpperCase();
  //     e.target.value = newValue;
  //   }
  //   if (isLowerCase) {
  //     newValue = e.target.value.toLowerCase();
  //     e.target.value = newValue;
  //   }

  //   setInternalValue(newValue);
  //   if (!inputUpdated) setInputUpdated(true)
  //   if (onChange) {
  //     onChange(e);
  //   }
  // };

  const handleInputChange = (e) => {
    let newValue = e.target.value;

    // Convert to uppercase or lowercase if needed
    if(newValue){
      if (isUpperCase) {
        newValue = newValue.toUpperCase();
    }
    if (isLowerCase) {
        newValue = newValue.toLowerCase();
    }
    }

    // Check if the user has entered a space
    if (newValue.endsWith(' ')) {
        const words = newValue.trim().split(' ');
        const lastWord = words[words.length - 1];
        
        // Check if the last word matches any option's value
        const matchingOption = options?.find(option => option.value.toUpperCase() === lastWord.toUpperCase());
        
        if (matchingOption) {
            // Replace the last word with the label
            words[words.length - 1] = matchingOption.label;
            newValue = words.join(' ') + ' ';
        }
    }

    setInternalValue(newValue);

    if (!inputUpdated) setInputUpdated(true);
    if (onChange) {
        onChange({target: {value: newValue}});
    }
};


  const handleFocus = () => {
    setFocused(true);
    setHasBeenFocused(true);
    setRequiredMessage(isRequiredMessage);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (initialValue !== e.target.value) {
      setInitialValue(e.target.value);
      if (onHandleBlur) {
        onHandleBlur(e);
      }
    } else if (inputUpdated) {
      setInputUpdated(false);
      if (onHandleBlur) {
        onHandleBlur(e);
      }
    }
  };

  const displayedValue = value !== undefined ? value : internalValue;
  const inputProps = {
    value: displayedValue,
    placeholder,
    ref: baseRef || inputRef,
    required: isRequired,
    disabled: isDisabled,
    readOnly: isReadOnly,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleInputChange,
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
    if (isRequired && hasBeenFocused && displayedValue === '') {
      if (variant === 'underlined') {
        return '';
      } else {
        return 'outline outline-red-600/50 dark:outline-red-800 outline-offset-1';
      }
    }
  };

  const colorMap = {
    default: {
      flat: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700',
      bordered: 'border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
      underlined: 'border-b-2 !shadow-none dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 !px-1',
      faded: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
      tmn: 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
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

  const outlines = {
    default: 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1',
    blue: 'outline outline-blue-500 dark:outline-blue-700 outline-offset-1',
    red: 'outline outline-red-500 dark:outline-red-700 outline-offset-1',
    green: 'outline outline-green-500 dark:outline-green-700 outline-offset-1',
    yellow: 'outline outline-yellow-500 dark:outline-yellow-700 outline-offset-1',
    sky: 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1',
    emerald: 'outline outline-emerald-500 dark:outline-emerald-700 outline-offset-1',
    violet: 'outline outline-violet-500 dark:outline-violet-700 outline-offset-1',
    purple: 'outline outline-purple-500 dark:outline-purple-700 outline-offset-1',
    orange: 'outline outline-orange-500 dark:outline-orange-700 outline-offset-1',
    amber: 'outline outline-amber-500 dark:outline-amber-700 outline-offset-1',
    lime: 'outline outline-lime-500 dark:outline-lime-700 outline-offset-1',
    teal: 'outline outline-teal-500 dark:outline-teal-700 outline-offset-1',
  };

  
  const getColorClass = () => {
    return colorMap[color] ? colorMap[color][variant] || '' : '';;
  };

  const containerClassNames = `tmn-normal relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50'}
    ${isReadOnly && 'opacity-60'}
    ${getColorClass()} 
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? evalActive ? evalResult ? outlines[evalColorTrue] : outlines[evalColorFalse] : outlines[color] : ''}
    `;

  const labelClassNames = `absolute z-10 text-base font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200 
    ${displayedValue || focused || placeholder || props.type === 'date' || props.type === 'time' || defaultValue == '0' ? 'text-zinc-600 dark:text-zinc-300 scale-75 -translate-y-2' : 'scale-100 translate-y-0 text-zinc-500 dark:text-zinc-400'} `;
  const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-400`;

  useEffect(() => {
    setInternalValue(defaultValue);
  }, [defaultValue])

  return (
    <div>
      {labelPlacement === 'outside' && label && (
        <label className={outsideLabelClassNames} htmlFor={props.id}>
          {label} {isRequired && <span className="text-red-400">* {(isRequired && hasBeenFocused && displayedValue === '') && requiredMessage}</span>}
        </label>
      )}
      <div onClick={handleDivClick} className={containerClassNames}>
        {labelPlacement === 'inside' && label && (
          <label className={labelClassNames} htmlFor={props.id}>
            {label} {isRequired && <span className="text-red-400">*</span>}
          </label>
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
    </div>
  );
};

export { InputSpace };