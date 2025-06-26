import React from 'react';

const Navbar = ({ items }) => {
  return (
    <nav className="flex justify-between bg-zinc-800 py-4">
      <ul className="flex justify-between w-full">
        {items.map((item, index) => (
          <li key={index} className="mr-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white transition duration-300 ease-in-out"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { Navbar };

