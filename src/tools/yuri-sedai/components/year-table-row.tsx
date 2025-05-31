'use client';

import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import React from 'react';
import type { YearGroup, YuriDataItem } from '../types';
import { AnimeButton } from './anime-button';

interface YearTableRowProps {
  group: YearGroup;
  groupIndex: number;
  isWatched: (anime: YuriDataItem) => boolean;
  toggleWatched: (anime: YuriDataItem) => void;
}

export const YearTableRow = React.memo(function YearTableRow({
  group,
  groupIndex,
  isWatched,
  toggleWatched,
}: YearTableRowProps) {
  const groupWatchedCount = group.animes.filter(isWatched).length;
  const isAllCompleted = groupWatchedCount === group.animes.length && group.animes.length > 0;

  return (
    <motion.tr
      key={group.year}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
      className="border-b border-border/50 transition-all duration-300 hover:bg-primary/5"
    >
      {/* Year Column */}
      <td className="px-4 py-3 align-top">
        <div className="sticky top-0">
          <div className="mb-1 text-center text-lg font-bold text-primary">{group.year}</div>
          <div className="flex flex-col items-center gap-1 text-center text-xs">
            <div className="text-gray-700 dark:text-gray-200">{group.animes.length} 部</div>
            <div className="font-medium text-primary">已看 {groupWatchedCount}</div>
            {isAllCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  // Add pulsing animation
                  boxShadow: [
                    '0 0 0 0 rgba(234, 179, 8, 0.4)',
                    '0 0 0 6px rgba(234, 179, 8, 0)',
                    '0 0 0 0 rgba(234, 179, 8, 0.4)',
                  ],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                  transition: {
                    rotate: { duration: 0.3 },
                    scale: { duration: 0.2 },
                  },
                }}
                className="flex items-center gap-1 rounded-full border border-yellow-300/60 bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-100 px-2 py-0.5 shadow-sm shadow-yellow-400/30 dark:border-yellow-800/60 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:shadow-yellow-600/20"
              >
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Icon icon="lucide:crown" className="h-2.5 w-2.5 text-yellow-500" />
                </motion.div>
                <motion.span
                  className="w-auto whitespace-nowrap text-xs font-bold text-yellow-700 drop-shadow-sm dark:text-yellow-400"
                  animate={{
                    textShadow: [
                      '0 0 4px rgba(234, 179, 8, 0.3)',
                      '0 0 8px rgba(234, 179, 8, 0.6)',
                      '0 0 4px rgba(234, 179, 8, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  全部看过
                </motion.span>
              </motion.div>
            )}
          </div>
        </div>
      </td>

      {/* Anime Column */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {group.animes.map((anime, animeIndex) => (
            <AnimeButton
              key={`${anime.name}-${anime.date}`}
              anime={anime}
              watched={isWatched(anime)}
              onClick={toggleWatched}
              index={animeIndex}
              groupIndex={groupIndex}
            />
          ))}
        </div>
      </td>
    </motion.tr>
  );
});

YearTableRow.displayName = 'YearTableRow';
