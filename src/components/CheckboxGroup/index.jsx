import React, { useState } from 'react';
import { Checkbox } from '../Checkbox/index.jsx';

const CheckboxGroup = ({ options, color = 'blue', classContainer = 'flex gap-2',  size = 'sm', withBorder = false, withBackground = false, onChange }) => {
  const [valores, setValores] = useState(options);

  
 
  const handleOnChange = (item, isChecked) => {
    const newValores = valores.map(opcion => {
      if(opcion.value == item){
        opcion.checked = isChecked
      } 
      return { ...opcion }
    })

    setValores(newValores);

    if (onChange) {
      onChange({item, data: newValores}); // llamar a la función de cambio de valor pasada como prop

    }
  };

  return (
    <div className={classContainer}>
          {options.map((option) => (
            <Checkbox
              key={option.value}
              checked={option.checked}
              value={option.value}
              label={option.label}
              details={option.details ?? ''}
              color={color}
              size={size}
              withBorder={withBorder}
              withBackground={withBackground}
              onChange={handleOnChange}
            
               />
          ))}
        </div>
  );
};

export { CheckboxGroup };


