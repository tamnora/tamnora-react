import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DarkModeBtn } from '../DarkModeBtn';

const defaultConfig = {
  header: {},
  footer: {},
  sections: [],
  items: []
};

const Sidebar = ({
  header = defaultConfig.header,
  footer = defaultConfig.footer,
  sections = defaultConfig.sections,
  items = defaultConfig.items,
  iconMap = {},
  isOpen, // New prop for controlling visibility
  onClose, // New prop for closing the sidebar
  // Customizable styles and positions
  fixed = true,
  position = 'left',
  width = 'w-72',
  transition = 'transition-all duration-300',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = sections.reduce((acc, section) => {
    acc[section] = filteredItems.filter(item => item.section === section);
    return acc;
  }, {});

  const {
    Search,
    User,
    LogOut
  } = iconMap;

  const sidebarClasses = [
    'sidebar',
    fixed ? 'fixed' : 'absolute',
    position === 'left' ? 'left-0' : 'right-0',
    'top-0',
    'h-full',
    'flex',
    'flex-col',
    width,
    'bg-white dark:bg-zinc-900',
    'text-zinc-800 dark:text-zinc-100',
    'border-zinc-200 dark:border-zinc-800',
    transition,
    position === 'left' ? 'border-r' : 'border-l',
    // Responsive classes
    'transform', // Enable transform for transitions
    'md:translate-x-0', // Always visible on medium screens and up
    isOpen ? 'translate-x-0' : '-translate-x-full' // Hide/show on small screens
  ].join(' ');

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside className={sidebarClasses + ' z-40'}>
      {/* Header */}
      {header && (
        <div className={`p-4 border-b border-zinc-200 dark:border-zinc-800`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {header.icon && iconMap[header.icon] && (
                React.createElement(iconMap[header.icon], {
                  className: `w-6 h-6 text-emerald-500`
                })
              )}
              <h1 className={`text-lg font-semibold text-zinc-800 dark:text-white`}>
                {header.title}
              </h1>
            </div>
            {header.hasThemeToggle && (
              <DarkModeBtn />
            )}
          </div>

          {header.hasSearch && Search && (
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400`} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              />
            </div>
          )}
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        {sections.map(section => (
          <div key={section} className="mb-6">
            <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {section}
            </h2>
            <ul className="space-y-1">
              {groupedItems[section]?.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                          isActive
                            ? `bg-emerald-500 text-white`
                            : `text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white`
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {Icon && (
                            <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
                          )}
                          <span className="truncate">{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && footer.hasLogout && (
        <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900`}>
          <div className="mb-2">
            <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
              {footer.userRole && User && <User className={`w-4 h-4 text-emerald-500`} />}
              <span className="font-medium">{footer.userRole}</span>
            </div>
          </div>
          {LogOut &&
            <button className={`flex items-center space-x-2 w-full px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors duration-150`}>
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          }
        </div>
      )}
    </aside>
    </>
  );
};

export { Sidebar };