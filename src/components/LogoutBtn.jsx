import { useAuth } from "../js/auth"

export function LogoutBtn({ mediaQueries = "hidden 2xl:block" }) {
  const { logout } = useAuth()

  return (
    <button onClick={logout} className="flex items-center justify-center gap-2 py-2 px-4 text-danger-500 rounded-md w-full hover:bg-danger-50 dark:hover:bg-danger-400/10">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
      <span className={mediaQueries}>
        Cerrar Sesión
      </span>
    </button>
  )
}