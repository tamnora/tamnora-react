import React, { useState, useEffect } from "react";
import { useAuth } from "../../js/auth";
import { NavLink } from "react-router-dom";
import { TmnLogo, runCode } from "tamnora-react";
import { LogoutBtn } from "../LogoutBtn";
import { DarkModeBtn } from "../DarkModeBtn";
import { HomeIcon, UserGroupIcon, CubeIcon } from "@heroicons/react/24/solid";

import './Sidebar.css'

function reemplazarEspacios(texto) {
  // Convertir a minúsculas
  texto = texto.toLowerCase();
  // Eliminar acentos
  texto = eliminarAcentos(texto);
  // Reemplazar espacios con "_"
  texto = texto.replace(/\s+/g, "_");
  return texto;
}

function eliminarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


const Sidebar = () => {
  const auth = useAuth();
  const [routes, setRoutes] = useState([]);
  const [nombre, setNombre] = useState('Ninguno');
  

  const listIcons = {
    home: <HomeIcon className="h-5 w-5" />,
    usuarios: <UserGroupIcon className="h-5 w-5" />,
    default: <CubeIcon className="h-5 w-5" />
  }

  useEffect(() => {
    if (auth.user) {
      const id = auth.user.iduser || 0;
      setNombre(auth.user.usuario);
      const fetchMenuData = async () => {
        try {
          const tblmenuxuser = await runCode(`-st tblmenuxuser -wr iduser = ${id}`);
          const tblmenux = await runCode(`-st tblmenux`);

          const newRoutes = tblmenux.map((opcion, index) => {
            if (tblmenuxuser[0][`a${opcion.idmx}`] != 0) {
              let isKey = reemplazarEspacios(opcion.texto);
              
              return {
                to: `/${isKey == 'home' ? '' : isKey}`,
                text: opcion.texto,
                icon: listIcons[isKey] ?? listIcons.default,
                key: isKey // Usar una clave única
              };
            }
            return null;
          }).filter(route => route !== null);

          setRoutes([...newRoutes]);
        } catch (error) {
          console.error("Error fetching menu data:", error);
        }
      };

      fetchMenuData();
    }
  }, [auth]);

  if (!auth.user) {
    return null;
  }

  const activeStyle = 'tmn-fadeIn text-base flex items-center py-[0.4rem] px-4 gap-2 text-zinc-100 rounded-md bg-emerald-900 select-none py-1 w-full';
  const baseStyle = 'tmn-fadeIn text-base flex items-center py-[0.4rem] px-4 gap-2 text-white/70 dark:text-white/50 rounded-md hover:bg-emerald-900 select-none py-1 w-full';

  return (
    <aside className="bg-emerald-800 fixed top-0 left-0 z-10 w-full max-w-[280px] h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="sticky z-40 top-0 left-0 shadow-md shadow-black/10 grid grid-cols-[45px_1fr_auto] px-4 py-3 gap-1">
          <TmnLogo fcolor='fill-white' w="45" />
          <div className="flex flex-col justify-center ms-1.5">
            <span className="block text-white text-base font-normal leading-5">Sistema JDR</span>
            <p className="block text-white/60 text-xs leading-3">{nombre}</p>
          </div>
          <div className="my-auto">
            <DarkModeBtn />
          </div>
        </div>

        <div className="overflow-y-auto p-3">
          <div className="relative w-full mb-3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" className="w-5 h-5 text-emerald-700" fill="currentColor" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              type="text" 
              className="bg-emerald-900 border-none placeholder:text-emerald-700 text-white text-sm rounded-md focus:outline-none block w-full pl-10 p-2" 
              placeholder="Buscar..." />
          </div>
          <ul className="flex flex-col space-y-1 font-medium">
            {routes.map(route => (
              <NavLink key={route.key} to={route.to} className={({ isActive }) => isActive ? activeStyle : baseStyle} >
                {route.icon}
                <span className="block font-normal text-sm ">
                  {route.text}
                </span>
              </NavLink>
            ))}
          </ul>
        </div>

        <footer className="mt-auto flex flex-col p-3">
          <LogoutBtn />
        </footer>
      </div>
    </aside>
  );
};

export { Sidebar };

