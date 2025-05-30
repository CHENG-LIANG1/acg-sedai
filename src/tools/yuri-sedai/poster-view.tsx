'use client';

import { STORAGE_KEY } from '@/constants/storage';
import { Icon } from '@iconify/react';
import { forwardRef, useCallback, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

interface YuriDataItem {
  name: string;
  date: string;
}

interface PosterViewProps {
  data: YuriDataItem[];
  className?: string;
  isMobile?: boolean;
  theme?: 'light' | 'dark';
}

export const PosterView = forwardRef<HTMLDivElement, PosterViewProps>(
  ({ data, className, isMobile = false, theme = 'light' }, ref) => {
    const [watchedAnimes] = useLocalStorage<string[]>(STORAGE_KEY.WATCHED_ANIME_LIST, []);

    // Check if anime is watched
    const isWatched = useCallback(
      (anime: YuriDataItem) => {
        const animeKey = `${anime.name}-${anime.date}`;
        return watchedAnimes?.includes(animeKey) || false;
      },
      [watchedAnimes],
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

    // Calculate overall stats
    const totalAnimes = data.length;
    const watchedCount = watchedAnimes?.length || 0;
    const completionRate = ((watchedCount / totalAnimes) * 100).toFixed(1);

    const isDark = theme === 'dark';
    const containerWidth = isMobile ? 'w-[360px]' : 'w-[720px]';
    const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-2';
    const padding = isMobile ? 'p-4' : 'p-6';
    const titleSize = isMobile ? 'text-xl' : 'text-2xl';
    const iconSize = isMobile ? 'h-6 w-6' : 'h-7 w-7';

    // Theme-based styles
    const bgColor = isDark ? '#111827' : '#ffffff';
    const textColor = isDark ? '#f9fafb' : '#111827';
    const cardBg = isDark ? '#1f2937' : '#fef7f0';
    const cardBorder = isDark ? '#374151' : '#e5e7eb';
    const itemBg = isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    const waitingBg = isDark ? 'rgba(75, 85, 99, 0.8)' : 'rgba(243, 244, 246, 0.9)';

    return (
      <div
        ref={ref}
        className={`${containerWidth} ${isDark ? 'dark bg-gray-900' : 'bg-white'} ${padding} ${className}`}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Header */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'} text-center`}>
          <div className="mb-3 flex items-center justify-center gap-2">
            <Icon icon="lucide:cherry-blossom" className={`${iconSize} text-pink-500`} />
            <h1 className={`${titleSize} font-bold`} style={{ color: isDark ? '#f9fafb' : '#1f2937' }}>
              Yuri 作品观看记录
            </h1>
            <Icon icon="lucide:cherry-blossom" className={`${iconSize} text-pink-500`} />
          </div>

          {/* Stats */}
          <div className={`flex items-center justify-center ${isMobile ? 'gap-4' : 'gap-6'}`}>
            <div className="text-center">
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}
                style={{ color: isDark ? '#f472b6' : '#dc2626' }}
              >
                {watchedCount}
              </div>
              <div className="text-xs" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                已观看
              </div>
            </div>
            <div className="text-center">
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}
                style={{ color: isDark ? '#a78bfa' : '#9333ea' }}
              >
                {totalAnimes}
              </div>
              <div className="text-xs" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                总计
              </div>
            </div>
            <div className="text-center">
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}
                style={{ color: isDark ? '#34d399' : '#059669' }}
              >
                {completionRate}%
              </div>
              <div className="text-xs" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                完成度
              </div>
            </div>
          </div>
        </div>

        {/* Years Grid */}
        <div className={`grid ${gridCols} ${isMobile ? 'gap-3' : 'gap-4'}`}>
          {posterData.map((group) => (
            <div
              key={group.year}
              className={`rounded-lg border ${isMobile ? 'p-3' : 'p-4'}`}
              style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
              }}
            >
              {/* Year Header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}
                    style={{ color: isDark ? '#f472b6' : '#be185d' }}
                  >
                    {group.year}
                  </h3>
                  {group.watchedCount === group.totalCount && group.totalCount > 0 && (
                    <Icon icon="lucide:crown" className="h-3.5 w-3.5 text-amber-500" />
                  )}
                </div>
                <div className="text-xs" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                  {group.watchedCount}/{group.totalCount}
                </div>
              </div>

              {/* Watched Anime List */}
              <div className="space-y-1">
                {group.animes.filter(isWatched).map((anime) => (
                  <div
                    key={`${anime.name}-${anime.date}`}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1"
                    style={{ backgroundColor: itemBg }}
                  >
                    <Icon icon="lucide:check-circle" className="h-2.5 w-2.5 flex-shrink-0 text-pink-500" />
                    <span className="truncate text-xs" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      {anime.name}
                    </span>
                  </div>
                ))}

                {/* Show message if no watched anime but year is included */}
                {group.watchedCount === 0 && (
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-1" style={{ backgroundColor: waitingBg }}>
                    <Icon icon="lucide:clock" className="h-2.5 w-2.5 flex-shrink-0 text-gray-400" />
                    <span className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      待观看 ({group.totalCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`${isMobile ? 'mt-4' : 'mt-6'} text-center`}>
          <div className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            {new Date().toLocaleDateString('zh-CN')} • ACG Sedai
          </div>
        </div>
      </div>
    );
  },
);

PosterView.displayName = 'PosterView';
