import React, { useState, useRef, useEffect } from 'react';

const Textarea = ({
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

  // Función para ajustar automáticamente la altura del textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Restablece la altura
      textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta al contenido
    }
  };

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
    onChange: (e) => {
      handleTextareaChange(e);
      adjustHeight(); // Ajusta la altura en cada cambio
    },
    onInput: adjustHeight, // Ajusta la altura al escribir
    readOnly: isReadOnly,
    disabled: isDisabled,
    ...props
  };

  const containerClassNames = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-start transition-background duration-150 outline-none py-2 cursor-text h-auto
    ${isDisabled && 'opacity-50'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${variant === 'flat' ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700' : ''}
    ${variant === 'bordered' ? 'border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${variant === 'underlined' ? 'border-b-2 !shadow-none dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 !px-1' : ''}
    ${variant === 'faded' ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${variant === 'tmn' ? 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500' : ''}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}`;

  const labelClassNames = `text-md font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200 text-zinc-600 dark:text-zinc-300 text-xs
    ${customClassNames.label || ''}`;
  const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-300`;

  useEffect(() => {
    setInternalValue(defaultValue);
    adjustHeight(); // Ajusta la altura inicial
  }, [defaultValue]);

  return (
    <div className="flex flex-col gap-1">
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
          className="w-full font-normal bg-transparent !outline-none focus-visible:outline-none data-text-small transition-none pt-0 resize-y min-h-[40px] max-h-[400px] dark:text-white placeholder:text-zinc-500 text-sm"
        />
      </div>
      {errorMessage && <p className="text-xs ms-1 mt-1 text-red-400">{errorMessage}</p>}
    </div>
  );
};

export { Textarea };
