import React, { useState, useRef, useEffect } from 'react';
import { inputColor, inputOutline } from '../js/tamnora';

const InputCuenta = ({
  cuentas = {},
  variant = 'flat',
  color = 'default',
  outline = 'default',
  text = 'text-sm',
  size = 'md',
  radius = 'rounded-xl',
  label = 'Cuenta',
  fullWidth = true,
  isReadOnly = false,
  isDisabled = false,
  startContent,
  endContent,
  onChange,
  ...props
}) => {
  const [valor, setValor] = useState('');
  const [nombreCuenta, setNombreCuenta] = useState('');
  const inputRef = useRef(null);

  const formatInput = (input) => {
    const soloNumeros = input.replace(/[^0-9]/g, '');
    const secciones = [
      soloNumeros.slice(0, 1),
      soloNumeros.slice(1, 2),
      soloNumeros.slice(2, 4),
      soloNumeros.slice(4, 7),
    ];
    return secciones.filter(Boolean).join('.');
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatInput(inputValue);
    setValor(formattedValue);
    setNombreCuenta(cuentas[formattedValue] || '');
    if (onChange) onChange(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      const cuentaEncontrada = Object.keys(cuentas).find((cuenta) => cuenta.startsWith(valor));
      if (cuentaEncontrada) {
        setValor(cuentaEncontrada);
        setNombreCuenta(cuentas[cuentaEncontrada]);
      }
    }
  };

  return (
    <div className={`relative w-full ${fullWidth ? 'w-full' : 'w-auto'}`}>
      <div className={`relative flex items-center ${radius} px-3 py-2 ${inputColor(color)?.[variant] || ''} ${inputOutline(outline)}`}>
        {startContent && <div className='text-zinc-400 pe-2 select-none'>{startContent}</div>}
        <input
          type="text"
          value={valor}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          readOnly={isReadOnly}
          disabled={isDisabled}
          className={`w-full bg-transparent outline-none border-0 dark:text-white placeholder:text-zinc-500 ${text}`}
          placeholder="Ingrese la cuenta"
          {...props}
        />
        {endContent && <div className='text-zinc-400 ps-2 select-none'>{endContent}</div>}
      </div>
      <input
        type="text"
        value={nombreCuenta}
        readOnly
        className="w-full mt-2 p-2 text-sm text-gray-500 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
        placeholder="Nombre de la cuenta"
      />
    </div>
  );
};

export { InputCuenta };
