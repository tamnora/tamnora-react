
import React from "react";
import {ShimmerBox} from "../Components/ShimmerBox";

const TableShimmer = ({ columns, rowCount }) => {
  // Genera filas de datos dinámicamente (puedes personalizar esto)
  const generateRows = (columns, rowCount) => {
    return Array.from({ length: rowCount }, (_, rowIndex) => {
      return (
        <tr
          key={rowIndex}
          data-row="selected"
          data-id={rowIndex}
          className="flex flex-col gap-2.5 p-4 sm:p-0 font-medium sm:font-normal sm:gap-0 sm:table-row hover:bg-zinc-200/40 dark:hover:bg-zinc-800/70 tmn-fadeIn bg-white dark:bg-zinc-900 sm:bg-transparent sm:dark:bg-transparent cursor-pointer border-2 rounded-xl sm:border-0 sm:border-t border-zinc-200 dark:border-zinc-700/70 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className="p-0 sm:px-4 sm:py-3 select-none md:whitespace-nowrap"
              data-label={column}
              style={{ width: "auto" }}
            >
              <ShimmerBox className="h-5 w-full" />
            </td>
          ))}
        </tr>
      );
    });
  };

  return (
    <div>
      <div
        tabIndex="0"
        name="table"
        className="overflow-x-auto sm:rounded-lg sm:border border-zinc-400/30 dark:border-zinc-700/50 w-full tmn-fadeIn"
        style={{ outline: "none" }}
      >
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          {/* Cabecera */}
          <thead className="hidden sm:table-header-group text-xs border-b text-zinc-700 bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 uppercase dark:text-zinc-400 dark:border-zinc-800">
            <tr className="text-base font-semibold tmn-fadeIn">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-4 select-none text-xs text-zinc-500 uppercase dark:text-zinc-500 md:whitespace-nowrap"
                  style={{ width: "auto" }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          {/* Cuerpo */}
          <tbody>{generateRows(columns, rowCount)}</tbody>
        </table>
      </div>
    </div>
  );
};

export {TableShimmer};
