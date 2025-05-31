'use client';

import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import React from 'react';

export const EmptyState = React.memo(function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-3 rounded-full bg-primary/10 p-4">
        <Icon icon="lucide:search-x" className="h-8 w-8 text-primary/60" />
      </div>
      <p className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">没有找到相关动画</p>
      <p className="text-xs text-gray-700 dark:text-gray-200">试试调整搜索关键词吧～</p>
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';
