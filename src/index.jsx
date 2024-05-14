import React, { useEffect } from 'react'
import { Tamnora } from "./js/tamnora.js";
export { default as Modal } from './components/Modal.jsx';
import { inServer, formatDate, originServer, runCode, structure, dbSelect, pesos, formatNumber, formatNumberArray, currency, defaultClass } from './js/tamnora.js';

export {Tamnora, inServer, formatDate, originServer, runCode, structure, dbSelect, pesos, formatNumber, formatNumberArray, currency, defaultClass}

const Tmn = ({init, config}) => {
  const tmn = new Tamnora(config);
  useEffect(() => {
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



export default Tmn;