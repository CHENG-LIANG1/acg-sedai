'use client';

import { Icon } from '@iconify/react';
import React from 'react';

interface AnimeStatsProps {
  watchedCount: number;
  totalCount: number;
}

export const AnimeStats = React.memo(function AnimeStats({ watchedCount, totalCount }: AnimeStatsProps) {
  const percentage = totalCount > 0 ? ((watchedCount / totalCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-gradient-to-r from-primary/15 to-primary/20 p-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="rounded-full bg-primary/40 p-1 shadow-sm">
            <Icon icon="lucide:heart" className="h-3 w-3 text-primary drop-shadow-sm" />
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-100">
            已看过 <span className="font-bold text-primary drop-shadow-sm">{watchedCount}</span> /{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> 部
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full bg-primary/40 p-1 shadow-sm">
            <Icon icon="lucide:target" className="h-3 w-3 text-primary drop-shadow-sm" />
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-100">
            完成度 <span className="font-bold text-primary drop-shadow-sm">{percentage}%</span>
          </span>
        </div>
      </div>
    </div>
  );
});

AnimeStats.displayName = 'AnimeStats';
