'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { AnimatePresence } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { AnimeSearchBar, AnimeStats, EmptyState, FilterInfo, YearTableRow } from './components';
import { watchedAnimesAtom } from './store';
import type { YuriDataItem } from './types';

interface AnimeTableProps {
  data: YuriDataItem[];
  className?: string;
}

export function CompactYearTable({ data, className }: AnimeTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [watchedAnimes, setWatchedAnimes] = useAtom(watchedAnimesAtom);

  // Convert watchedAnimes to Set for faster lookup - memoized
  const watchedSet = useMemo(() => new Set(watchedAnimes || []), [watchedAnimes]);

  // Group anime by year - memoized for performance
  const groupedData = useMemo(() => {
    const grouped: { [key: string]: YuriDataItem[] } = {};

    data.forEach((anime) => {
      const year = anime.date.split('/')[0];
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(anime);
    });

    // Convert to array and sort by year descending
    return Object.entries(grouped)
      .map(([year, animes]) => ({
        year,
        animes: animes.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [data]);

  // Filter data based on search - memoized for performance
  const filteredData = useMemo(() => {
    if (!globalFilter) return groupedData;

    return groupedData
      .map((group) => ({
        ...group,
        animes: group.animes.filter((anime) => anime.name.toLowerCase().includes(globalFilter.toLowerCase())),
      }))
      .filter((group) => group.animes.length > 0);
  }, [groupedData, globalFilter]);

  // Stable callback for toggle watched - uses functional update to avoid dependencies
  const toggleWatched = useCallback(
    (anime: YuriDataItem) => {
      const animeKey = `${anime.name}-${anime.date}`;
      setWatchedAnimes((prev) => {
        const current = prev || [];
        return current.includes(animeKey) ? current.filter((key) => key !== animeKey) : [...current, animeKey];
      });
    },
    [setWatchedAnimes],
  );

  // Stable callback for checking if anime is watched - uses Set for faster lookup
  const isWatched = useCallback(
    (anime: YuriDataItem) => {
      const animeKey = `${anime.name}-${anime.date}`;
      return watchedSet.has(animeKey);
    },
    [watchedSet],
  );

  // Memoized callback for search change
  const handleSearchChange = useCallback((value: string) => {
    setGlobalFilter(value);
  }, []);

  // Calculate stats - memoized for performance
  const stats = useMemo(
    () => ({
      totalAnimes: data.length,
      watchedCount: watchedAnimes?.length || 0,
    }),
    [data.length, watchedAnimes?.length],
  );

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      {/* Search Bar */}
      <AnimeSearchBar value={globalFilter} onChange={handleSearchChange} />

      {/* Stats */}
      <AnimeStats watchedCount={stats.watchedCount} totalCount={stats.totalAnimes} />

      {/* Compact Year Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/15">
                <th className="w-24 px-4 py-2.5 text-left">
                  <div className="flex items-center gap-1.5 whitespace-nowrap font-semibold text-gray-800 dark:text-gray-100">
                    <Icon icon="lucide:calendar" className="h-3 w-3 text-primary" />
                    <span className="text-sm">年份</span>
                  </div>
                </th>
                <th className="px-4 py-2.5 text-left">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-100">
                    <Icon icon="lucide:cherry-blossom" className="h-3 w-3 text-primary" />
                    <span className="text-sm">动画作品</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredData.map((group, groupIndex) => (
                  <YearTableRow
                    key={group.year}
                    group={group}
                    groupIndex={groupIndex}
                    isWatched={isWatched}
                    toggleWatched={toggleWatched}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && <EmptyState />}
      </div>

      {/* Filter Info */}
      <FilterInfo filterText={globalFilter} />
    </div>
  );
}
