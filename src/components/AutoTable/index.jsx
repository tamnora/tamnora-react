import React, { useState, useEffect, useMemo, useRef } from 'react';
import './index.css'

const AutoTable = ({
  name = 'table',
  columnNames = {},
  data,
  rowsPerView = 10,
  searchText = '',
  classTextSelect = 'sm:text-sky-500 sm:dark:text-sky-500 rounded-xl border-2 border-zinc-200 dark:border-zinc-700/70 sm:border sm:border-sky-600/80 sm:dark:border-sky-700/70',
  classBgSelect,
  onRowFocus,
  onRowClick,
  onCellClick,
  extraColumns,
  columnWidths,
  renderCell,
  tdPadding = 'p-0 sm:px-4 sm:py-3',
  columnAlignments,
  columns = [],
  showRowSelection = true,
  showIconSelection = false,
  isStriped = true,
  iconSelection,
  rowFooter,
  classFooter,
  isHidden = [],
  isWrap = [],
}) => {
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

  if (isArray(data) == false) return (
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
  const optionIcon = iconSelection ? iconSelection : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 size-5 ">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>;

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
      return renderCell({ value, row, column });
    }
    return value;
  };

  const renderCellFooter = (column) => {
    if (rowFooter[column]) {
      return rowFooter[column];
    }
    return '';
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

  //border-t border-zinc-200 dark:border-zinc-700/70 

  const styleRow = `flex flex-col gap-2.5 p-4 sm:p-0 font-medium sm:font-normal sm:gap-0 sm:table-row hover:bg-zinc-200/40 dark:hover:bg-zinc-800/70 `;
  const styleRowFooter = `flex flex-col gap-1 py-3 px-4 sm:p-0 font-medium sm:font-normal sm:gap-0 sm:table-row text-sm border-t text-zinc-700 bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200  dark:text-zinc-400 dark:border-zinc-800`;
  const trA = `bg-white dark:bg-zinc-800 sm:bg-transparent sm:dark:bg-transparent ${rowPointer} `;
  const trB = `bg-white sm:bg-zinc-50 dark:bg-zinc-800 sm:dark:bg-zinc-800/20  ${rowPointer} `;
  const tr3 = `hover:text-zinc-900 dark:hover:text-zinc-100 ${rowPointer} `;
  const border = `border-2 rounded-xl sm:border-0 sm:border-t border-zinc-200 dark:border-zinc-700/70`;
  const tr1 = `${trA} ${border} hover:text-zinc-900 dark:hover:text-zinc-100`;
  const tr2 = `${trB} ${border} hover:text-zinc-800 dark:hover:text-zinc-100`;

  let classRowSelect1 = `${trA}  ${classTextSelect} `;
  let classRowSelect2 = `${trB}  ${classTextSelect} `;


  if (classBgSelect) {
    classRowSelect1 = `${classBgSelect} ${tr3} ${classTextSelect}`;
    classRowSelect2 = `${classBgSelect} ${tr3} ${classTextSelect}`;
  }

  return (
    <div>
      <>
        <div ref={tableRef} tabIndex={0} name={name} className={`overflow-x-auto sm:rounded-lg sm:border border-zinc-400/30 dark:border-zinc-700/50 w-full tmn-fadeIn `} style={{ outline: 'none' }}>
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="hidden sm:table-header-group text-xs border-b text-zinc-700 bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 uppercase dark:text-zinc-400 dark:border-zinc-800">
              <tr className="text-base font-semibold">
                {showRowSelection && showIconSelection && <th></th>}
                {effectiveColumns.length > 0 && effectiveColumns.map((column, index) => {
                  if (!isHidden.includes(column)) return (
                    <th
                      key={column}
                      className={`px-4 py-4 select-none text-xs text-zinc-500 uppercase dark:text-zinc-500 md:whitespace-nowrap ${getColumnAlignmentClass(column)}`}
                      style={{ width: columnWidths ? columnWidths[column] : 'auto' }}>
                      {columnNames[column] ? columnNames[column] : column}
                    </th>
                  )
                })
                }
                {extraColumns && extraColumns.map((col, indexExtra) => (
                  <th
                    key={`extra-${indexExtra}`}
                    className={`px-4 py-4 select-none text-xs text-zinc-500 uppercase dark:text-zinc-500 md:whitespace-nowrap ${getColumnAlignmentClass(col)}`}
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
                  className={`${styleRow}
                  ${isStriped ?
                      (rowIndex % 2 ?
                        ((selectedRowIndex === rowIndex && inFocus && showRowSelection) ? classRowSelect2 : tr2)
                        :
                        ((selectedRowIndex === rowIndex && inFocus && showRowSelection) ? classRowSelect1 : tr1))
                      :
                      ((selectedRowIndex === rowIndex && inFocus && showRowSelection) ? classRowSelect2 : tr2)
                    }`}

                  onClick={onRowClick ? () => handleRowClick(row, rowIndex) : null}>
                  {(selectedRowIndex === rowIndex && inFocus && showRowSelection) && showIconSelection &&
                    <td>
                      {optionIcon}
                    </td>}
                  {!(selectedRowIndex === rowIndex && inFocus) && showRowSelection && showIconSelection &&
                    <td className='text-transparent'>{optionIcon}</td>}
                  {effectiveColumns.map((column, index) => {
                    if (!isHidden.includes(column)) return (
                      <td
                        key={column}
                        className={`${tdPadding} select-none ${isWrap.includes(column)? '': 'md:whitespace-nowrap'} ${cellPointer} ${getColumnAlignmentClass(column)} ${selectedRowIndex === rowIndex && selectedCellIndex === index && onCellClick ? 'bg-zinc-300 dark:bg-zinc-700' : ''}`}
                        onClick={onCellClick ? (e) => handleCellClick(e, row, column) : null}
                        style={{ width: columnWidths ? columnWidths[column] : 'auto' }}
                        data-label={columnNames[column] ? columnNames[column] : column}>
                        {renderCellContent(row[column], row, column)}
                      </td>
                    )
                  }
                  )}
                  {extraColumns && extraColumns.map((col, indexExtra) => (
                    <td
                      key={`extra-${indexExtra}`}
                      className={`${tdPadding} select-none ${isWrap.includes(col)? '': 'md:whitespace-nowrap'} ${cellPointer} ${getColumnAlignmentClass(col)}`}
                      onClick={onCellClick ? (e) => handleCellClick(e, row, `extra-${indexExtra}`) : null}>
                      {col.render ? col.render(row) : ''}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan={effectiveColumns.length} className={`${tdPadding} text-center`}>
                    No hay datos disponibles
                  </td>
                </tr>
              )}
              {rowFooter &&
                <tr className={classFooter ? classFooter : styleRowFooter}>
                  {showRowSelection && showIconSelection && <td></td>}
                  {effectiveColumns.map((column, index) => {
                    if (!isHidden.includes(column)) return (
                      <td
                        key={column + index}
                        className={`${tdPadding}  ${isWrap.includes(column)? '': 'md:whitespace-nowrap'} ${getColumnAlignmentClass(column)}`}

                        style={{ width: columnWidths ? columnWidths[column] : 'auto' }}>
                        {renderCellFooter(column)}
                      </td>
                    )
                  }
                  )}
                  {extraColumns && extraColumns.map((col, indexExtra) => (
                    <td
                      key={`extrafooter-${indexExtra}`}
                      className={`${tdPadding}  ${isWrap.includes(col)? '': 'md:whitespace-nowrap'} ${getColumnAlignmentClass(col)}`}
                    >
                      {renderCellFooter(col)}
                    </td>
                  ))}
                </tr>}
            </tbody>
          </table>
        </div>
        {data.length > rowsPerView &&
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center sm:items-start text-zinc-700 px-4 sm:px-2 pt-4 dark:text-zinc-400">
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