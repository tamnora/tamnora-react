import React, { useEffect, useRef } from 'react';

const Modal = ({
  children,
  name='modal',
  size = 'md',
  radius = 'lg',
  shadow = 'lg',
  backdrop = 'opaque',
  scrollBehavior = 'normal',
  placement = 'auto',
  bgClass='bg-white dark:bg-zinc-900',
  textClass='text-black dark:text-white',
  isOpen = false,
  fadeIn = 'tmn-fadeIn',
  position = 'relative',
  defaultOpen,
  isDismissable = false,
  isKeyboardDismissDisabled = false,
  shouldBlockScroll = true,
  hideCloseButton = false,
  closeButton,
  classNames: customClassNames = {},
  handleModal,
  onClose,
  title,
  subtitle,
  overflow = 'overflow-y-visible'
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(defaultOpen || false);
  const modalRef = useRef(null);

  // Función para obtener la altura del viewport
function getViewportHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

// Función para obtener la altura del div
function getDivHeight() {
  const div = document.getElementById(name);
  return div ? div.clientHeight : 0;
}

// Función para verificar si el div es más alto que el viewport
function isDivTallerThanViewport() {
  const viewportHeight = getViewportHeight();
  const divHeight = getDivHeight();
  return divHeight > viewportHeight;
}

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsModalOpen(isOpen);
    }
    setTimeout(() => {
      if(isDivTallerThanViewport(name)){
        const div = document.getElementById(name);
        div.classList.remove('md:overflow-y-visible');
        div.classList.remove('md:h-auto');
      }
    }, 200);
  }, [isOpen]);

  useEffect(() => {
    if (isModalOpen && shouldBlockScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

     // Limpieza del efecto
  return () => {
    document.body.style.overflow = '';
  };
  
  }, [isModalOpen, shouldBlockScroll]);

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClose = () => {
    if (isDismissable) {
      handleClose();
      if (handleModal) {
        handleModal();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isKeyboardDismissDisabled) {
      handleClose();
      if (handleModal) {
        handleModal();
      }
    }
  };

  

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, isKeyboardDismissDisabled]);

  const modalSizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl overflow-y-auto md:overflow-y-visible h-full md:h-auto',
    '2xl': 'max-w-2xl overflow-y-auto md:overflow-y-visible h-full md:h-auto',
    '3xl': 'max-w-3xl overflow-y-auto md:overflow-y-visible h-full md:h-auto',
    '4xl': 'max-w-4xl overflow-y-auto md:overflow-y-visible h-full md:h-auto',
    '5xl': 'max-w-5xl overflow-y-auto md:overflow-y-visible h-full md:h-auto',
    full: 'w-full h-full overflow-y-auto md:overflow-y-visible',
  };

  const modalRadius = {
    none: 'rounded-none',
    sm: 'sm:rounded-sm',
    md: 'sm:rounded-md',
    lg: 'sm:rounded-lg',
  };

  const modalShadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const modalBackdrops = {
    transparent: 'bg-transparent',
    opaque: 'bg-black bg-opacity-50',
    blur: 'backdrop-filter backdrop-blur-sm bg-black bg-opacity-50',
  };

  const modalPlacements = {
    auto: 'md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2',
    top: 'top-0 left-1/2 transform -translate-x-1/2',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 transform -translate-x-1/2',
  };

  const wrapperClasses = `${modalBackdrops[backdrop]} fixed inset-0 z-50 ${customClassNames.wrapper || ''}`;

  const baseClasses = `${modalSizes[size]} ${modalRadius[radius]} ${modalShadows[shadow]} ${modalPlacements[placement]} ${bgClass} ${textClass} ${fadeIn} ${position} ${customClassNames.base || ''}`;

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className={wrapperClasses} onClick={handleBackdropClose}>
      <div
        id={name}
        ref={modalRef}
        className={baseClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && (
          <div className={`absolute top-3 md:top-1 right-3 md:right-1 ${customClassNames.closeButton || ''}`}>
            {closeButton || (
              <button
                onClick={() => {
                  handleClose();
                  if (handleModal) {
                    handleModal();
                  }
                }}
                role="button"
                aria-label="Close"
                className=" appearance-none select-none p-2 text-zinc-500 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none"
                type="button">
                <svg className='size-6 md:size-[1rem]' aria-hidden="true" fill="none" focusable="false" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        )}

        <div className={customClassNames.header ? customClassNames.header : 'pt-6 px-6 pb-4 flex-initial flex flex-col gap-2'}>
          <h2 className='text-zinc-600 dark:text-white text-xl font-medium leading-5'>{title}</h2>
          <p className='text-zinc-400 text-sm leading-3'>{subtitle}</p>
        </div>
        <div className={`${overflow} pt-4 pb-6 px-6  ${scrollBehavior === 'inside' ? 'max-h-full' : ''} ${customClassNames.body || ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal }