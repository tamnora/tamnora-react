import React, { useState } from 'react';

const Table = ({ data = [], columns = [], rowsPerView = 10, onRowClick, columnNames = {} }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Si columns está vacío, usa las claves del primer objeto en data como columnas
    const tableColumns = columns.length > 0 ? columns : Object.keys(data[0] || {});

    // Calcula el índice inicial y final para la paginación
    const startIndex = (currentPage - 1) * rowsPerView;
    const endIndex = startIndex + rowsPerView;

    // Filtra las filas a mostrar según la paginación
    const visibleRows = data.slice(startIndex, endIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(data.length / rowsPerView);

    // Maneja el cambio de página
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Maneja el estilo de las row
    const getRowClassName = (rowIndex) => {
        const baseClasses = 'border-t border-zinc-200 dark:border-zinc-700/70 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer';
        const evenClasses = 'bg-zinc-50 dark:bg-zinc-800/40';
        const oddClasses = 'bg-zinc-100 dark:bg-zinc-700/40';

        return rowIndex % 2 ? `${baseClasses} ${evenClasses}` : `${baseClasses} ${oddClasses}`;
    };

    return (
        <div>
            <div
                tabIndex="0"
                name="table"
                className="overflow-x-auto rounded-lg border border-zinc-400/30 dark:border-zinc-700/50 w-full tmn-fadeIn"
                style={{ outline: 'none' }}
            >
                <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
                    <thead className="text-xs border-b text-zinc-700 bg-zinc-200 dark:bg-zinc-900 border-zinc-200 uppercase dark:text-zinc-400 dark:border-zinc-800">
                        <tr className="text-md font-semibold">
                            {tableColumns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 select-none text-xs text-zinc-500 uppercase dark:text-zinc-500 whitespace-nowrap"
                                    style={{ width: 'auto' }}
                                >
                                    {columnNames[column] || column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.length > 0 ? (
                            visibleRows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={getRowClassName(rowIndex)}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {tableColumns.map((column, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-4 py-3 select-none whitespace-nowrap"
                                        >
                                            {row[column]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={tableColumns.length} className="px-4 py-3 text-center">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {data.length > 0 &&
                <div className="flex flex-col sm:flex-row sm:justify-between items-start text-zinc-700 px-4 sm:px-2 pt-4 dark:text-zinc-400">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        Página <span className="font-semibold">{currentPage}</span> de{' '}
                        <span className="font-semibold">{totalPages}</span>
                    </span>
                    <div className="inline-flex rounded-lg overflow-hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center py-2 px-3 text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white border-0 border-r  disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg
                                className="w-3.5 h-3.5 mr-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 5H1m0 0 4 4M1 5l4-4"
                                ></path>
                            </svg>
                            Anterior
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center py-2 px-3 text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white border-0 border-l  disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                            <svg
                                className="w-3.5 h-3.5 ml-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export { Table };