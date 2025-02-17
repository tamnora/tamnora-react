import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../js/tamnora';

const InputContable = ({
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
  placeholder = '#.#.##.###',
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
  const [posibleCta, setPosibleCta] = useState(''); // Declara posibleCta como estado
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchResult, setCurrentSearchResult] = useState('');

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

    if (listCuentas[formattedValue]) {
      nameCta = listCuentas[formattedValue];
      setNombreCuenta(listCuentas[formattedValue]);
    } else {
      nameCta = '';
      setNombreCuenta('');
    }

    if (formattedValue !== originalValue) {
      setInternalValue(formattedValue);
      e.target.value = formattedValue;
    }

    if (onChange) {
      onChange({ target: { value: formattedValue, label: nameCta } });
    }

    const possibleAccount = Object.keys(listCuentas).find((cuenta) => cuenta.startsWith(formattedValue));
    setPosibleCta(possibleAccount); // Actualiza el estado de posibleCta
  };

  const handleFocus = () => {
    setFocused(true);
    setHasBeenFocused(true);
    setRequiredMessage(isRequiredMessage);
  };

  const handleBlur = (e) => {
    let nameCta = '';
    let cuentaEncontrada = '';
    setFocused(false);

    if (e.target.value) {
      cuentaEncontrada = Object.keys(listCuentas).find((cuenta) => cuenta.startsWith(internalValue));
      if (cuentaEncontrada) {
        nameCta = listCuentas[cuentaEncontrada];
        setInternalValue(cuentaEncontrada);
        setDisplayedValue(cuentaEncontrada);
        setNombreCuenta(listCuentas[cuentaEncontrada]);
        e.target.value = cuentaEncontrada;
        if (onChange) {
          onChange({ target: { value: cuentaEncontrada, label: nameCta } });
        }
      } else {
        nameCta = '¡Cuenta Inválida!';
        setNombreCuenta('¡Cuenta Inválida!');
      }
    }

    if (onHandleBlur) {
      onHandleBlur({ target: { value: cuentaEncontrada, label: nameCta } });
    }
  };

  const accionaCon = (e, cta)=>{
    if(cta){
      let nameCta = listCuentas[cta];
        setInternalValue(cta);
        setDisplayedValue(cta);
        setNombreCuenta(listCuentas[cta]);
        e.target.value = cta;
        if (onChange) {
          onChange({ target: { value: cta, label: nameCta } });
        }
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.length >= 3) {
      const results = Object.keys(listCuentas).filter((cuenta) => {
        return cuenta.toLowerCase().includes(query) || listCuentas[cuenta].toLowerCase().includes(query);
      });
      setSearchResults(results);
      setCurrentSearchResult(results[0]);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (cuenta) => {
    setInternalValue(cuenta);
    setDisplayedValue(cuenta);
    setNombreCuenta(listCuentas[cuenta]);
    setIsModalOpen(false);
    if (onChange) {
      onChange({ target: { value: cuenta, label: listCuentas[cuenta] } });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      searchInputRef.current.focus();
    }, 200);
  };

  const irAtras = () => {
    const currentIndex = searchResults.indexOf(currentSearchResult);
    if (currentIndex > 0) {
      setCurrentSearchResult(searchResults[currentIndex - 1]);
    }
  };

  const irAdelante = () => {
    const currentIndex = searchResults.indexOf(currentSearchResult);
    if (currentIndex < searchResults.length - 1) {
      setCurrentSearchResult(searchResults[currentIndex + 1]);
    }
  };

  const seleccionarOpcion = () => {
    handleSelectResult(currentSearchResult);
  };

  useEffect(() => {
    setInternalValue(defaultValue);
    setDisplayedValue(defaultValue);
    setNombreCuenta(listCuentas[defaultValue]);
  }, [defaultValue]);

  useEffect(() => {
    setListCuentas(data);
  }, [data]);

  useEffect(() => {
    if (searchResults.length > 0) {
      setCurrentSearchResult(searchResults[0]);
    } else {
      setCurrentSearchResult('');
    }
  }, [searchResults]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const getInputData = activeElement.getAttribute('data-input');

      if (getInputData == 'cuenta') {
        if (e.altKey && e.keyCode == 66) {
          handleModalOpen();
        }

        if (e.keyCode == 13) {
          accionaCon(e, posibleCta) // Ahora posibleCta es accesible
        }
      }

      if (getInputData == 'search') {
        if (e.altKey && e.keyCode == 88) {
          handleModalClose();
        }

        if (e.keyCode == 37) {
          e.preventDefault();
          irAtras();
        }

        if (e.keyCode == 39) {
          e.preventDefault();
          irAdelante();
        }

        if (e.keyCode == 40) {
          e.preventDefault();
          seleccionarOpcion();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [posibleCta]);

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
    return inputColor(color) ? inputColor(color)[variant] || '' : '';
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
    <div className="">
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
            <div className='flex gap-2 items-center w-full'>
              <input
                {...inputProps}
                autoComplete="off"
                className={`w-full bg-transparent outline-none border-0 ${text} ${textClass}`}
              />
              <div className={`w-full bg-transparent outline-none ${nombreCuenta != '¡Cuenta Inválida!' ? 'text-zinc-600 dark:text-zinc-300' : 'text-rose-700 dark:text-rose-400'}  placeholder:text-zinc-500 ${text} border-0`}>
                {nombreCuenta}
              </div>
            </div>
          }
          {!textClass &&
            <div className='flex gap-2 items-center w-full'>
              {!isModalOpen && (
                <>
                  <input
                    {...inputProps}
                    autoComplete="off"
                    data-input="cuenta"
                    className={`w-20 h-10 bg-transparent outline-none dark:text-white placeholder:text-zinc-500 ${text} border-0`}
                  />
                  <div className={`w-full bg-transparent outline-none ${nombreCuenta != '¡Cuenta Inválida!' ? 'text-zinc-600 dark:text-zinc-300' : 'text-rose-700 dark:text-rose-400'}  placeholder:text-zinc-500 ${text} border-0`}>
                    {nombreCuenta}
                  </div>
                  <button className='ml-auto' tabIndex="-1" onClick={handleModalOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              )}
              {isModalOpen && (
                <div
                  className="flex items-center justify-between gap-2 w-full "
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    data-input="search"
                    onChange={handleSearch}
                    placeholder="Buscar..."
                    className={`w-8 bg-transparent text-lime-600 dark:text-lime-300 outline-none placeholder:text-zinc-500 ${text} border-0`}
                  />
                  {searchResults.length > 0 &&
                    <div className="w-full text-sm text-zinc-700 dark:text-zinc-300 tmn-fadeIn">
                      <div className="flex items-center justify-between gap-1 w-full ">
                        <button type='button' className="px-1 py-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 rounded-lg dark:hover:bg-zinc-700" onClick={irAtras}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                          </svg>
                        </button>
                        <span 
                        className="w-[350px] text-zinc-600 truncate dark:text-zinc-300 cursor-pointer px-2 py-1.5 hover:bg-lime-200 rounded-lg dark:hover:bg-lime-700" 
                        onClick={seleccionarOpcion}
                        title={`${currentSearchResult} - ${listCuentas[currentSearchResult]}`}>
                        ({searchResults.indexOf(currentSearchResult) + 1} de {searchResults.length})  {currentSearchResult} - {listCuentas[currentSearchResult]}
                        </span>
                        <button type='button' className="px-1 py-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 rounded-lg dark:hover:bg-zinc-700" onClick={irAdelante}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  }
                  <button className='ml-auto' tabIndex="-1" onClick={handleModalClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              )}
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
