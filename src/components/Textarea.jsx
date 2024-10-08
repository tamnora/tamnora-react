import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../js/tamnora';


const Textarea = ({
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
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  isInvalid = false,
  isUpperCase = false,
  isLowerCase = false,
  baseRef,
  disableAnimation = false,
  classNames: customClassNames = {},
  onChange,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const textareaRef = useRef(null);

  const handleDivClick = () => {
    setFocused(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTextareaChange = (e) => {
    let newValue = e.target.value;

    if (isUpperCase) {
      newValue = e.target.value.toUpperCase();
      e.target.value = newValue;
    } 
    if (isLowerCase) {
      newValue = e.target.value.toLowerCase();
      e.target.value = newValue;
    }

    setInternalValue(newValue);

    if (onChange) {
      onChange(e);
    }
  };

  const displayedValue = value !== undefined ? value : internalValue;
  const textareaProps = {
    value: displayedValue,
    placeholder,
    ref: baseRef || textareaRef,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: handleTextareaChange,
    readOnly: isReadOnly,
    disabled: isDisabled,
    ...props
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
    <div className='flex flex-col gap-1'>
      {labelPlacement === 'outside' && label && (
        <label className={outsideLabelClassNames} htmlFor={props.id}>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      )}
      <div onClick={handleDivClick} className={containerClassNames}>
        {labelPlacement === 'inside' && label && (
          <label className={labelClassNames} htmlFor={props.id}>
            {label} {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}
        <textarea
          {...textareaProps}
          className={`w-full font-normal bg-transparent !outline-none focus-visible:outline-none data-text-small transition-none pt-0 resize-y min-h-[40px] dark:text-white placeholder:text-zinc-500 ${text}`}
        />
      </div>
      {errorMessage && <p className="text-xs ms-1 mt-1 text-red-400">{errorMessage}</p>}
    </div>
  );
};

export { Textarea };
