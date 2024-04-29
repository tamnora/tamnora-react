import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tamnora } from "tamnora-react";

const Tmn = ({init}) => {
  // Inicializa tu instancia de Tamnora
  const tmn = new Tamnora();
   

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