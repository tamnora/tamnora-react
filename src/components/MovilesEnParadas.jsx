import React from 'react';

const MovilesEnParadas = ({ data }) => {
  return (
    <div className="flex flex-col w-full bg-zinc-50/70 dark:bg-zinc-800/70 rounded-lg overflow-hidden shadow">
      <div className="bg-zinc-200 px-3 py-3 font-semibold rounded-t-lg text-zinc-500 text-xs dark:bg-zinc-800 dark:text-zinc-400 transition-all duration-200 border-b border-zinc-200 dark:border-zinc-700">
        MOVILES EN PARADAS
      </div>
      {data.map((item) => (
        <div key={item.nro} className="flex flex-col min-w-[300px] px-3 pb-4 text-sm border-b border-zinc-200 dark:border-zinc-700">
          <h1 className="my-2 text-xs text-zinc-600 dark:text-zinc-400">{item.nro}: {item.parada} </h1>
          <div className="flex gap-2 px-3">
            {item.moviles.map((movil, index) => (
              <span key={index} className="text-sky-500 bg-sky-500/10 font-semibold px-3 py-0.5 rounded-md">
                {movil}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export {MovilesEnParadas};
