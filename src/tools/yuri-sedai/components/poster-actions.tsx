'use client';

import { Icon } from '@iconify/react';
import React from 'react';

interface PosterActionsProps {
  isGenerating: boolean;
  isMobile: boolean;
  watchedCount: number;
  onDownload: () => void;
  onCopy: () => void;
  onReset: () => void;
}

export const PosterActions = React.memo(function PosterActions({
  isGenerating,
  isMobile,
  watchedCount,
  onDownload,
  onCopy,
  onReset,
}: PosterActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-2 text-xs font-medium text-blue-700 transition-all hover:from-blue-200 hover:to-cyan-200 hover:shadow-sm disabled:opacity-50 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 dark:hover:from-blue-800/40 dark:hover:to-cyan-800/40"
      >
        <Icon
          icon={isGenerating ? 'lucide:loader-2' : 'lucide:download'}
          className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`}
        />
        {isMobile ? '下载' : '下载海报'}
      </button>

      <button
        onClick={onCopy}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-2 text-xs font-medium text-emerald-700 transition-all hover:from-emerald-200 hover:to-teal-200 hover:shadow-sm disabled:opacity-50 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-300 dark:hover:from-emerald-800/40 dark:hover:to-teal-800/40"
      >
        <Icon
          icon={isGenerating ? 'lucide:loader-2' : 'lucide:copy'}
          className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`}
        />
        {isMobile ? '复制' : '复制海报'}
      </button>

      <button
        onClick={onReset}
        disabled={watchedCount === 0}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 px-3 py-2 text-xs font-medium text-red-700 transition-all hover:from-red-200 hover:to-orange-200 hover:shadow-sm disabled:opacity-50 dark:from-red-900/30 dark:to-orange-900/30 dark:text-red-300 dark:hover:from-red-800/40 dark:hover:to-orange-800/40"
        title="重置观看记录"
      >
        <Icon icon="lucide:rotate-ccw" className="h-3 w-3" />
        {isMobile ? '重置' : '重置记录'}
      </button>
    </div>
  );
});

PosterActions.displayName = 'PosterActions';
