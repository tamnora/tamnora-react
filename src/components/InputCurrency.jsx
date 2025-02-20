import React, { useState, useRef, useEffect } from 'react';

const InputCurrency = ({
    children,
    variant = 'flat',
    color = 'default',
    size = 'md',
    radius = 'rounded-xl',
    label,
    value,
    defaultValue,
    placeholder = '0,00',
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
    currency = '$',
    decimalPlaces = 2,
    lang = 'es',
    ...props
}) => {
    const [integerPart, setIntegerPart] = useState('');
    const [decimalPart, setDecimalPart] = useState('');
    const [focused, setFocused] = useState(false);
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [requiredMessage, setRequiredMessage] = useState('');
    const [inputUpdated, setInputUpdated] = useState(false);
    const integerInputRef = useRef(null);
    const decimalInputRef = useRef(null);

    useEffect(() => {
        if (defaultValue) {
            const parts = defaultValue.toString().split('.');
            const formatValue = (parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
            setIntegerPart(formatValue || '0');
            setDecimalPart(parts[1]?.padEnd(2, '0') || '00');
        }
    }, [defaultValue]);

    useEffect(() => {
        if (value !== undefined) {
            const parts = value.toString().split('.');
            setIntegerPart(parts[0] || '0');
            setDecimalPart(parts[1]?.padEnd(2, '0') || '00');
        }
    }, [value]);

    const handleIntegerChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const formatValue = (value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        setIntegerPart(formatValue);
        updateValue(formatValue, decimalPart);
    };

    const handleDecimalChange = (e) => {
      const value = e.target.value.replace(/\D/g, '');
      setDecimalPart(value);
    //   updateValue(integerPart, value);
    };

    const updateValue = (integer, decimal) => {
        const formatInteger = integer.replaceAll('.', '');
        const formattedDecimal = decimal.padEnd(2, '0');
        let newValue = parseFloat(`${formatInteger}.${formattedDecimal}`);
        if (onChange) {
            onChange({ target: { value: newValue, formatValue: `${integer},${formattedDecimal}` } });
        }
    };

    const handleIntegerKeyDown = (e) => {
        if (e.key === ',' || e.key === '.' || e.key === 'Enter') {
            e.preventDefault();
            decimalInputRef.current.focus();
        }
    };

    const handleDivClick = () => {
        setFocused(true);
        integerInputRef.current.focus();
    };

    const handleFocus = () => {
        setFocused(true);
        setHasBeenFocused(true);
        setRequiredMessage(isRequiredMessage);
    };

    const handleBlur = (e) => {
        setFocused(false);
        if (onHandleBlur) {
            onHandleBlur(e);
        }
    };

    const handleIntegerBlur = (e) => {
      if(!e.target.value){
        setIntegerPart('0');
        updateValue(integerPart, decimalPart);
      }
      setFocused(false);
      if (onHandleBlur) {
          onHandleBlur(e);
      }
    };

    const handleDecimalBlur = (e) => {
      const paddedDecimal = decimalPart.padEnd(2, '0');
      setDecimalPart(paddedDecimal);
      updateValue(integerPart, paddedDecimal);
      setFocused(false);
      if (onHandleBlur) {
          onHandleBlur(e);
      }
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
        if (isRequired && hasBeenFocused && integerPart === '' && decimalPart === '') {
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
    };

    const getColorClass = () => {
        return colorMap[color] ? colorMap[color][variant] || '' : '';
    };
    
    const containerClassNames = `relative w-full shadow-sm flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text 
        ${getHeightClass()}
        ${requiredStyles()}
        ${isDisabled && 'opacity-50'}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${variant === 'underlined' ? 'rounded-0' : radius}
        ${getColorClass()}
        ${focused && (variant === 'bordered' || variant === 'underlined') ? '!border-zinc-800 dark:!border-white' : ''}
        ${focused && (variant === 'flat' || variant === 'faded' || variant === 'tmn') ? 'outline outline-sky-500 dark:outline-sky-700 outline-offset-1' : ''}
    `;
    
    const labelClassNames = `absolute z-10 text-base font-normal pointer-events-none origin-top-left subpixel-antialiased block cursor-text transition-transform transition-color transition-left ease-out duration-200 
        ${(integerPart !== '' || decimalPart !== '' || focused || placeholder) ? 'text-zinc-600 dark:text-zinc-300 scale-75 -translate-y-2' : 'scale-100 translate-y-0 text-zinc-500 dark:text-zinc-400'} `;
    const outsideLabelClassNames = `${isDisabled && 'opacity-50'} text-xs font-medium text-zinc-600 dark:text-zinc-400`;

    const inputClassNames = 'bg-transparent outline-none  placeholder:text-zinc-500 text-sm border-0';

    return (
        <div>
            {labelPlacement === 'outside' && label && (
                <label className={outsideLabelClassNames} htmlFor={props.id}>
                    {label} {isRequired && <span className="text-red-400">* {(isRequired && hasBeenFocused && integerPart === '' && decimalPart === '') && requiredMessage}</span>}
                </label>
            )}
            <div onClick={handleDivClick} className={containerClassNames}>
                {labelPlacement === 'inside' && label && (
                    <label className={labelClassNames} htmlFor={props.id}>
                        {label} {isRequired && <span className="text-red-400">*</span>}
                    </label>
                )}
                <div className={`flex w-full items-center justify-end h-full ${labelPlacement === 'inside' && 'translate-y-2'}`}>
                    {startContent &&
                        <div className='text-zinc-400 select-none'>
                            {startContent}
                        </div>
                    }
                    <div className='text-zinc-400 select-none w-fit'>{currency}</div>
                    <input
                        ref={integerInputRef}
                        type="text"
                        value={integerPart}
                        onChange={handleIntegerChange}
                        onKeyDown={handleIntegerKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleIntegerBlur}
                        className={`${inputClassNames} text-right w-full dark:text-white`}
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        required={isRequired}
                        placeholder={placeholder.split(',')[0]}
                    />
                    <span className="text-zinc-500 dark:text-zinc-400 mx-[2px]">,</span>
                    <input
                        ref={decimalInputRef}
                        type="text"
                        value={decimalPart}
                        onChange={handleDecimalChange}
                        onFocus={handleFocus}
                        onBlur={handleDecimalBlur}
                        className={`${inputClassNames} dark:text-zinc-200 w-8`}
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        required={isRequired}
                        maxLength={2}
                        placeholder={placeholder.split(',')[1]}
                    />
                    {endContent &&
                        <div className='text-zinc-400 ps-2 select-none'>
                            {endContent}
                        </div>
                    }
                </div>
            </div>
            {errorMessage && <p className="text-xs ms-1 mt-1 text-red-400">{errorMessage}</p>}
            {description && <p className="text-xs ms-1 mt-1 text-zinc-500">{description}</p>}
        </div>
    );
};

export {InputCurrency};