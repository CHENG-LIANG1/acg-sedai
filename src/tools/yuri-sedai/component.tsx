'use client';

import { ClientOnly } from '@/components/common/ClientOnly';
import * as htmlToImage from 'html-to-image';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CompactYearTable } from './compact-year-table';
import { PosterActions, ResetConfirmDialog } from './components';
import { yuriTable } from './data';
import { PosterView } from './poster-view';
import { watchedAnimesAtom } from './store';

export function YuriSedai() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { theme } = useTheme();
  const posterRef = useRef<HTMLDivElement>(null);

  // Use jotai atom for watched animes state management
  const [watchedAnimes, setWatchedAnimes] = useAtom(watchedAnimesAtom);

  // Detect mobile device with optimized resize handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Use debounced resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

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
    if (!posterRef.current) return;

    setIsGenerating(true);
    try {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? '#111827' : '#ffffff';

      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor,
        width: 720,
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
  }, [theme, isMobile]);

  // Generate poster and copy to clipboard
  const handleCopyPoster = useCallback(async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);
    try {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? '#111827' : '#ffffff';

      const blob = await htmlToImage.toBlob(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor,
        width: 720,
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
  }, [theme]);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-primary">点击动画名称标记为已看过，数据会自动保存到本地哦～</p>
        <div className="flex items-center gap-3">
          <PosterActions
            isGenerating={isGenerating}
            isMobile={isMobile}
            watchedCount={watchedAnimes?.length || 0}
            onDownload={handleDownloadPoster}
            onCopy={handleCopyPoster}
            onReset={handleShowResetDialog}
          />
        </div>
      </div>
      <ResetConfirmDialog isOpen={showResetDialog} onClose={handleCloseResetDialog} onConfirm={handleResetWatchedAnimes} />
      <ClientOnly>
        {/* Hidden Poster View for Export - Matches current theme */}
        <div className="fixed -left-[9999px] -top-[9999px] z-[-1]">
          <PosterView ref={posterRef} data={yuriTable} theme={theme as 'light' | 'dark' | undefined} />
        </div>
        <CompactYearTable data={yuriTable} />
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
