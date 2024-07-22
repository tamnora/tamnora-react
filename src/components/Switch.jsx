import React, { useState, useRef, useEffect } from 'react';

const Switch = ({
  label,
  value,
  defaultValue = 0,
  color = 'default',
  size = 'md',
  labelPlacement = 'right',
  isDisabled = false,
  isReadOnly = false,
  onChange,
  inOn,
  inOff,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const switchRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleToggle = (e) => {
    e.preventDefault();
    if (isReadOnly || isDisabled) return;

    const newValue = internalValue === 1 ? 0 : 1;
    setInternalValue(newValue);
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  const sizeMap = {
    sm: { container: 'h-6', switch: 'w-8 h-4', thumb: 'w-3 h-3', content: 'text-xs' },
    md: { container: 'h-10', switch: 'w-11 h-6', thumb: 'w-5 h-5', content: 'text-xs' },
    lg: { container: 'h-12', switch: 'w-14 h-7', thumb: 'w-6 h-6', content: 'text-sm' },
  };

  const getSizeClasses = () => {
    return sizeMap[size] || sizeMap.md;
  };

  const colorMap = {
    default: 'bg-zinc-600 dark:bg-zinc-500',
    blue: 'bg-blue-600 dark:bg-blue-500',
    red: 'bg-red-600 dark:bg-red-500',
    green: 'bg-green-600 dark:bg-green-500',
    yellow: 'bg-yellow-600 dark:bg-yellow-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    sky: 'bg-sky-600 dark:bg-sky-500',
  };

  const getColorClass = () => {
    return colorMap[color] || colorMap.default;
  };

  const { container, switch: switchSize, thumb, content } = getSizeClasses();

  const containerClassNames = `relative flex items-center ${container} w-full`;
  const containerClassNames2 = `relative flex flex-col gap-1 items-start w-full`;

  const switchClassNames = `${switchSize} rounded-full
    ${internalValue === 1 ? getColorClass() : 'bg-zinc-300 dark:bg-zinc-600'}
    relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline outline-sky-500 dark:outline-sky-700 outline-offset-4 
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const thumbClassNames = `
    ${thumb} rounded-full
    ${internalValue === 1 ? 'translate-x-full' : 'translate-x-0'}
    pointer-events-none inline-block transform rounded-full bg-white dark:bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out
  `;

  const contentClassNames = `
    absolute inset-0 flex items-center justify-center ${content} font-medium text-white dark:text-zinc-900
    ${internalValue === 1 ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-200 ease-in-out
  `;

  const labelClassNames = `
    ${labelPlacement === 'left' ? 'mr-2' : 'ml-2'}
    ${isDisabled ? 'opacity-50' : ''}
    select-none text-sm font-medium text-zinc-900 dark:text-zinc-100
  `;

  const labelOutSide = `false text-xs font-medium text-zinc-600 dark:text-zinc-400 pt-1`;
  const labelInSide = `false text-xs font-medium text-zinc-600 dark:text-zinc-400 `;
  const containerInSide = `relative w-full flex px-3 min-h-10 flex-col items-start justify-center transition-background duration-150 outline-none py-2 cursor-text h-14`;

  const renderSwitchContent = () => (
    <>
      <span className={thumbClassNames} />
      {inOn && (
        <span className={`${contentClassNames} left-0 right-1/2`}>
          {inOn}
        </span>
      )}
      {inOff && (
        <span className={`${contentClassNames} left-1/2 right-0 ${internalValue === 0 ? 'opacity-100' : 'opacity-0'}`}>
          {inOff}
        </span>
      )}
    </>
  );

  return (
    <>
      {label && labelPlacement === 'outside' && (
        <div className='flex flex-col gap-1'>
          <span className={labelOutSide}>{label}</span>
          <div className='flex justify-start items-center h-10 py-2'>
            <button
              ref={switchRef}
              type='button'
              className={switchClassNames}
              onClick={handleToggle}
              disabled={isDisabled || isReadOnly}
              aria-checked={internalValue === 1}
              role="switch"
              tabIndex={isReadOnly || isDisabled ? -1 : 0}
            >
              {renderSwitchContent()}
            </button>
          </div>
        </div>
      )}

      {label && labelPlacement === 'inside' && (
        <div className={containerInSide}>
          <div className={containerClassNames2}>
            <span className={labelInSide}>{label}</span>
            <button
              ref={switchRef}
              type='button'
              className={switchClassNames}
              onClick={handleToggle}
              disabled={isDisabled || isReadOnly}
              aria-checked={internalValue === 1}
              role="switch"
              tabIndex={isReadOnly || isDisabled ? -1 : 0}
            >
              {renderSwitchContent()}
            </button>
          </div>
        </div>
      )}

      {(labelPlacement === 'left' || labelPlacement === 'right') && (
        <div className={containerClassNames}>
          {label && labelPlacement === 'left' && (
            <span className={labelClassNames}>{label}</span>
          )}
          <button
            ref={switchRef}
            type='button'
            className={switchClassNames}
            onClick={handleToggle}
            disabled={isDisabled || isReadOnly}
            aria-checked={internalValue === 1}
            role="switch"
            tabIndex={isReadOnly || isDisabled ? -1 : 0}
          >
            {renderSwitchContent()}
          </button>
          {label && labelPlacement === 'right' && (
            <span className={labelClassNames}>{label}</span>
          )}
        </div>
      )}
    </>
  );
};

export { Switch };