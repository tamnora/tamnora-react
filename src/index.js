import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { Tamnora } from "./js/tamnora";
import { inServer, formatDate, originServer, runCode, structure, dbSelect, pesos, formatNumber, formatNumberArray, currency, defaultClass } from './js/tamnora.js';


export {Tamnora, inServer, formatDate, originServer, runCode, structure, dbSelect, pesos, formatNumber, formatNumberArray, currency, defaultClass}


const Tmn = ({init, config}) => {
  // Inicializa tu instancia de Tamnora
  
  const tmn = new Tamnora(config);

  useEffect(() => {
    // Llama a la función de creación al montar el componente Tmn
    const initializeTamnora = async () => {
      if (init) {
        await init(tmn);
      }
    };

    initializeTamnora();
  }, []);

  return (
    <div id='tmn'></div>
  );
}

Tmn.propTypes = {
  init: PropTypes.func.isRequired,
};

export default Tmn;