import React, { useEffect } from 'react';

const Modal = ({ title, subtitle, children, handelModal, show, classContainer = 'w-full max-w-3xl min-h-96', onClose }) => {

  const closeModal = () => {
    handelModal();
    if(onClose){
      onClose();
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Evita que el evento se propague al contenedor interno
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    // Cleanup event listener on component unmount or when show changes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show]);

  return (
    <>
      {show && (
        <div
          tabIndex="-1"
          aria-hidden="true"
          onClick={closeModal}
          className={`fixed top-0 flex left-0 right-0 z-50 h-full min-h-screen w-full bg-neutral-900/50 dark:bg-neutral-900/70  overflow-x-hidden overflow-y-auto md:inset-0 justify-center items-center bg-opacity-75 backdrop-filter backdrop-blur-sm`}
        >
          <div
            name="modalContainer"
            onClick={stopPropagation}
            className={`relative bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg max-h-screen overflow-y-auto ${classContainer} tmn-fadeIn transition-all duration-700 ease-in-out`}
          >
            <div name="divPadre" className="relative mx-auto text-center">
              <div name="encabezado" className="flex flex-col border-b rounded-t border-neutral-200 dark:border-neutral-700">
                <div name="header" className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center px-2 pb-3 rounded-t ">
                  <div name="titleContainer" className="flex flex-col w-full">
                    {title && (
                      <h3 id="form_title" name="title" className="text-lg font-medium text-left text-neutral-600 dark:text-white leading-none">
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p id="form_subtitle" name="subtitle" className="mt-1 text-sm text-left font-normal text-neutral-500 dark:text-neutral-400 leading-tight">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-neutral-400 bg-transparent hover:bg-red-200 hover:text-red-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-red-600 dark:hover:text-white"
                      onClick={closeModal}
                    >
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                      </svg>
                      <span className="sr-only">Cerrar modal</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className='p-2 text-neutral-500 dark:text-neutral-400 text-left'>{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Modal };
