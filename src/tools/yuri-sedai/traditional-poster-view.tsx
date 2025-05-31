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

        // Merge 2008 and earlier years into one group
        const groupKey = yearNum <= 2008 ? '2008年及以前' : year;

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
          // Handle special "2008年及以前" group - place it at the end
          if (a.year === '2008年及以前') return 1;
          if (b.year === '2008年及以前') return -1;
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

    // Theme-based styles
    const themeStyles = useMemo(() => {
      const isDark = theme === 'dark';
      return {
        isDark,
        bgColor: isDark ? '#111827' : '#ffffff',
        textColor: isDark ? '#f9fafb' : '#111827',
        yearBg: isDark ? '#dc2626' : '#ef4444', // red color for year column
        watchedBg: isDark ? '#059669' : '#10b981', // green for watched items
        unwatchedBg: isDark ? '#374151' : '#f3f4f6', // gray for unwatched items
        borderColor: isDark ? '#374151' : '#d1d5db',
      };
    }, [theme]);

    return (
      <div
        ref={ref}
        className={`w-[1200px] bg-white p-6 ${className}`}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: themeStyles.bgColor,
          color: themeStyles.textColor,
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Icon icon="lucide:calendar" className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold" style={{ color: themeStyles.isDark ? '#f9fafb' : '#111827' }}>
              百合动画时间表 - 观看记录
            </h1>
            <Icon icon="lucide:calendar" className="h-8 w-8 text-red-500" />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.watchedCount}</div>
              <div className="text-sm text-gray-600">已观看</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAnimes}</div>
              <div className="text-sm text-gray-600">总计</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">完成度</div>
            </div>
          </div>
        </div>

        {/* Traditional Table Style */}
        <div className="overflow-hidden rounded-lg border-2" style={{ borderColor: themeStyles.borderColor }}>
          {groupedData.map((group) => (
            <div key={group.year} className="flex border-b" style={{ borderColor: themeStyles.borderColor }}>
              {/* Year Column */}
              <div
                className="flex w-32 flex-shrink-0 items-center justify-center whitespace-pre-wrap border-r-2 text-lg font-bold text-white"
                style={{
                  backgroundColor: themeStyles.yearBg,
                  borderColor: themeStyles.borderColor,
                }}
              >
                {group.year === '2008年及以前' ? '2008年\n及以前' : `${group.year}年`}
              </div>

              {/* Anime Grid */}
              <div className="flex-1">
                <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                  {group.animes.map((anime) => {
                    const watched = isWatched(anime);
                    return (
                      <div
                        key={`${anime.name}-${anime.date}`}
                        className="flex min-h-[3rem] items-center justify-center border-b border-r p-2 text-xs font-medium"
                        style={{
                          backgroundColor: watched ? themeStyles.watchedBg : themeStyles.unwatchedBg,
                          color: watched ? 'white' : themeStyles.isDark ? '#9ca3af' : '#374151',
                          borderColor: themeStyles.borderColor,
                        }}
                      >
                        <span className="block overflow-hidden text-ellipsis text-center leading-tight">{anime.name}</span>
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
          <div className="text-sm" style={{ color: themeStyles.isDark ? '#9ca3af' : '#6b7280' }}>
            {new Date().toLocaleDateString('zh-CN')} • ACG Sedai - 传统表格视图
          </div>
        </div>
      </div>
    );
  },
);

TraditionalPosterView.displayName = 'TraditionalPosterView';
