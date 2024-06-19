import React from 'react';
import { InfoIcon } from './InfoIcon';
import { CloseIcon } from './CloseIcon';
import { ErrorIcon } from './ErrorIcon';
import { SuccessIcon } from './SuccessIcon';
import { WarningIcon } from './WarningIcon';

const Alert = (
  {
    message = '',
    type = 'default',
    radius = 'rounded-xl',
    title = 'Titulo default',
    icon = true,
    onClose,
  }) => {

  const alertType = {
    info: 'dark:text-blue-400 text-blue-800',
    danger: 'dark:text-red-400 text-red-800',
    success: 'dark:text-emerald-400 text-emerald-800',
    warning: 'dark:text-yellow-400 text-yellow-800',
    default: 'dark:text-zinc-100 text-zinc-800'
  };

  const alertIcons = {
    info: <InfoIcon />,
    danger: <ErrorIcon />,
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    default: <InfoIcon />,
  };

  return (
    <div className={`bg-white/60 dark:bg-black/60 backdrop-filter min-w-80 tmn-fadeInDown backdrop-blur-xl p-3 flex overflow-hidden ${message == '' ? 'items-center' : 'items-start'} justify-between fixed top-3 right-3 min-w-56 max-w-96 shadow-xl ${alertType[type]} ${radius}`} role="alert">
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
