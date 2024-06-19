import React from 'react';

const List = ({ items, className }) => {

  return (
    <ul className={`list-none ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="py-2">
          {item}
        </li>
      ))}
    </ul>
  );
};

export { List };
