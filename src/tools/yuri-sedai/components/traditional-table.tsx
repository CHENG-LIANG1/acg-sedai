'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useCallback, useMemo, useState, memo, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { AnimeSearchBar, AnimeStats, EmptyState, FilterInfo } from '.';
import { watchedAnimesAtom } from '../store';
import { useDataSource } from '../hooks/use-data-source';
import type { YuriDataItem } from '../types';

// Memoized AnimeItem component to prevent unnecessary re-renders
const AnimeItem = memo(function AnimeItem({
  anime,
  isWatched,
  onToggle,
}: {
  anime: YuriDataItem;
  isWatched: boolean;
  onToggle: (anime: YuriDataItem) => void;
}) {
  const handleClick = useCallback(() => {
    onToggle(anime);
  }, [anime, onToggle]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex min-h-[3rem] min-w-16 cursor-pointer items-center justify-center border-b border-r p-2 text-xs font-medium transition-all duration-200 ease-out',
        'hover:bg-opacity-80 focus:outline-none focus:ring-1 focus:ring-primary/40',
        isWatched
          ? 'bg-green-300 text-green-900 hover:bg-green-400 dark:bg-green-800/60 dark:text-green-200 dark:hover:bg-green-700/70'
          : 'bg-background text-gray-700 hover:bg-green-400/10 dark:text-gray-300',
      )}
      title={`${anime.name} (${anime.date})`}
    >
      <span className="line-clamp-3 text-ellipsis text-center leading-tight">{anime.name}</span>
    </div>
  );
});

interface TraditionalTableProps {
  className?: string;
}

export function TraditionalTable({ className }: TraditionalTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [watchedAnimes, setWatchedAnimes] = useAtom(watchedAnimesAtom);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Use the data source hook
  const { data, isCustomData } = useDataSource();

  // Update window width on resize
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    updateWindowWidth();

    // Add event listener
    window.addEventListener('resize', updateWindowWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  // Calculate scale factor for mobile
  const scaleFactor = useMemo(() => {
    const tableMinWidth = 1296; // 1200 (grid) + 96 (year column)
    const availableWidth = windowWidth - 32; // Account for container padding
    return Math.min(1, availableWidth / tableMinWidth);
  }, [windowWidth]);

  // Convert watchedAnimes to Set for faster lookup - memoized
  const watchedSet = useMemo(() => new Set(watchedAnimes || []), [watchedAnimes]);

  // Group anime by year - memoized for performance
  const groupedData = useMemo(() => {
    const grouped: { [key: string]: YuriDataItem[] } = {};

    data.forEach((anime) => {
      const year = anime.date.split('/')[0];
      const yearNum = parseInt(year);

      // Group logic:
      // - 2008 and earlier: one group
      // - 2009-2011: one group
      // - 2012 and later: individual years
      let groupKey: string;
      if (yearNum <= 2008) {
        groupKey = '2008年及以前';
      } else if (yearNum >= 2009 && yearNum <= 2011) {
        groupKey = '2009-2011';
      } else {
        groupKey = year;
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(anime);
    });

    // Convert to array and sort by year descending
    return Object.entries(grouped)
      .map(([year, animes]) => ({
        year,
        animes: animes.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => {
        // Handle special groups - place them at appropriate positions
        if (a.year === '2008年及以前') return 1;
        if (b.year === '2008年及以前') return -1;
        if (a.year === '2009-2011') return b.year === '2008年及以前' ? -1 : 1;
        if (b.year === '2009-2011') return a.year === '2008年及以前' ? 1 : -1;
        return parseInt(b.year) - parseInt(a.year);
      });
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

  // Update content height when filteredData changes or scale changes
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.clientHeight;
      setContentHeight(height);
    }
  }, [filteredData, scaleFactor]);

  // Stable callback for toggle watched - memoized to prevent re-renders
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

  // Stable callback for checking if anime is watched - memoized
  const getIsWatched = useCallback(
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

  // Calculate stats
  const stats = useMemo(
    () => ({
      totalAnimes: data.length,
      watchedCount: watchedAnimes?.length || 0,
    }),
    [data.length, watchedAnimes?.length],
  );

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      {/* Data Source Indicator */}
      {isCustomData && (
        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:info" className="h-4 w-4 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">当前使用自定义数据源，共 {data.length} 部作品</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <AnimeSearchBar value={globalFilter} onChange={handleSearchChange} />

      {/* Stats */}
      <AnimeStats watchedCount={stats.watchedCount} totalCount={stats.totalAnimes} />

      {/* Traditional Table */}
      <div className="w-full overflow-hidden rounded-lg border-2 border-gray-300 bg-background shadow-lg dark:border-gray-600">
        <div
          style={{
            height: scaleFactor < 1 ? `${contentHeight * scaleFactor}px` : 'auto',
            overflow: 'hidden',
          }}
        >
          <div
            ref={contentRef}
            style={{
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'top left',
              width: `${100 / scaleFactor}%`,
            }}
          >
            {/* Table Content */}
            <div className="min-w-full">
              {filteredData.map((group, groupIndex) => (
                <motion.div
                  key={group.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: groupIndex * 0.05,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                  className="flex border-b"
                >
                  {/* Year Column */}
                  <div className="flex w-28 flex-shrink-0 items-center justify-center border-b border-r-2 border-gray-300 bg-red-500 p-4 dark:border-gray-600">
                    <span className="text-lg font-bold text-white">
                      {group.year === '2008年及以前' ? '2008年及以前' : `${group.year}年`}
                    </span>
                  </div>

                  {/* Anime Grid */}
                  <div className="flex-1 p-0">
                    <div className="grid grid-cols-12">
                      {group.animes.map((anime, animeIndex) => {
                        const watched = getIsWatched(anime);
                        return (
                          <AnimeItem
                            key={`${anime.name}-${anime.date}`}
                            anime={anime}
                            isWatched={watched}
                            onToggle={toggleWatched}
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && <EmptyState />}
      </div>

      {/* Filter Info */}
      <FilterInfo filterText={globalFilter} />
    </div>
  );
}
