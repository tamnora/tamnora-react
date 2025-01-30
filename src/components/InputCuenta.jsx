import React, { useState } from 'react';

const InputCuenta = ({cuentas}) => {
  const [valor, setValor] = useState('');
  const [nombreCuenta, setNombreCuenta] = useState('');
  const [listCuentas, setListCuentas] = useState(cuentas || {});

  // Función para formatear el texto según el formato deseado
  const formatInput = (input) => {
    // Eliminar cualquier carácter no numérico
    const soloNumeros = input.replace(/[^0-9]/g, '');

    // Dividir los números en grupos para formar el formato deseado
    const secciones = [
      soloNumeros.slice(0, 1),
      soloNumeros.slice(1, 2),
      soloNumeros.slice(2, 4),
      soloNumeros.slice(4, 7),
    ];

    // Unir las secciones con puntos, omitiendo las vacías
    return secciones.filter(Boolean).join('.');
  };

  const handleInputChange = (e) => {
    // Obtener el valor del input y formatearlo
    const inputValue = e.target.value;
    const formattedValue = formatInput(inputValue);

    // Actualizar el estado con el valor formateado
    setValor(formattedValue);

    // Actualizar el nombre de la cuenta si existe
    if (listCuentas[formattedValue]) {
      setNombreCuenta(listCuentas[formattedValue]);
    } else {
      setNombreCuenta('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      // Buscar la cuenta más próxima cuando se presiona la tecla de espacio
      const cuentaEncontrada = Object.keys(listCuentas).find((cuenta) => cuenta.startsWith(valor));
      if (cuentaEncontrada) {
        setValor(cuentaEncontrada); // Autocompletar con la cuenta más próxima
        setNombreCuenta(listCuentas[cuentaEncontrada]); // Actualizar el nombre de la cuenta
      }
    }
  };

  

  return (
    <div className="flex gap-4">
      <input
        type="text"
        value={valor}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
        placeholder="Ingrese la cuenta"
      />
      <input
        type="text"
        value={nombreCuenta}
        readOnly
        className="block w-full p-2 text-sm text-gray-500 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
        placeholder="Nombre de la cuenta"
      />
    </div>
  );
};

export { InputCuenta };