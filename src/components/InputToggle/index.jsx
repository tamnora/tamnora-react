import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../../js/tamnora';

const InputToggle = ({
  children,
  variant = 'flat',
  color = 'default',
  outline = 'green',
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
  disableAnimation = false,
  baseRef,
  startContent,
  endContent,
  onChange,
  onHandleBlur,
  textClass,
  textOn = 'Si',
  textOff = 'No',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue === '1' ? '1' : '0');
  const [focused, setFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const containerRef = useRef(null);

  // Derivamos el valor a mostrar directamente del estado interno.
  const displayedValue = internalValue === '1' ? textOn : textOff;

  // Sincroniza el estado interno si la prop `defaultValue` cambia desde fuera.
  useEffect(() => {
    setInternalValue(defaultValue === '1' ? '1' : '0');
  }, [defaultValue]);

  // Función central para alternar el valor.
  const toggleValue = () => {
    if (isReadOnly || isDisabled) return;

    const newValue = internalValue === '1' ? '0' : '1';
    setInternalValue(newValue);

    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  const handleFocus = () => {
    if (isDisabled) return;
    setFocused(true);
    setHasBeenFocused(true);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onHandleBlur) {
      onHandleBlur({ target: { value: internalValue } });
    }
  };

  // Maneja los eventos de teclado para la accesibilidad.
  const handleKeyDown = (e) => {
    if (isReadOnly || isDisabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault(); // Previene el scroll de la página al usar la barra espaciadora.
      toggleValue();
    }
  };

  const heightMap = {
    inside: { sm: 'h-12', md: 'h-14', lg: 'h-16' },
    outside: { sm: 'h-auto', md: 'h-10', lg: 'h-12' },
  };

  const getHeightClass = () => heightMap[labelPlacement]?.[size] || '';

  const requiredStyles = () => {
    if (isRequired && hasBeenFocused && internalValue === '') {
      return variant === 'underlined' ? '' : 'outline outline-red-600/50 dark:outline-red-800 outline-offset-1';
    }
    return '';
  };

  const getColorClass = () => inputColor(color)?.[variant] || '';

  const containerClassNames = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 
    ${!isReadOnly ? 'cursor-pointer' : 'cursor-default'}
    ${getHeightClass()}
    ${requiredStyles()}
    ${isDisabled && 'opacity-50 cursor-not-allowed'}
    ${isReadOnly && 'opacity-60'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${variant === 'underlined' ? 'rounded-0' : radius}
    ${getColorClass()}
    ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
    ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? inputOutline(outline) : ''}
  `;

  const labelClassNames = `absolute z-10 text-base font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200 
    ${focused || placeholder || internalValue === '0' || internalValue === '1' ? 'text-zinc-600 dark:text-zinc-300 scale-75 -translate-y-2' : 'scale-100 translate-y-0 text-zinc-500 dark:text-zinc-400'}
  `;

  const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-400`;

  return (
    <div>
      {labelPlacement === 'outside' && label && (
        <label className={outsideLabelClassNames} htmlFor={props.id}>
          {label} {isRequired && <span className="text-red-400">* {isRequired && hasBeenFocused && internalValue === '' && isRequiredMessage}</span>}
        </label>
      )}
      <div
        ref={containerRef}
        className={containerClassNames}
        // onClick={toggleValue}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role="switch"
        aria-checked={internalValue === '1'}
        aria-readonly={isReadOnly}
        tabIndex={isDisabled ? -1 : 0}
      >
        {labelPlacement === 'inside' && label && (
          <label className={labelClassNames} htmlFor={props.id}>
            {label} {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}
        <div className={`flex w-full items-center h-full ${labelPlacement === 'inside' && 'translate-y-2'}`}>
          {startContent && <div className='text-zinc-400 pe-2 select-none'>{startContent}</div>}
          <input
            {...props}
            ref={baseRef}
            value={displayedValue}
            readOnly // El input es de solo lectura, la interacción es a través del div contenedor.
            className={`w-full bg-transparent outline-none border-0 dark:text-white placeholder:text-zinc-500 ${text} ${textClass ? ` ${textClass}` : ''}`} 
            autoComplete="off"
          />
          {endContent && <div className='text-zinc-400 ps-2 select-none'>{endContent}</div>}
        </div>
      </div>
      {errorMessage && <p className="text-xs ms-1 mt-1 text-red-400">{errorMessage}</p>}
    </div>
  );
};

export { InputToggle };
