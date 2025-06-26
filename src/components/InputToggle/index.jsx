import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../../js/tamnora';


const InputToggle = ({
  children,
  variant = 'flat',
  color = 'default',
  outline = 'default',
  text='text-sm',
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
  baseRef,
  startContent,
  endContent,
  onChange,
  onHandleBlur,
  textClass,
  textOn = 'Si',
  textOff = 'No',
  optionOn = ['Si', 'S', 's', 'si', '1', 'Y', 'y'],
  optionOff = ['No', 'N', 'n', 'no', '0'],
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [initialValue, setInitialValue] = useState(defaultValue || '');
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState('');
  const [displayedValue, setDisplayedValue] = useState(defaultValue > 0 ? textOn : textOff);
  const [inputUpdated, setInputUpdated] = useState(false);
  const inputRef = useRef(null);

  
  function handleToggle(e, value){
    let newValue = value;
    
    if(newValue > 0){
      setDisplayedValue(textOn);
      e.target.value = textOn;
    } else {
      setDisplayedValue(textOff);
      e.target.value = textOff;
    }
  
  }

  const handleDivClick = () => {
    setFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    let targetValue = e.target.value;
    let originalValue = internalValue; // Supongo que tienes una variable de estado llamada internalValue
  
    // Normaliza el valor de entrada para manejar diferentes casos
    let normalizedValue = targetValue.trim().toLowerCase();
    
    if (optionOn.includes(normalizedValue)) {
      newValue = '1';
    } else if (optionOff.includes(normalizedValue)) {
      newValue = '0';
    } else {
      newValue = originalValue;
    }

    // Actualiza el estado interno solo si el valor cambió
    if (newValue !== originalValue) {
      setInternalValue(newValue);
    }
    
    // Llama al callback onChange si está definido
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };
  
  const handleFocus = () => {
    setFocused(true);
    setHasBeenFocused(true);
    setRequiredMessage(isRequiredMessage);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    handleToggle(e, internalValue)
      if (onHandleBlur) {
        onHandleBlur({ target: { value: internalValue } });
      }
  };

  
  
  const inputProps = {
    defaultValue: displayedValue,
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

  const containerClassNames = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50'}
    ${isReadOnly && 'opacity-60'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${getColorClass()}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? inputOutline(outline) : ''}
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

export { InputToggle };