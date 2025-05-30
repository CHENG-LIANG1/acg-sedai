'use client';

import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { YearlyAnimeTable } from './yearly-anime-table';
import { CompactYearTable } from './compact-year-table';
import { yuriTable } from './data';
import { Icon } from '@iconify/react';
import { ClientOnly } from '@/components/common/ClientOnly';

export function YuriSedai() {
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-3 text-pink-700 dark:text-pink-300">
            <Icon icon="lucide:cherry-blossom" className="h-5 w-5 text-pink-300" />
          </CardTitle>
          <p className="text-xs text-pink-500 dark:text-pink-500">点击动画名称标记为已看过，数据会自动保存到本地哦～</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 rounded-full bg-pink-100/80 p-1 dark:bg-pink-900/30">
          <button
            onClick={() => setViewMode('compact')}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all ${
              viewMode === 'compact'
                ? 'bg-pink-200 text-pink-800 shadow-sm dark:bg-pink-800 dark:text-pink-200'
                : 'text-pink-600 hover:bg-pink-200/50 dark:text-pink-400 dark:hover:bg-pink-800/50'
            }`}
          >
            <Icon icon="lucide:table" className="h-3 w-3" />
            紧凑视图
          </button>
          <button
            onClick={() => setViewMode('expanded')}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all ${
              viewMode === 'expanded'
                ? 'bg-pink-200 text-pink-800 shadow-sm dark:bg-pink-800 dark:text-pink-200'
                : 'text-pink-600 hover:bg-pink-200/50 dark:text-pink-400 dark:hover:bg-pink-800/50'
            }`}
          >
            <Icon icon="lucide:layout-grid" className="h-3 w-3" />
            展开视图
          </button>
        </div>
      </div>

      {/* Animated View Switching */}
      <ClientOnly>
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              {viewMode === 'compact' ? <CompactYearTable data={yuriTable} /> : <YearlyAnimeTable data={yuriTable} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </ClientOnly>
    </div>
  );
}
