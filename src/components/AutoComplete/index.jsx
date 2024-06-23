import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../Input';

const AutoComplete = ({
  data, 
  columnSearch, 
  sarta = false, 
  keyReturn,
  emptyData = "No hay sugerencias",
  enforceSelection = false,
  startLetter = 0,
  onSelect,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const suggestionsRef = useRef([]);

  const handleChange = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);
    if (userInput.length > startLetter) {
      const filtered = data.filter(item =>
        sarta
          ? item[columnSearch].toLowerCase().includes(userInput.toLowerCase())
          : item[columnSearch].toLowerCase().startsWith(userInput.toLowerCase())
      );
      setFilteredData(filtered);
      setShowSuggestions(true);
      console.log(filtered);
      setActiveSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClick = (item) => {
    setQuery(item[columnSearch]);
    setSelectedItem(item);
    setShowSuggestions(false);
    // console.log(item)
    // console.log(item[keyReturn]);
    // console.log('item', item[columnSearch])
    if(onSelect){
      onSelect({data: item, columnSearch: item[columnSearch], value: item[keyReturn] })
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (activeSuggestion < filteredData.length - 1) {
        setActiveSuggestion(activeSuggestion + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestion > 0) {
        setActiveSuggestion(activeSuggestion - 1);
      }
    } else if (e.key === 'Enter') {
      if (filteredData.length > 0) {
        handleClick(filteredData[activeSuggestion]);
        setShowSuggestions(false)
      }
    }
  };

  useEffect(() => {
    if (suggestionsRef.current[activeSuggestion]) {
      suggestionsRef.current[activeSuggestion].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeSuggestion]);

  return (
    <div className="relative w-full tmn-fadeIn">
      <Input
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={query}
        {...props}
      />
      {showSuggestions && query && (
        <div className="absolute z-20 mt-2 w-full bg-zinc-100 dark:bg-zinc-800/80 shadow-lg rounded-xl text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 tmn-fadeIn">
          <ul className="p-2 max-h-72 overflow-y-auto">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <li
                key={item[keyReturn]}
                ref={(el) => suggestionsRef.current[index] = el}
                className={`cursor-pointer px-2 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg  ${
                  index === activeSuggestion ? 'bg-sky-200 dark:bg-sky-700 text-sky-700 dark:text-sky-200' : ''
                }`}
                onClick={() => handleClick(item)}
              >
                {item[columnSearch]}
              </li>
            ))
          ) : (
            <li className="px-2 py-1.5 bg-red-200 text-red-700 rounded-lg dark:bg-red-700 dark:text-red-200">{emptyData}</li>
          )}
        </ul>
        </div>
      )}
    </div>
  );
};

export { AutoComplete };
