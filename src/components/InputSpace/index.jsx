import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../../js/tamnora';

const InputSpace = ({
  children,
  variant = 'flat',
  color = 'default',
  outline = 'default',
  text = 'text-sm',
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

  const getColorClass = () => {
    return inputColor(color) ? inputColor(color)[variant] || '' : '';;
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
  ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? evalActive ? evalResult ? inputOutline(evalColorTrue) : inputOutline(evalColorFalse) : inputOutline(outline) : ''}
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
              className={`w-full bg-transparent outline-none border-0 ${text} ${textClass}`}
            />
          }
          {!textClass &&
            <input
              {...inputProps}
              autoComplete="off"
              className={`w-full bg-transparent outline-none dark:text-white placeholder:text-zinc-500 ${text} border-0`}
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