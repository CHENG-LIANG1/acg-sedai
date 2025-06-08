'use client';

import { Icon } from '@iconify/react';
import { useAtomValue } from 'jotai';
import { forwardRef, useCallback, useMemo } from 'react';
import { watchedAnimesAtom } from './store';

interface YuriDataItem {
  name: string;
  date: string;
}

interface PosterViewProps {
  data: YuriDataItem[];
  className?: string;
  theme?: 'light' | 'dark';
}

export const PosterView = forwardRef<HTMLDivElement, PosterViewProps>(({ data, className, theme = 'light' }, ref) => {
  const watchedAnimes = useAtomValue(watchedAnimesAtom);

  // Convert watchedAnimes to Set for faster lookup - memoized
  const watchedSet = useMemo(() => new Set(watchedAnimes || []), [watchedAnimes]);

  // Check if anime is watched - using Set for O(1) lookup
  const isWatched = useCallback(
    (anime: YuriDataItem) => {
      const animeKey = `${anime.name}-${anime.date}`;
      return watchedSet.has(animeKey);
    },
    [watchedSet],
  );

  // Group and filter data for poster
  const posterData = useMemo(() => {
    const grouped: { [key: string]: YuriDataItem[] } = {};

    data.forEach((anime) => {
      const year = anime.date.split('/')[0];
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(anime);
    });

    // Convert to array and sort by year descending
    const yearGroups = Object.entries(grouped)
      .map(([year, animes]) => ({
        year,
        animes: animes.sort((a, b) => a.name.localeCompare(b.name)),
        watchedCount: animes.filter(isWatched).length,
        totalCount: animes.length,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));

    // Filter: only show years with watched anime or recent years (last 5 years)
    const currentYear = new Date().getFullYear();
    const filteredGroups = yearGroups.filter((group) => group.watchedCount > 0 || parseInt(group.year) >= currentYear - 4);

    // Show all years without limitation
    return filteredGroups;
  }, [data, isWatched]);

  // Calculate overall stats - memoized
  const stats = useMemo(() => {
    const totalAnimes = data.length;
    const watchedCount = watchedAnimes?.length || 0;
    const completionRate = ((watchedCount / totalAnimes) * 100).toFixed(1);

    return { totalAnimes, watchedCount, completionRate };
  }, [data.length, watchedAnimes?.length]);

  // Memoize theme-based styles
  const themeStyles = useMemo(() => {
    const isDark = theme === 'dark';
    const containerWidth = 'w-[720px]';
    const padding = 'p-6';
    const titleSize = 'text-2xl';
    const iconSize = 'h-7 w-7';

    return {
      isDark,
      containerWidth,
      padding,
      titleSize,
      iconSize,
      bgColor: isDark ? '#111827' : '#ffffff',
      textColor: isDark ? '#f9fafb' : '#111827',
      cardBg: isDark ? '#1f2937' : 'linear-gradient(135deg, rgba(252, 231, 243, 0.6) 0%, rgba(243, 232, 255, 0.6) 100%)',
      cardBorder: isDark ? '#374151' : '#f9a8d4',
      itemBg: isDark
        ? 'rgba(55, 65, 81, 0.8)'
        : 'linear-gradient(135deg, rgba(252, 231, 243, 0.8) 0%, rgba(243, 232, 255, 0.8) 100%)',
      waitingBg: isDark ? 'rgba(75, 85, 99, 0.8)' : 'rgba(251, 207, 232, 0.4)',
    };
  }, [theme]);

  return (
    <div
      ref={ref}
      className={`${themeStyles.containerWidth} ${themeStyles.isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'} ${themeStyles.padding} ${className}`}
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: themeStyles.isDark ? themeStyles.bgColor : undefined,
        backgroundImage: themeStyles.isDark ? undefined : 'linear-gradient(135deg, #fdf2f8 0%, #ffffff 50%, #faf5ff 100%)',
        color: themeStyles.textColor,
        boxShadow: themeStyles.isDark
          ? undefined
          : '0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)',
      }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        {/* Stats */}
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: themeStyles.isDark ? '#f472b6' : '#be185d' }}>
              {stats.watchedCount}
            </div>
            <div className="text-xs" style={{ color: themeStyles.isDark ? '#9ca3af' : '#be185d' }}>
              已观看
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: themeStyles.isDark ? '#a78bfa' : '#7c3aed' }}>
              {stats.totalAnimes}
            </div>
            <div className="text-xs" style={{ color: themeStyles.isDark ? '#9ca3af' : '#7c3aed' }}>
              总计
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: themeStyles.isDark ? '#34d399' : '#059669' }}>
              {stats.completionRate}%
            </div>
            <div className="text-xs" style={{ color: themeStyles.isDark ? '#9ca3af' : '#059669' }}>
              完成度
            </div>
          </div>
        </div>
      </div>

      {/* Years Grid */}
      <div className="gap-4" style={{ columnCount: 2, columnGap: '1rem', columnFill: 'balance' }}>
        {posterData.map((group) => (
          <div
            key={group.year}
            className="mb-4 w-full rounded-lg border p-4"
            style={{
              background: themeStyles.cardBg,
              borderColor: themeStyles.cardBorder,
              boxShadow: themeStyles.isDark
                ? undefined
                : '0 4px 6px -1px rgba(236, 72, 153, 0.1), 0 2px 4px -1px rgba(236, 72, 153, 0.06)',
              breakInside: 'avoid',
            }}
          >
            {/* Year Header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold" style={{ color: themeStyles.isDark ? '#f472b6' : '#be185d' }}>
                  {group.year}
                </h3>
                {group.watchedCount === group.totalCount && group.totalCount > 0 && (
                  <Icon icon="lucide:crown" className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
              <div className="text-xs" style={{ color: themeStyles.isDark ? '#9ca3af' : '#be185d' }}>
                {group.watchedCount}/{group.totalCount}
              </div>
            </div>

            {/* Watched Anime List */}
            <div className="space-y-1">
              {group.animes.filter(isWatched).map((anime) => (
                <div
                  key={`${anime.name}-${anime.date}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1"
                  style={{
                    background: themeStyles.itemBg,
                    boxShadow: themeStyles.isDark
                      ? undefined
                      : '0 1px 3px 0 rgba(236, 72, 153, 0.1), 0 1px 2px 0 rgba(236, 72, 153, 0.06)',
                  }}
                >
                  <Icon icon="lucide:check-circle" className="h-2.5 w-2.5 flex-shrink-0 text-pink-500" />
                  <span className="truncate text-xs" style={{ color: themeStyles.isDark ? '#d1d5db' : '#be185d' }}>
                    {anime.name}
                  </span>
                </div>
              ))}

              {/* Show message if no watched anime but year is included */}
              {group.watchedCount === 0 && (
                <div
                  className="flex items-center gap-1.5 rounded-md px-2 py-1"
                  style={{ backgroundColor: themeStyles.waitingBg }}
                >
                  <Icon icon="lucide:clock" className="h-2.5 w-2.5 flex-shrink-0 text-gray-400" />
                  <span className="text-xs" style={{ color: themeStyles.isDark ? '#9ca3af' : '#ec4899' }}>
                    待观看 ({group.totalCount})
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="text-xs" style={{ color: themeStyles.isDark ? '#9ca3af' : '#be185d' }}>
          {new Date().toLocaleDateString('zh-CN')} • ACG Sedai
        </div>
      </div>
    </div>
  );
});

PosterView.displayName = 'PosterView';
