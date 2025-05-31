'use client';

import { Icon } from '@iconify/react';
import React, { useCallback } from 'react';

interface AnimeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AnimeSearchBar = React.memo(function AnimeSearchBar({
  value,
  onChange,
  placeholder = '搜索你心爱的动画...',
}: AnimeSearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
        <Icon icon="lucide:search" className="h-4 w-4 text-primary" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-border/50 bg-background/70 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 backdrop-blur-md transition-all duration-300 focus:border-primary focus:bg-background/90 focus:shadow-lg focus:shadow-primary/20 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
});

AnimeSearchBar.displayName = 'AnimeSearchBar';
