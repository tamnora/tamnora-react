import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../js/tamnora';


const InputContable = ({
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
  data = {},
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState('');
  const [displayedValue, setDisplayedValue] = useState('');
  const [nombreCuenta, setNombreCuenta] = useState('');
  const [listCuentas, setListCuentas] = useState(data);
  const inputRef = useRef(null);

  if (!color) color = 'default';
  if (!evalColorTrue) evalColorTrue = outline;
  if (!evalColorFalse) evalColorFalse = 'red';

  const formatInput = (input) => {
    const soloNumeros = input.replace(/[^0-9]/g, '');
    const secciones = [
      soloNumeros.slice(0, 1),
      soloNumeros.slice(1, 2),
      soloNumeros.slice(2, 4),
      soloNumeros.slice(4, 7),
    ];
    return secciones.filter(Boolean).join('.');
  };
  
  
  const handleDivClick = () => {
    setFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    let formattedValue = formatInput(inputValue);
    let originalValue = internalValue; 
    let nameCta = '';
  
    setDisplayedValue(formattedValue);
    setInternalValue(formattedValue);

    // Actualizar el nombre de la cuenta si existe
    if (listCuentas[formattedValue]) {
      nameCta = listCuentas[formattedValue];
      setNombreCuenta(listCuentas[formattedValue]);
    } else {
      nameCta = '...';
      setNombreCuenta('...');
    }
    

    // Actualiza el estado interno solo si el valor cambió
    if (formattedValue !== originalValue) {
      setInternalValue(formattedValue);
      e.target.value = formattedValue;
    }
    
    // Llama al callback onChange si está definido
    if (onChange) {
      onChange({ target: { value: formattedValue, label: nameCta } });
    }
  };
  
  const handleFocus = () => {
    setFocused(true);
    setHasBeenFocused(true);
    setRequiredMessage(isRequiredMessage);
  };
  
  const handleBlur = (e) => {
    let nameCta = '';
    setFocused(false);
    const cuentaEncontrada = Object.keys(listCuentas).find((cuenta) => cuenta.startsWith(internalValue));
    console.log(cuentaEncontrada);
    if (cuentaEncontrada) {
      nameCta = listCuentas[cuentaEncontrada];
      setInternalValue(cuentaEncontrada);
      setDisplayedValue(cuentaEncontrada); // Autocompletar con la cuenta más próxima
      setNombreCuenta(listCuentas[cuentaEncontrada]); // Actualizar el nombre de la cuenta
      e.target.value = cuentaEncontrada
    } else {
      nameCta = '¡Cuenta Inválida!'
      setNombreCuenta('¡Cuenta Inválida!');
    }

      if (onHandleBlur) {
        onHandleBlur({ target: { value: internalValue, label: nameCta } });
      }

  };

  
  useEffect(() => {
    setInternalValue(defaultValue);
  
  }, [defaultValue])
  
  useEffect(() => {
    setListCuentas(data);
  }, [data]);


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
           <div className='flex gap-1'>
             <input
              {...inputProps}
              autoComplete="off"
              className={`w-16 bg-transparent outline-none dark:text-white placeholder:text-zinc-500 ${text} border-0`}
            />
            <div className={`w-full bg-transparent outline-none ${nombreCuenta != '¡Cuenta Inválida!' ? 'text-zinc-600 dark:text-zinc-300' : 'text-rose-700 dark:text-rose-400'}  placeholder:text-zinc-500 ${text} border-0`}>
              {nombreCuenta}
            </div>
           </div>
            }
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

export { InputContable };