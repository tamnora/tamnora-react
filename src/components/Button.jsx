import React from "react";

export function Button({
  size = 'md',
  color = 'blue',
  radius = '',
  variant = 'solid',
  children,
  isDisabled = false,
  addClassNames = '',
  ...props
}) {
  const sizeStyles = {
    xs: 'h-6 px-2 text-xs min-w-10',
    sm: 'h-8 px-3 text-xs min-w-16',
    md: 'h-10 px-4 text-sm min-w-20',
    lg: 'h-12 px-6 text-base min-w-24',
  };

  const defaultRadius = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
  };

  const classDisable = {
    false: 'scale-100 active:scale-95 hover:opacity-90',
    true: 'opacity-50'
  }

  const colorStyles = {
    blue: {
      solid: 'ring-blue-500 bg-blue-600 text-white ',
      faded: 'ring-blue-500 bg-zinc-100 dark:bg-zinc-800 text-blue-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-blue-500 text-blue-600 dark:text-blue-400 border-2 border-blue-600 ',
      light: 'ring-blue-500 hover:bg-blue-600/25 text-blue-500',
      flat: 'ring-blue-500 bg-blue-600/25 text-blue-500 ',
      ghost: 'ring-blue-500 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white border-2 border-blue-600 hover:bg-blue-600',
      shadow: 'ring-blue-500 bg-blue-600 text-white  shadow-lg shadow-blue-500/40 dark:shadow-blue-500',
    },
    emerald: {
      solid: 'ring-emerald-500 bg-emerald-600 text-white ',
      faded: 'ring-emerald-500 bg-zinc-100 dark:bg-zinc-800 text-emerald-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-emerald-500 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 ',
      light: 'ring-emerald-500 hover:bg-emerald-600/25 text-emerald-500',
      flat: 'ring-emerald-500 bg-emerald-600/25 text-emerald-500 ',
      ghost: 'ring-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white dark:hover:text-white border-2 border-emerald-600 hover:bg-emerald-600',
      shadow: 'ring-emerald-500 bg-emerald-600 text-white  shadow-lg shadow-emerald-500/40 dark:shadow-emerald-500',
    },
    red: {
      solid: 'ring-red-500 bg-red-600 text-white ',
      faded: 'ring-red-500 bg-zinc-100 dark:bg-zinc-800 text-red-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-red-500 text-red-600 dark:text-red-400 border-2 border-red-600 ',
      light: 'ring-red-500 hover:bg-red-600/25 text-red-500',
      flat: 'ring-red-500 bg-red-600/25 text-red-500 ',
      ghost: 'ring-red-500 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white border-2 border-red-600 hover:bg-red-600',
      shadow: 'ring-red-500 bg-red-600 text-white  shadow-lg shadow-red-500/40 dark:shadow-red-500',
    },
    zinc: {
      solid: 'ring-zinc-500 bg-zinc-600 text-white ',
      faded: 'ring-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-zinc-500 text-zinc-600 dark:text-zinc-400 border-2 border-zinc-600 ',
      light: 'ring-zinc-500 hover:bg-zinc-600/25 text-zinc-500',
      flat: 'ring-zinc-500 bg-zinc-600/25 text-zinc-500 ',
      ghost: 'ring-zinc-500 text-zinc-600 dark:text-zinc-400 hover:text-white dark:hover:text-white border-2 border-zinc-600 hover:bg-zinc-600',
      shadow: 'ring-zinc-500 bg-zinc-600 text-white  shadow-lg shadow-zinc-500/40 dark:shadow-zinc-500',
    },
    yellow: {
      solid: 'ring-yellow-500 bg-yellow-600 text-white ',
      faded: 'ring-yellow-500 bg-zinc-100 dark:bg-zinc-800 text-yellow-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-yellow-500 text-yellow-600 dark:text-yellow-400 border-2 border-yellow-600 ',
      light: 'ring-yellow-500 hover:bg-yellow-600/25 text-yellow-500',
      flat: 'ring-yellow-500 bg-yellow-600/25 text-yellow-500 ',
      ghost: 'ring-yellow-500 text-yellow-600 dark:text-yellow-400 hover:text-white dark:hover:text-white border-2 border-yellow-600 hover:bg-yellow-600',
      shadow: 'ring-yellow-500 bg-yellow-600 text-white  shadow-lg shadow-yellow-500/40 dark:shadow-yellow-500',
    },
    sky: {
      solid: 'ring-sky-500 bg-sky-600 text-white ',
      faded: 'ring-sky-500 bg-zinc-100 dark:bg-zinc-800 text-sky-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-sky-500 text-sky-600 dark:text-sky-400 border-2 border-sky-600 ',
      light: 'ring-sky-500 hover:bg-sky-600/25 text-sky-500',
      flat: 'ring-sky-500 bg-sky-600/25 text-sky-500 ',
      ghost: 'ring-sky-500 text-sky-600 dark:text-sky-400 hover:text-white dark:hover:text-white border-2 border-sky-600 hover:bg-sky-600',
      shadow: 'ring-sky-500 bg-sky-600 text-white  shadow-lg shadow-sky-500/40 dark:shadow-sky-500',
    },
    black: {
      solid: 'ring-zinc-400 bg-black text-white ',
      faded: 'ring-zinc-400 bg-zinc-100 dark:bg-zinc-800 text-black border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-zinc-400 text-black dark:text-zinc-400 border-2 border-black ',
      light: 'ring-zinc-400 hover:bg-black/25 text-black',
      flat: 'ring-zinc-400 bg-black/25 text-black ',
      ghost: 'ring-zinc-400 text-black dark:text-zinc-400 hover:text-white dark:hover:text-white border-2 border-black hover:bg-black',
      shadow: 'ring-zinc-400 bg-black text-white  shadow-lg shadow-black/40 dark:shadow-black',
    },
    purple: {
      solid: 'ring-purple-500 bg-purple-600 text-white ',
      faded: 'ring-purple-500 bg-zinc-100 dark:bg-zinc-800 text-purple-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-purple-500 text-purple-600 dark:text-purple-400 border-2 border-purple-600 ',
      light: 'ring-purple-500 hover:bg-purple-600/25 text-purple-500',
      flat: 'ring-purple-500 bg-purple-600/25 text-purple-500 ',
      ghost: 'ring-purple-500 text-purple-600 dark:text-purple-400 hover:text-white dark:hover:text-white border-2 border-purple-600 hover:bg-purple-600',
      shadow: 'ring-purple-500 bg-purple-600 text-white  shadow-lg shadow-purple-500/40 dark:shadow-purple-500',
    },
    green: {
      solid: 'ring-green-500 bg-green-600 text-white ',
      faded: 'ring-green-500 bg-zinc-100 dark:bg-zinc-800 text-green-500 border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-green-500 text-green-600 dark:text-green-400 border-2 border-green-600 ',
      light: 'ring-green-500 hover:bg-green-600/25 text-green-500',
      flat: 'ring-green-500 bg-green-600/25 text-green-500 ',
      ghost: 'ring-green-500 text-green-600 dark:text-green-400 hover:text-white dark:hover:text-white border-2 border-green-600 hover:bg-green-600',
      shadow: 'ring-green-500 bg-green-600 text-white  shadow-lg shadow-green-500/40 dark:shadow-green-500',
    },
    white: {
      solid: 'ring-zinc-200 bg-white text-zinc-900 ',
      faded: 'ring-zinc-200 bg-zinc-100 dark:bg-zinc-800 text-black border-2 border-zinc-200 dark:border-zinc-700 ',
      bordered: 'ring-zinc-200 text-black dark:text-zinc-400 border-2 border-black ',
      light: 'ring-zinc-200 hover:bg-white/25 text-black',
      flat: 'ring-zinc-200 bg-white/25 text-black ',
      ghost: 'ring-zinc-200 text-black dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-900 border-2 border-black hover:bg-white',
      shadow: 'ring-zinc-200 bg-white text-zinc-900  shadow-lg shadow-black/40 dark:shadow-black',
    },
  };

  const variantStyles = colorStyles[color] || colorStyles['blue'];

  const radiusClass = radius || defaultRadius[size];
  
  const buttonClasses = [
    'group relative inline-flex items-center justify-center select-none font-normal transition-all duration-200 focus:ring',
    sizeStyles[size],
    classDisable[isDisabled],
    variantStyles[variant],
    radiusClass,
    addClassNames,
    'outline-none'
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props} disabled={isDisabled}>
      {children}
    </button>
  );
}
