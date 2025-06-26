import React, { useEffect } from 'react'

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