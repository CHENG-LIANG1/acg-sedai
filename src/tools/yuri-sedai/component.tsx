'use client';

import { ClientOnly } from '@/components/common/ClientOnly';
import { CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as htmlToImage from 'html-to-image';
import { useTheme } from 'next-themes';
import { useAtom } from 'jotai';
import { watchedAnimesAtom } from './store';
import { CompactYearTable } from './compact-year-table';
import { yuriTable } from './data';
import { YearlyAnimeTable } from './yearly-anime-table';
import { PosterView } from './poster-view';

export function YuriSedai() {
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { theme } = useTheme();
  const posterRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Use jotai atom for watched animes state management
  const [watchedAnimes, setWatchedAnimes] = useAtom(watchedAnimesAtom);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset watched animes
  const handleResetWatchedAnimes = () => {
    setWatchedAnimes([]);
    setShowResetDialog(false);
    toast.success('观看记录已重置！', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  // Generate poster and download
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);
    try {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? '#111827' : '#ffffff';

      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor,
        width: isMobile ? 360 : 720,
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
      const link = document.createElement('a');
      const themeSuffix = isDark ? 'dark-' : '';
      link.download = `yuri-sedai-${isMobile ? 'mobile-' : ''}${themeSuffix}poster-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('海报下载成功！', {
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
  };

  // Generate poster and copy to clipboard
  const handleCopyPoster = async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);
    try {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? '#111827' : '#ffffff';

      const blob = await htmlToImage.toBlob(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor,
        width: isMobile ? 360 : 720,
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
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);

        toast.success('海报已复制到剪贴板！', {
          position: 'top-right',
          autoClose: 3000,
        });
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
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-primary">点击动画名称标记为已看过，数据会自动保存到本地哦～</p>
        <div className="flex items-center gap-3">
          {/* Poster Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPoster}
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
              onClick={handleCopyPoster}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-2 text-xs font-medium text-emerald-700 transition-all hover:from-emerald-200 hover:to-teal-200 hover:shadow-sm disabled:opacity-50 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-300 dark:hover:from-emerald-800/40 dark:hover:to-teal-800/40"
            >
              <Icon
                icon={isGenerating ? 'lucide:loader-2' : 'lucide:copy'}
                className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`}
              />
              {isMobile ? '复制' : '复制海报'}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetDialog(true)}
              disabled={!watchedAnimes || watchedAnimes.length === 0}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 px-3 py-2 text-xs font-medium text-red-700 transition-all hover:from-red-200 hover:to-orange-200 hover:shadow-sm disabled:opacity-50 dark:from-red-900/30 dark:to-orange-900/30 dark:text-red-300 dark:hover:from-red-800/40 dark:hover:to-orange-800/40"
              title="重置观看记录"
            >
              <Icon icon="lucide:rotate-ccw" className="h-3 w-3" />
              {isMobile ? '重置' : '重置记录'}
            </button>
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
      </div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResetDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mx-4 w-full max-w-md rounded-2xl border border-pink-200 bg-white p-6 shadow-2xl dark:border-pink-800 dark:bg-gray-900"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <Icon icon="lucide:alert-triangle" className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">确认重置</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">此操作无法撤销</p>
                </div>
              </div>

              <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
                你确定要重置所有观看记录吗？这将清空你已标记为&ldquo;已看过&rdquo;的所有动画记录。
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetDialog(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  取消
                </button>
                <button
                  onClick={handleResetWatchedAnimes}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  确认重置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ClientOnly>
        {/* Hidden Poster View for Export - Matches current theme */}
        <div className="fixed -left-[9999px] -top-[9999px] z-[-1]">
          <PosterView ref={posterRef} data={yuriTable} isMobile={isMobile} theme={theme as 'light' | 'dark' | undefined} />
        </div>

        {/* Animated View Switching */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              ref={mainContentRef}
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
            <br />用 ❤️ 制作 · 爱来自 Claude 4 · UI 不好看别喷我x
          </p>
        </div>
      </ClientOnly>
    </div>
  );
}
