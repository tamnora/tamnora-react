import React, { useState, useEffect, useMemo, useRef } from 'react';

const AutoTable = ({ name = 'table', columnNames = {}, data, rowsPerView = 10, searchText = '', onRowFocus, onRowClick, onCellClick, extraColumns, columnWidths, renderCell, columnAlignments, columns = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [selectedCellIndex, setSelectedCellIndex] = useState(0);
  const [inFocus, setInFocus] = useState(false);
  const tableRef = useRef(null);

  function isArray(variable) {
    return Array.isArray(variable);
  }

  if (!data) return (
		<div className={`flex flex-col items-center justify-center gap-4 text-lg text-zinc-700 dark:text-zinc-200 w-full h-64 bg-black/10 dark:bg-white/10 rounded-xl  animate-pulse`}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-red-500">
				<path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
			</svg>
			Tabla: ¡No hay datos cargados!
		</div>
	);

  if(isArray(data) == false) return (
    <div className={`flex flex-col items-center justify-center gap-4 text-lg text-zinc-700 dark:text-zinc-200 w-full h-64 bg-black/10 dark:bg-white/10 rounded-xl  animate-pulse`}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-red-500">
				<path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
			</svg>
			¡El formato de los datos de la tabla no es el correcto!
		</div>
  );

  const filteredData = useMemo(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      return data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowercasedFilter)
        )
      );
    }
    return data;
  }, [searchText, data]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredData]);

  // Utilizar las columnas especificadas o todas las columnas de los datos
  const effectiveColumns = columns.length > 0 ? columns : data.length > 0 ? Object.keys(data[0]) : [];

  const start = currentPage * rowsPerView;
  const end = start + rowsPerView;
  const paginatedData = filteredData.slice(start, end);
  const totalPages = Math.ceil(filteredData.length / rowsPerView);
  const rowPointer = onRowClick ? 'cursor-pointer' : '';
  const cellPointer = onCellClick ? 'cursor-pointer' : '';

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
            setSelectedCellIndex(prevIndex => (prevIndex + 1) % effectiveColumns.length);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            setSelectedCellIndex(prevIndex => (prevIndex - 1 + effectiveColumns.length) % effectiveColumns.length);
            break;
          case 'Enter':
            e.preventDefault();
            handleCellClick(
              { stopPropagation: () => { } },
              paginatedData[selectedRowIndex],
              effectiveColumns[selectedCellIndex]
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
          if (currentPage < (totalPages - 1)) {
            setCurrentPage(currentPage + 1);
            setSelectedRowIndex(0);
          }
          break;
        case 'PageUp':
          if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setSelectedRowIndex(rowsPerView - 1);
          }
          break;
        case 'ArrowRight':
          if (currentPage < (totalPages - 1)) {
            setCurrentPage(currentPage + 1);
            setSelectedRowIndex(0);
          }
          break;
        case 'ArrowLeft':
          if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setSelectedRowIndex(rowsPerView - 1);
          }
          break;

        default:
          break;
      }
    };

    const handleFocus = () => {
      setInFocus(true);
    };

    const handleBlur = () => {
      setInFocus(false);
    };

    const tableElement = tableRef.current;

    if (tableElement) {
      tableElement.addEventListener('keydown', handleKeyDown);
      tableElement.addEventListener('focus', handleFocus);
      tableElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('keydown', handleKeyDown);
        tableElement.removeEventListener('focus', handleFocus);
        tableElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [effectiveColumns, selectedRowIndex, selectedCellIndex, onCellClick, onRowClick]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.focus();
    }
  }, [currentPage]);

  useEffect(() => {
    idSelectedRow();
  }, [selectedRowIndex]);

  const handleRowClick = (row, index) => {
    if (onRowClick) {
      setSelectedRowIndex(index);
      onRowClick(row, index);
    }
  };

  const idSelectedRow = () => {
    const rowSelected = tableRef.current?.querySelector("[data-row='selected']");
    const indexRow = rowSelected?.getAttribute('data-id');
    if (onRowFocus && indexRow !== undefined) {
      onRowFocus(paginatedData[indexRow]);
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
      return renderCell({value, row, column});
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

  const styleRow = `border-t border-zinc-200 dark:border-zinc-700/70 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/70 `;
  const tr1 = `bg-zinc-50 dark:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-100 ${rowPointer} `;
  const tr2 = `bg-transparent hover:text-zinc-800 dark:hover:text-zinc-100 ${rowPointer} `;
  const trSelect = `bg-sky-200/20 dark:bg-sky-950/20 text-sky-600 dark:text-sky-500 ${rowPointer} `;

  

  return (
    <div>
      <>
        <div ref={tableRef} tabIndex={0} name={name} className={`overflow-x-auto rounded-lg border border-zinc-400/30 dark:border-zinc-700/50 w-full tmn-fadeIn `} style={{ outline: 'none' }}>
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs border-b text-zinc-700 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 uppercase dark:text-zinc-400 dark:border-zinc-800">
              <tr className="text-md font-semibold">
                {effectiveColumns.length > 0 && effectiveColumns.map((column, index) => (
                  <th
                    key={column}
                    className={`px-4 py-3 select-none text-xs text-zinc-500 uppercase dark:text-zinc-500 whitespace-nowrap ${getColumnAlignmentClass(index)}`}
                    style={{ width: columnWidths ? columnWidths[index] : 'auto' }}>
                    {columnNames[column] ? columnNames[column] : column}
                  </th>
                ))}
                {extraColumns && extraColumns.map((col, indexExtra) => (
                  <th
                    key={`extra-${indexExtra}`}
                    className={`px-4 py-3 select-none text-xs text-zinc-500 uppercase dark:text-zinc-500 whitespace-nowrap ${getColumnAlignmentClass(effectiveColumns.length + indexExtra)}`}
                    style={{ width: col.width || 'auto' }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  data-row={selectedRowIndex === rowIndex ? 'selected' : `fila${rowIndex}`}
                  data-id={rowIndex}
                  className={`${styleRow}${rowIndex % 2 ? ((selectedRowIndex === rowIndex && inFocus) ? trSelect : tr2) : ((selectedRowIndex === rowIndex && inFocus) ? trSelect : tr1)}`}
                  onClick={onRowClick ? () => handleRowClick(row, rowIndex) : null}>
                  {effectiveColumns.map((column, index) => (
                    <td
                      key={column}
                      className={`px-4 py-3 select-none whitespace-nowrap ${cellPointer} ${getColumnAlignmentClass(index)} ${selectedRowIndex === rowIndex && selectedCellIndex === index && onCellClick ? 'bg-zinc-300 dark:bg-zinc-700' : ''}`}
                      onClick={onCellClick ? (e) => handleCellClick(e, row, column) : null}>
                      {renderCellContent(row[column], row, column)}
                    </td>
                  ))}
                  {extraColumns && extraColumns.map((col, indexExtra) => (
                    <td
                      key={`extra-${indexExtra}`}
                      className={`px-4 py-3 select-none whitespace-nowrap ${cellPointer} ${getColumnAlignmentClass(effectiveColumns.length + indexExtra)}`}
                      onClick={onCellClick ? (e) => handleCellClick(e, row, `extra-${indexExtra}`) : null}>
                      {col.render ? col.render(row) : ''}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan={effectiveColumns.length} className="px-4 py-3 text-center">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      { data.length > 0 &&
        <div className="flex flex-col sm:flex-row sm:justify-between items-start text-zinc-700 px-4 sm:px-2 pt-4 dark:text-zinc-400">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Página <span className="font-semibold">{currentPage + 1}</span> de <span className="font-semibold">{totalPages}</span>
          </span>
          <div className="inline-flex rounded-lg overflow-hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="flex items-center justify-center py-2 px-3 text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white border-0 border-r  disabled:opacity-50 disabled:cursor-not-allowed">
              <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
              </svg>
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center justify-center py-2 px-3 text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white border-0 border-l  disabled:opacity-50 disabled:cursor-not-allowed">
              Siguiente
              <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path>
              </svg>
            </button>
          </div>
        </div>
      }
      </>
    </div>
  );
};

export { AutoTable };