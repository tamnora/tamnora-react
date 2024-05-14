const InputSubmit = (props) => {
  return (
    <>
      <input
        className="py-2 px-3 text-base font-normal border rounded-s-lg w-full outline-none bg-neutral-100 text-neutral-600 focus:border-neutral-400 dark:focus:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800"
        {...props} />
      <button type="submit" className="p-2.5 text-sm font-medium text-white bg-black rounded-e-lg border border-black dark:border-neutral-700 focus:outline-non dark:bg-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H1.75A.75.75 0 0 1 1 10Z" clipRule="evenodd" />
        </svg>
      </button>
    </>
  )
}

export { InputSubmit }