'use client';

import { ClientOnly } from '@/components/common/ClientOnly';
import { Icon } from '@iconify/react';
import * as htmlToImage from 'html-to-image';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CompactYearTable } from './compact-year-table';
import type { DataSourceType, ViewType } from './components';
import {
  DataSourceEditor,
  DataSourceSelector,
  PosterActions,
  ResetConfirmDialog,
  TraditionalTable,
  ViewSelector,
} from './components';
import { popularAnimeSubset, yuriTable } from './data';
import { useDataSource } from './hooks/use-data-source';
import { PosterView } from './poster-view';
import { watchedAnimesAtom } from './store';
import { TraditionalPosterView } from './traditional-poster-view';

export function SeriesSedai() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('traditional');
  const [currentDataSource, setCurrentDataSource] = useState<DataSourceType>('popular');
  const [showDataEditor, setShowDataEditor] = useState(false);
  const { theme } = useTheme();
  const posterRef = useRef<HTMLDivElement>(null);
  const traditionalPosterRef = useRef<HTMLDivElement>(null);

  // Use jotai atom for watched animes state management
  const [watchedAnimes, setWatchedAnimes] = useAtom(watchedAnimesAtom);

  // Use the data source hook to get current data
  const { data, isCustomData } = useDataSource();

  // Get current data based on selected source, but prioritize custom data
  const currentData = isCustomData ? data : currentDataSource === 'full' ? yuriTable : popularAnimeSubset;

  // Memoized handlers for better performance
  const handleResetWatchedAnimes = useCallback(() => {
    setWatchedAnimes([]);
    setShowResetDialog(false);
    toast.success('观看记录已重置！', {
      position: 'top-right',
      autoClose: 3000,
    });
  }, [setWatchedAnimes]);

  const handleCloseResetDialog = useCallback(() => {
    setShowResetDialog(false);
  }, []);

  const handleShowResetDialog = useCallback(() => {
    setShowResetDialog(true);
  }, []);

  // Generate poster and download
  const handleDownloadPoster = useCallback(async () => {
    // Choose the correct poster ref based on current view
    const targetRef = currentView === 'traditional' ? traditionalPosterRef.current : posterRef.current;
    if (!targetRef) return;

    setIsGenerating(true);
    try {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? '#111827' : '#ffffff';

      // Use different settings for traditional view
      const isTraditionalView = currentView === 'traditional';
      const width = isTraditionalView ? 1200 : 720;

      const dataUrl = await htmlToImage.toPng(targetRef, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor,
        width,
        height: undefined,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          backgroundColor,
        },
        filter: (node) => {
          // Filter out problematic elements
          if (node.classList?.contains('no-export')) {
            return false;
          }
          return true;
        },
        cacheBust: true,
      });

      // Create download link
      // Check if we're in a client environment
      if (typeof document === 'undefined') return;

      const link = document.createElement('a');
      const themeSuffix = isDark ? 'dark-' : '';
      const viewSuffix = currentView === 'traditional' ? 'traditional-' : '';
      const sourceSuffix = currentDataSource === 'popular' ? 'popular-' : '';
      link.download = `yuri-sedai-${viewSuffix}${sourceSuffix}${themeSuffix}poster-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      const successMessage = currentView === 'traditional' ? '传统表格海报下载成功！' : '海报下载成功！';
      toast.success(successMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('下载失败，请重试', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [theme, currentView, currentDataSource]);

  // Generate poster and copy to clipboard
  const handleCopyPoster = useCallback(async () => {
    // Choose the correct poster ref based on current view
    const targetRef = currentView === 'traditional' ? traditionalPosterRef.current : posterRef.current;
    if (!targetRef) return;

    setIsGenerating(true);
    try {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? '#111827' : '#ffffff';

      // Use different settings for traditional view
      const isTraditionalView = currentView === 'traditional';
      const width = isTraditionalView ? 1200 : 720;

      const blob = await htmlToImage.toBlob(targetRef, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor,
        width,
        height: undefined,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          backgroundColor,
        },
        filter: (node) => {
          if (node.classList?.contains('no-export')) {
            return false;
          }
          return true;
        },
        cacheBust: true,
      });

      if (blob) {
        // Check if we're in a client environment and clipboard API is available
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);

          const successMessage = currentView === 'traditional' ? '传统表格海报已复制到剪贴板！' : '海报已复制到剪贴板！';
          toast.success(successMessage, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('复制失败，请重试', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [theme, currentView]);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-primary">点击动画名称标记为已看过，数据会自动保存到本地哦～</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDataEditor(!showDataEditor)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 text-xs font-medium text-purple-700 transition-all hover:from-purple-200 hover:to-pink-200 hover:shadow-sm hover:shadow-purple-200/50 disabled:opacity-50 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40"
          >
            <Icon icon={showDataEditor ? 'lucide:eye-off' : 'lucide:settings'} className="h-3 w-3" />
            <span>{showDataEditor ? '隐藏编辑' : '数据编辑'}</span>
          </button>
          <PosterActions
            isGenerating={isGenerating}
            watchedCount={watchedAnimes?.length || 0}
            onDownload={handleDownloadPoster}
            onCopy={handleCopyPoster}
            onReset={handleShowResetDialog}
          />
        </div>
      </div>
      <ClientOnly>
        {/* Data Source Editor */}
        {showDataEditor && (
          <div className="mb-4">
            <DataSourceEditor />
          </div>
        )}
        {/* View and Data Source Controls */}
        <div className="my-6 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <ViewSelector currentView={currentView} onViewChange={setCurrentView} className="flex-1" />
          <DataSourceSelector
            currentSource={currentDataSource}
            onSourceChange={setCurrentDataSource}
            fullCount={yuriTable.length}
            popularCount={popularAnimeSubset.length}
            className="flex-1"
          />
        </div>
        <ResetConfirmDialog isOpen={showResetDialog} onClose={handleCloseResetDialog} onConfirm={handleResetWatchedAnimes} />
        {/* Hidden Poster Views for Export - Matches current theme */}
        <div className="fixed -left-[9999px] -top-[9999px] z-[-1]">
          <PosterView ref={posterRef} data={currentData} theme={theme as 'light' | 'dark' | undefined} />
          <TraditionalPosterView ref={traditionalPosterRef} data={currentData} theme={theme as 'light' | 'dark' | undefined} />
        </div>

        {/* Dynamic Table View */}
        {currentView === 'compact' ? <CompactYearTable /> : <TraditionalTable />}

        {/* Footer */}
        <div className="mt-6 border-t border-pink-200/50 pt-4 dark:border-pink-800/50">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Power by{' '}
            <a href="https://x.com/_cosine_x" target="_blank" className="link-underline">
              cosine
            </a>
            {' | '}
            <a
              href="https://github.com/yusixian/acg-sedai/blob/main/src/tools/yuri-sedai/data.ts"
              target="_blank"
              className="link-underline"
            >
              编辑本页面
            </a>
            <br />
            Inspired by{' '}
            <a href="https://anime-sedai.egoist.dev/" target="_blank" className="link-underline">
              anime-sedai.egoist.dev
            </a>
            <br />用 ❤️ 制作 · 爱来自 Claude 4 · UI 不好看别喷我x
          </p>
        </div>
      </ClientOnly>
    </div>
  );
}
