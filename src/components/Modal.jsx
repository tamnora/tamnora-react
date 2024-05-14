const Modal = () => {
  return (
    <>
      <div id="form_mod" tabindex="-1" name="divModal" aria-hidden="true" class="fixed top-0 flex left-0 right-0 z-50 h-full min-h-screen w-full bg-neutral-900/50 dark:bg-neutral-900/70  overflow-x-hidden overflow-y-auto md:inset-0 justify-center items-center bg-opacity-75 backdrop-filter backdrop-blur-sm">
        <div name="modalContainer" class="relative w-full max-w-3xl  bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg max-h-screen overflow-y-auto tmn-fadeIn transition-all duration-700 ease-in-out">
          <div name="divPadre" class="relative container mx-auto max-w-screen-lg bg-transparent  shadow-none tmn-fadeIn">
            <div name="encabezado" class="flex flex-col border-b rounded-t border-neutral-200 dark:border-neutral-700">
              <div name="header" class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center px-2 pb-3 rounded-t ">
                <div name="titleContainer" class="flex flex-col w-full">
                  <h3 id="form_title" name="title" class="text-lg font-medium text-left text-neutral-600 dark:text-white leading-none">Formulario de edición</h3>
                  <p id="form_subtitle" name="subtitle" class="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-tight">Alta, baja y modificación de contenidos</p>
                </div>
                <div>
                  <button name="btnCloseModal" data-modal="closeModal,form" type="button" class="text-neutral-400 bg-transparent hover:bg-red-200 hover:text-red-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-red-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}



export default Modal;