'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import React from 'react';
import type { YuriDataItem } from '../types';

interface AnimeButtonProps {
  anime: YuriDataItem;
  watched: boolean;
  onClick: (anime: YuriDataItem) => void;
  index: number;
  groupIndex: number;
}

export const AnimeButton = React.memo(function AnimeButton({ anime, watched, onClick, index, groupIndex }: AnimeButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        delay: groupIndex * 0.05 + index * 0.01,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(anime)}
      className={cn(
        'group relative rounded-lg border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-all duration-300',
        watched
          ? 'border-primary bg-gradient-to-r from-primary/15 to-primary/20 text-primary shadow-md shadow-primary/25'
          : 'border-border/80 bg-background/80 text-muted-foreground backdrop-blur-sm hover:border-primary/70 hover:bg-primary/10 hover:text-primary/70 hover:shadow-md hover:shadow-primary/10',
      )}
    >
      <span className="relative z-10">{anime.name}</span>

      {watched && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="absolute -right-1.5 -top-1.5 z-20"
        >
          <div className="rounded-full bg-primary p-0.5 shadow-lg">
            <Icon icon="lucide:check" className="h-2.5 w-2.5 text-white" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
});
AnimeButton.displayName = 'AnimeButton';
