'use client';

import { Icon } from '@iconify/react';
import { useAtomValue } from 'jotai';
import { forwardRef, useCallback, useMemo } from 'react';
import { watchedAnimesAtom } from './store';

interface YuriDataItem {
  name: string;
  date: string;
}

interface TraditionalPosterViewProps {
  data: YuriDataItem[];
  className?: string;
  theme?: 'light' | 'dark';
}

export const TraditionalPosterView = forwardRef<HTMLDivElement, TraditionalPosterViewProps>(
  ({ data, className, theme = 'light' }, ref) => {
    const watchedAnimes = useAtomValue(watchedAnimesAtom);

    // Convert watchedAnimes to Set for faster lookup - memoized
    const watchedSet = useMemo(() => new Set(watchedAnimes || []), [watchedAnimes]);

    // Check if anime is watched
    const isWatched = useCallback(
      (anime: YuriDataItem) => {
        const animeKey = `${anime.name}-${anime.date}`;
        return watchedSet.has(animeKey);
      },
      [watchedSet],
    );

    // Group anime by year - same logic as TraditionalTable
    const groupedData = useMemo(() => {
      const grouped: { [key: string]: YuriDataItem[] } = {};

      data.forEach((anime) => {
        const year = anime.date.split('/')[0];
        const yearNum = parseInt(year);

        // Group logic matching TraditionalTable:
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
          watchedCount: animes.filter(isWatched).length,
          totalCount: animes.length,
        }))
        .sort((a, b) => {
          // Handle special groups - place them at appropriate positions
          if (a.year === '2008年及以前') return 1;
          if (b.year === '2008年及以前') return -1;
          if (a.year === '2009-2011') return b.year === '2008年及以前' ? -1 : 1;
          if (b.year === '2009-2011') return a.year === '2008年及以前' ? 1 : -1;
          return parseInt(b.year) - parseInt(a.year);
        });
    }, [data, isWatched]);

    // Calculate overall stats
    const stats = useMemo(() => {
      const totalAnimes = data.length;
      const watchedCount = watchedAnimes?.length || 0;
      const completionRate = ((watchedCount / totalAnimes) * 100).toFixed(1);

      return { totalAnimes, watchedCount, completionRate };
    }, [data.length, watchedAnimes?.length]);

    // Theme-based styles matching TraditionalTable
    const themeStyles = useMemo(() => {
      const isDark = theme === 'dark';
      return {
        isDark,
        bgColor: isDark ? '#111827' : '#ffffff',
        textColor: isDark ? '#f9fafb' : '#111827',
        borderColor: isDark ? '#374151' : '#d1d5db',
        // Stats colors
        statsWatchedColor: '#059669', // green-600
        statsTotalColor: '#2563eb', // blue-600
        statsCompletionColor: '#7c3aed', // purple-600
        statsSecondaryColor: isDark ? '#9ca3af' : '#6b7280',
        // Year column - red-500 matching TraditionalTable
        yearBg: '#ef4444',
        // Anime cells
        watchedBg: isDark ? 'rgba(34, 197, 94, 0.6)' : '#bbf7d0', // green-300 for light, green-500/60 for dark
        watchedTextColor: isDark ? '#dcfce7' : '#166534', // green-200 for dark, green-900 for light
        unwatchedBg: isDark ? '#374151' : '#ffffff', // background color
        unwatchedTextColor: isDark ? '#d1d5db' : '#374151',
      };
    }, [theme]);

    return (
      <div
        ref={ref}
        className={`w-[1200px] p-6 ${className}`}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: themeStyles.bgColor,
          color: themeStyles.textColor,
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: themeStyles.statsWatchedColor }}>
                {stats.watchedCount}
              </div>
              <div className="text-sm" style={{ color: themeStyles.statsSecondaryColor }}>
                已观看
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: themeStyles.statsTotalColor }}>
                {stats.totalAnimes}
              </div>
              <div className="text-sm" style={{ color: themeStyles.statsSecondaryColor }}>
                总计
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: themeStyles.statsCompletionColor }}>
                {stats.completionRate}%
              </div>
              <div className="text-sm" style={{ color: themeStyles.statsSecondaryColor }}>
                完成度
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Table Style */}
        <div className="overflow-hidden rounded-lg border-2 shadow-lg" style={{ borderColor: themeStyles.borderColor }}>
          {groupedData.map((group) => (
            <div key={group.year} className="flex border-b" style={{ borderColor: themeStyles.borderColor }}>
              {/* Year Column - matching TraditionalTable */}
              <div
                className="flex w-28 flex-shrink-0 items-center justify-center border-r-2 p-4"
                style={{
                  backgroundColor: themeStyles.yearBg,
                  borderColor: themeStyles.borderColor,
                }}
              >
                <span className="text-lg font-bold text-white">
                  {group.year === '2008年及以前' ? '2008年及以前' : `${group.year}年`}
                </span>
              </div>

              {/* Anime Grid - matching TraditionalTable grid layout */}
              <div className="flex-1 p-0">
                <div className="grid grid-cols-12 gap-0">
                  {group.animes.map((anime) => {
                    const watched = isWatched(anime);
                    return (
                      <div
                        key={`${anime.name}-${anime.date}`}
                        className="flex min-h-[3rem] min-w-16 items-center justify-center border-b border-r p-2 text-xs font-medium"
                        style={{
                          backgroundColor: watched ? themeStyles.watchedBg : themeStyles.unwatchedBg,
                          color: watched ? themeStyles.watchedTextColor : themeStyles.unwatchedTextColor,
                          borderColor: themeStyles.borderColor,
                        }}
                      >
                        <span className="line-clamp-3 text-ellipsis text-center leading-tight">{anime.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="text-sm" style={{ color: themeStyles.statsSecondaryColor }}>
            {new Date().toLocaleDateString('zh-CN')} • ACG Sedai - 传统表格视图
          </div>
        </div>
      </div>
    );
  },
);

TraditionalPosterView.displayName = 'TraditionalPosterView';
