import React, { useState, useEffect, useMemo, useRef } from 'react';

const Table = ({ name = 'table', datos, cantidadPorVista, textoBuscar, onRowClick, onCellClick, extraColumns, columnWidths, renderCell, columnAlignments }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [selectedCellIndex, setSelectedCellIndex] = useState(0);
  const tableRef = useRef(null);

  const filteredData = useMemo(() => {
    if (textoBuscar) {
      const lowercasedFilter = textoBuscar.toLowerCase();
      return datos.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowercasedFilter)
        )
      );
    }
    return datos;
  }, [textoBuscar, datos]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredData]);

  const columns = datos.length > 0 ? Object.keys(datos[0]) : [];
  const start = currentPage * cantidadPorVista;
  const end = start + cantidadPorVista;
  const paginatedData = filteredData.slice(start, end);
  const totalPages = Math.ceil(filteredData.length / cantidadPorVista);
  const rowPointer = onRowClick ? 'cursor-pointer' : '';
  const cellPointer = onCellClick ? 'cursor-pointer' : '';

  const styleRow = `border-t border-neutral-200 dark:border-neutral-700/70 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 `;
  const tr1 = `bg-neutral-50/70 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-neutral-100 ${rowPointer} `;
  const tr2 = `bg-neutral-100/70 dark:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 ${rowPointer} `;
  const trSelect = `bg-neutral-300/50 dark:bg-neutral-900/80 semibold text-blue-700 dark:text-blue-500 hover:text-neutral-900 dark:hover:text-neutral-100 ${rowPointer} `;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (onCellClick) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedRowIndex(prevIndex => (prevIndex + 1) % paginatedData.length);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedRowIndex(prevIndex => (prevIndex - 1 + paginatedData.length) % paginatedData.length);
            break;
          case 'ArrowRight':
            e.preventDefault();
            setSelectedCellIndex(prevIndex => (prevIndex + 1) % columns.length);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            setSelectedCellIndex(prevIndex => (prevIndex - 1 + columns.length) % columns.length);
            break;
          case 'Enter':
            e.preventDefault();
            handleCellClick(
              { stopPropagation: () => {} },
              paginatedData[selectedRowIndex],
              columns[selectedCellIndex]
            );
            break;
          default:
            break;
        }
      } else if (onRowClick) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedRowIndex(prevIndex => (prevIndex + 1) % paginatedData.length);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedRowIndex(prevIndex => (prevIndex - 1 + paginatedData.length) % paginatedData.length);
            break;
          case 'Enter':
            e.preventDefault();
            handleRowClick(paginatedData[selectedRowIndex], selectedRowIndex);
            break;
          default:
            break;
        }
      }

      switch (e.key) {
        case 'PageDown':
            if(currentPage < (totalPages -1)){
              setCurrentPage(currentPage + 1)
            }
            break;
        case 'PageUp':
            if(currentPage > 0){
              setCurrentPage(currentPage - 1)
            }
            break;
        case 'ArrowRight':
          if(currentPage < (totalPages -1)){
            setCurrentPage(currentPage + 1)
          }
          break;
        case 'ArrowLeft':
          if(currentPage > 0){
            setCurrentPage(currentPage - 1)
          }
          break;
        
        default:
          break;
      }

    };

    const tableElement = tableRef.current;

    if (tableElement) {
      tableElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [columns, selectedRowIndex, selectedCellIndex, onCellClick, onRowClick]);

  useEffect(()=>{
    // console.log('Pagina', currentPage)
    // console.log('Total de páginas', totalPages - 1)
    tableRef.current.focus();
  },[paginatedData])

  const handleRowClick = (row, index) => {
    if (onRowClick) {
      setSelectedRowIndex(index)
      onRowClick(row, index);
    }
  };

  const handleCellClick = (e, row, cell) => {
    e.stopPropagation();
    if (onCellClick) {
      onCellClick(row, cell);
    }
  };

  const renderCellContent = (value, row, column) => {
    if (renderCell) {
      return renderCell(value, row, column);
    }
    return value;
  };

  const getColumnAlignmentClass = (index) => {
    if (!columnAlignments || !columnAlignments[index]) return '';
    switch (columnAlignments[index]) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'left':
      default:
        return 'text-left';
    }
  };

  return (
    <div>
      {datos.length > 0 ? (
        <>
          <div ref={tableRef} tabIndex={0} name={name} className='overflow-x-auto rounded-lg border border-neutral-400/30 dark:border-neutral-700/50 w-full tmn-fadeIn' style={{ outline: 'none' }}>
            <table  className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
              <thead className="text-xs border-b text-neutral-700 bg-neutral-200/70 border-neutral-200 uppercase dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-800">
                <tr className="text-md font-semibold">
                  {columns.map((column, index) => (
                    <th
                      key={column}
                      className={`px-4 py-3 select-none text-xs text-neutral-500 uppercase dark:text-neutral-500 whitespace-nowrap ${getColumnAlignmentClass(index)}`}
                      style={{ width: columnWidths ? columnWidths[index] : 'auto' }}
                    >
                      {column}
                    </th>
                  ))}
                  {extraColumns && extraColumns.map((col, indexExtra) => (
                    <th
                      key={`extra-${indexExtra}`}
                      className={`px-4 py-3 select-none text-xs text-neutral-500 uppercase dark:text-neutral-500 whitespace-nowrap ${getColumnAlignmentClass(columns.length + indexExtra)}`}
                      style={{ width: col.width || 'auto' }}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${styleRow }${rowIndex % 2 ? (selectedRowIndex === rowIndex ? trSelect: tr2) : (selectedRowIndex === rowIndex ? trSelect: tr1)}`}
                    onClick={onRowClick ? () => handleRowClick(row, rowIndex) : null}
                  >
                    {columns.map((column, index) => (
                      <td
                        key={column}
                        className={`px-4 py-3 select-none whitespace-nowrap ${cellPointer} ${getColumnAlignmentClass(index)} ${selectedRowIndex === rowIndex && selectedCellIndex === index && onCellClick ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
                        onClick={onCellClick ? (e) => handleCellClick(e, row, column) : null}
                      >
                        {renderCellContent(row[column], row, column)}
                      </td>
                    ))}
                    {extraColumns && extraColumns.map((col, indexExtra) => (
                      <td
                        key={`extra-${indexExtra}`}
                        className={`px-4 py-3 select-none whitespace-nowrap ${cellPointer} ${getColumnAlignmentClass(columns.length + indexExtra)}`}
                        onClick={onCellClick ? (e) => handleCellClick(e, row, `extra-${indexExtra}`) : null}
                      >
                        {col.render ? col.render(row) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-100/70 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400">
                <tr className="text-md font-semibold">
                  {columns.map((column, index) => (
                    <td key={index} className="px-4 py-3 select-none whitespace-nowrap"></td>
                  ))}
                  {extraColumns && extraColumns.map((col, index) => (
                    <td key={`extra-${index}`} className="px-4 py-3 select-none whitespace-nowrap"></td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-center text-neutral-700 sm:px-4 pt-2 dark:text-neutral-400">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Página <span className="font-semibold">{currentPage + 1}</span> de <span className="font-semibold">{totalPages}</span>
            </span>
            <div className="inline-flex">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white border-0 border-r rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                </svg>
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white border-0 border-l rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path>
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-neutral-700 dark:text-neutral-400">No hay información</p>
      )}
    </div>
  );
};

export { Table };
