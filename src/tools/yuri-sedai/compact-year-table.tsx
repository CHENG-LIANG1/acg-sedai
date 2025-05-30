'use client';

import { STORAGE_KEY } from '@/constants/storage';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';

interface YuriDataItem {
  name: string;
  date: string;
}

interface AnimeTableProps {
  data: YuriDataItem[];
  className?: string;
}

export function CompactYearTable({ data, className }: AnimeTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [watchedAnimes, setWatchedAnimes] = useLocalStorage<string[]>(STORAGE_KEY.WATCHED_ANIME_LIST, []);

  // Group anime by year
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

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!globalFilter) return groupedData;

    return groupedData
      .map((group) => ({
        ...group,
        animes: group.animes.filter((anime) => anime.name.toLowerCase().includes(globalFilter.toLowerCase())),
      }))
      .filter((group) => group.animes.length > 0);
  }, [groupedData, globalFilter]);

  // Toggle watched status
  const toggleWatched = (anime: YuriDataItem) => {
    const animeKey = `${anime.name}-${anime.date}`;
    const newWatched = watchedAnimes?.includes(animeKey)
      ? watchedAnimes.filter((key) => key !== animeKey)
      : [...(watchedAnimes || []), animeKey];
    setWatchedAnimes(newWatched);
  };

  // Check if anime is watched
  const isWatched = (anime: YuriDataItem) => {
    const animeKey = `${anime.name}-${anime.date}`;
    return watchedAnimes?.includes(animeKey) || false;
  };

  // Calculate stats
  const totalAnimes = data.length;
  const watchedCount = watchedAnimes?.length || 0;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon icon="lucide:search" className="h-5 w-5 text-pink-400" />
        </div>
        <input
          type="text"
          placeholder="搜索你心爱的动画..."
          className="w-full rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 py-3 pl-10 pr-4 text-gray-700 placeholder-pink-400 transition-all duration-300 focus:border-pink-400 focus:bg-white focus:shadow-lg focus:shadow-pink-200/30 focus:outline-none dark:border-pink-800 dark:from-pink-950/20 dark:to-purple-950/20 dark:text-gray-300 dark:focus:border-pink-600 dark:focus:bg-gray-900 dark:focus:shadow-pink-900/30"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-pink-200/50 bg-gradient-to-r from-pink-50/80 to-purple-50/80 p-4 dark:border-pink-800/40 dark:from-pink-950/20 dark:to-purple-950/20">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:heart" className="h-4 w-4 text-pink-400" />
            <span className="text-pink-600 dark:text-pink-400">
              已看过 {watchedCount} / {totalAnimes} 部
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:target" className="h-4 w-4 text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400">
              完成度 {((watchedCount / totalAnimes) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Compact Year Table */}
      <div className="overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-purple-50 shadow-xl shadow-pink-100/50 backdrop-blur-sm dark:border-pink-800 dark:from-pink-950/10 dark:via-gray-900 dark:to-purple-950/10 dark:shadow-pink-900/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pink-200/50 dark:border-pink-800/50">
                <th className="w-20 bg-gradient-to-r from-pink-100/80 to-purple-100/80 px-4 py-3 text-left dark:from-pink-900/20 dark:to-purple-900/20">
                  <div className="flex items-center gap-2 whitespace-nowrap font-medium text-pink-700 dark:text-pink-300">
                    <Icon icon="lucide:calendar" className="h-4 w-4 text-pink-400" />
                    年份
                  </div>
                </th>
                <th className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 px-4 py-3 text-left dark:from-pink-900/20 dark:to-purple-900/20">
                  <div className="flex items-center gap-2 font-medium text-pink-700 dark:text-pink-300">
                    <Icon icon="lucide:cherry-blossom" className="h-4 w-4 text-pink-400" />
                    动画作品
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredData.map((group, groupIndex) => {
                  const groupWatchedCount = group.animes.filter(isWatched).length;

                  return (
                    <motion.tr
                      key={group.year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
                      className="border-b border-pink-100/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50/30 hover:to-purple-50/30 dark:border-pink-900/30 dark:hover:from-pink-900/10 dark:hover:to-purple-900/10"
                    >
                      {/* Year Column */}
                      <td className="px-4 py-4 align-top">
                        <div className="sticky top-0">
                          <div className="mb-1 text-xl font-bold text-pink-700 dark:text-pink-300">{group.year}</div>
                          <div className="space-y-1 text-xs text-pink-500 dark:text-pink-400">
                            <div>{group.animes.length} 部</div>
                            <div>已看 {groupWatchedCount}</div>
                            {groupWatchedCount === group.animes.length && group.animes.length > 0 && (
                              <Icon icon="lucide:crown" className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Anime Column */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {group.animes.map((anime, animeIndex) => {
                            const watched = isWatched(anime);

                            return (
                              <motion.button
                                key={`${anime.name}-${anime.date}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: groupIndex * 0.05 + animeIndex * 0.01,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleWatched(anime)}
                                className={cn(
                                  'group relative rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200',
                                  watched
                                    ? 'border-pink-300 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 shadow-md dark:border-pink-600 dark:from-pink-900/40 dark:to-purple-900/40 dark:text-pink-200'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-pink-700 dark:hover:bg-pink-950/20',
                                )}
                              >
                                <span className="relative z-10">{anime.name}</span>

                                {watched && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-1 -top-1 z-20"
                                  >
                                    <Icon
                                      icon="lucide:check-circle"
                                      className="h-3 w-3 rounded-full bg-white text-pink-500 dark:bg-gray-900 dark:text-pink-400"
                                    />
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Icon icon="lucide:flower-2" className="mb-4 h-16 w-16 text-pink-300 dark:text-pink-600" />
            <p className="mb-2 text-lg font-medium text-pink-600 dark:text-pink-400">没有找到相关动画</p>
            <p className="text-sm text-pink-500 dark:text-pink-500">试试调整搜索关键词吧～</p>
          </motion.div>
        )}
      </div>

      {/* Filter Info */}
      {globalFilter && (
        <div className="flex items-center justify-center gap-2 text-xs text-pink-600 dark:text-pink-400">
          <Icon icon="lucide:filter" className="h-3 w-3" />
          <span>正在搜索: &ldquo;{globalFilter}&rdquo;</span>
        </div>
      )}
    </div>
  );
}
