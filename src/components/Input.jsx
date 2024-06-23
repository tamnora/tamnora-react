import React, { useState, useRef } from 'react';

const Input = ({
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
  baseRef,
  disableAnimation = false,
  startContent,
  endContent,
  onChange,
  onHandleBlur,
  isCase,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [initialValue, setInitialValue] = useState(defaultValue || '');
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState('');
  const inputRef = useRef(null);

  const handleDivClick = () => {
    setFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    if(isCase == 'uppercase'){
      newValue = e.target.value.toUpperCase();
      e.target.value = newValue;
    } else if(isCase == 'lowercase'){
      newValue = e.target.value.toLowerCase();
      e.target.value = newValue;
    } 

    setInternalValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = () => {
    setFocused(true);
    setHasBeenFocused(true);
    setRequiredMessage(isRequiredMessage)
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (initialValue !== e.target.value) {
      setInitialValue(e.target.value)
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
        return ''
      } else {
        return 'outline outline-red-600/50 dark:outline-red-800 outline-offset-1'
      }
    }
  }

  const containerClassNames = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${variant === 'flat' ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700' : ''}
    ${variant === 'bordered' ? 'border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${variant === 'underlined' ? 'border-b-2 !shadow-none dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 !px-1' : ''}
    ${variant === 'faded' ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${variant === 'tmn' ? 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}
    `

  const labelClassNames = `absolute z-10 text-md font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200 
    ${displayedValue || focused || placeholder || props.type === 'date' ? 'text-zinc-600 dark:text-zinc-300 scale-75 -translate-y-2' : 'scale-100 translate-y-0 text-zinc-500 dark:text-zinc-400'} `;
  const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-400`;

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
          <input
            {...inputProps}
            autoComplete="off"
            className={`w-full bg-transparent outline-none dark:text-white placeholder:text-zinc-500 text-sm border-0`}
          />
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

export { Input };
