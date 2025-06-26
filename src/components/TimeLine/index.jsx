import React from 'react';

const TimeLine = ({ data=[], onClick, title='Lista de Items'}) => {
  return (
    <div className="p-4">
      <p className="text-neutral-600 dark:text-neutral-500 mb-2">{title}</p>
      {data.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No existen datos para mostrar</p>
      ) : (
        <ol className="relative border-l border-neutral-300 dark:border-neutral-700">
          {data.map((item) => (
            <li key={item.id} className="mb-10 ml-4">
              <div className="absolute w-3 h-3 bg-neutral-300 rounded-full mt-1.5 -left-1.5 border border-white dark:border-neutral-900 dark:bg-neutral-700"></div>
              <h3
                className="font-semibold text-emerald-700 dark:text-emerald-600 cursor-pointer w-fit"
                onClick={() => onClick && onClick(item)}
              >
                {item.title}
              </h3>
              <p className="text-base font-normal text-neutral-700 dark:text-neutral-300">{item.description}</p>
              <p className="mb-1 text-sm font-normal leading-none text-neutral-500 dark:text-neutral-500">
                {item.date} - {item.name}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export { TimeLine };