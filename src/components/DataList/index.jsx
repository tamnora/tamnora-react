import React from 'react';
import {ShimmerBox} from './ShimmerBox';

const DataListItem = ({ label, value, loading, classShimmer = 'h-[14px] my-[3px] w-24' }) => {
  return (
    <div className="flex flex-col items-start px-2 py-1 rounded-lg truncate text-ellipsis">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      {loading && <ShimmerBox className={classShimmer} />}
      {!loading && <span className="text-sm font-semibold truncate  text-black dark:text-white">{value}</span>}
    </div>
  );
};

const DataList = ({ data, loading, classNameUl = '', classNameLi = '', addClassNameUl = '', addClassNameLi = '', classShimmer = 'h-[14px] my-[3px] w-24' }) => {
  return (
    <ul className={classNameUl ? classNameUl : `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 select-none w-full ${addClassNameUl}`}>
      {data.map((item, index) => (
        <li key={index} className={classNameLi ? classNameLi : `border-s-2 px-1 py-1 border-indigo-600 bg-gradient-to-tr from-white to-transparent dark:from-zinc-800 min-w-[150px] ${addClassNameLi}` }>
          <DataListItem label={item.label} value={item.value} loading={loading} classShimmer={classShimmer}/>
        </li>
      ))}
    </ul>
  );
};

export { DataList };