import React, { useEffect } from 'react';
import { InfoIcon } from './InfoIcon';
import { CloseIcon } from './CloseIcon';
import { ErrorIcon } from './ErrorIcon';
import { SuccessIcon } from './SuccessIcon';
import { WarningIcon } from './WarningIcon';

const Alert = ({
  message = '',
  type = 'default',
  radius = 'rounded-xl',
  title = 'Titulo default',
  icon = true,
  onClose,
  timeOff,
  position = 'top-right',
}) => {
  
  const alertType = {
    info: 'dark:text-blue-400 text-blue-800',
    danger: 'dark:text-red-400 text-red-800',
    success: 'dark:text-emerald-400 text-emerald-800',
    warning: 'dark:text-yellow-400 text-yellow-800',
    default: 'dark:text-zinc-100 text-zinc-800',
  };

  const alertIcons = {
    info: <InfoIcon />,
    danger: <ErrorIcon />,
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    default: <InfoIcon />,
  };

  const positionClasses = {
    'top-left': 'top-3 left-3 tmn-fadeInDown',
    'top-center': 'top-3 left-1/2 transform -translate-x-1/2 tmn-fadeInDown',
    'top-right': 'top-3 right-3 tmn-fadeInDown',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 tmn-fadeIn',
    'bottom-left': 'bottom-3 left-3 tmn-fadeInTop',
    'bottom-center': 'bottom-3 left-1/2 transform -translate-x-1/2 tmn-fadeInTop',
    'bottom-right': 'bottom-3 right-3 tmn-fadeInTop',
  };

  useEffect(() => {
    if (timeOff) {
      const timer = setTimeout(onClose, timeOff);
      return () => clearTimeout(timer);
    }
  }, [timeOff, onClose]);

  return (
    <div className={`bg-white/60 dark:bg-black/60 backdrop-filter min-w-96  backdrop-blur-xl p-3 flex overflow-hidden ${message === '' ? 'items-center' : 'items-start'} justify-between fixed ${positionClasses[position]} min-w-56 max-w-96 shadow-xl ${alertType[type]} ${radius}  z-50`} role="alert">
      <div className='flex flex-col'>
        <h3 className='flex items-center'>
          {icon && alertIcons[type]}
          <span className='ms-1 text-sm font-semibold'>{title}</span>
        </h3>
        {message !== '' && (
          <p className='text-sm px-1 leading-4 mt-1 dark:opacity-80'>
            {message}
          </p>
        )}
      </div>
      <button className='p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10' onClick={onClose}> <CloseIcon /> </button>
    </div>
  );
};

export { Alert };
