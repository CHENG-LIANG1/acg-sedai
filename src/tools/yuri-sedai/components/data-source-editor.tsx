'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import { useCallback, useMemo } from 'react';
import ReactJson from 'react-json-view';
import { toast } from 'react-toastify';
import { yuriTable, popularAnimeSubset } from '../data';
import { yuriDataSourceAtom } from '../store';
import type { YuriDataItem } from '../types';

interface DataSourceEditorProps {
  className?: string;
}

export function DataSourceEditor({ className }: DataSourceEditorProps) {
  const [customDataSource, setCustomDataSource] = useAtom(yuriDataSourceAtom);
  const { theme } = useTheme();
  // Use custom data source if available, otherwise use default
  const currentDataSource = useMemo(() => {
    return customDataSource || yuriTable;
  }, [customDataSource]);

  const isUsingCustomData = Boolean(customDataSource);

  // Handle JSON data change from JsonView editing
  const handleDataChange = useCallback(
    (newData: YuriDataItem[]) => {
      try {
        // Validate the new data structure
        if (!Array.isArray(newData)) {
          throw new Error('数据必须是数组格式');
        }

        for (let i = 0; i < newData.length; i++) {
          const item = newData[i];
          if (!item.name || !item.date || typeof item.name !== 'string' || typeof item.date !== 'string') {
            throw new Error(`第 ${i + 1} 项数据格式不正确：需要包含 name 和 date 字段，且均为字符串类型`);
          }
        }

        setCustomDataSource(newData);
        toast.success('数据源已成功保存！');
      } catch (error) {
        toast.error(`保存失败：${error instanceof Error ? error.message : '数据格式错误'}`);
      }
    },
    [setCustomDataSource],
  );

  const handleResetToDefault = useCallback(() => {
    setCustomDataSource(null);
    toast.success('已重置为默认数据源！');
  }, [setCustomDataSource]);

  const handleUsePopularAsBase = useCallback(() => {
    setCustomDataSource([...popularAnimeSubset]);
    toast.success('已加载热门精选数据作为编辑基础！');
  }, [setCustomDataSource]);

  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const jsonData = JSON.parse(jsonString);

          if (!Array.isArray(jsonData)) {
            throw new Error('JSON 文件必须包含数组格式的数据');
          }

          // Validate imported data
          for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i];
            if (!item.name || !item.date || typeof item.name !== 'string' || typeof item.date !== 'string') {
              throw new Error(`第 ${i + 1} 项数据格式不正确：需要包含 name 和 date 字段，且均为字符串类型`);
            }
          }

          setCustomDataSource(jsonData);
          toast.success('JSON 文件已成功导入！');
        } catch (error) {
          toast.error(`导入失败：${error instanceof Error ? error.message : '无效的 JSON 格式'}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setCustomDataSource]);

  const handleExportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(currentDataSource, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yuri-anime-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('数据已导出为 JSON 文件！');
  }, [currentDataSource]);

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      {/* Header Card */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/15 to-primary/20 p-3 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/40 p-1.5 shadow-sm">
              <Icon icon="lucide:database" className="h-4 w-4 text-primary drop-shadow-sm" />
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">数据源管理</h3>
              {isUsingCustomData && (
                <span className="w-fit rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-2.5 py-0.5 text-xs font-medium text-green-800 shadow-sm dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-200">
                  自定义数据
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/30 p-1 shadow-sm">
              <Icon icon="lucide:archive" className="h-3 w-3 text-primary drop-shadow-sm" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              当前数据量：<span className="font-bold text-primary">{currentDataSource.length}</span> 部作品
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:from-blue-200 hover:to-cyan-200 hover:shadow-sm hover:shadow-blue-200/50 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 dark:hover:from-blue-800/40 dark:hover:to-cyan-800/40"
        >
          <Icon icon="lucide:download" className="h-4 w-4" />
          导出 JSON
        </button>
        <button
          onClick={handleImportJSON}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 text-sm font-medium text-purple-700 transition-all hover:from-purple-200 hover:to-pink-200 hover:shadow-sm hover:shadow-purple-200/50 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40"
        >
          <Icon icon="lucide:upload" className="h-4 w-4" />
          导入 JSON
        </button>
        <button
          onClick={handleUsePopularAsBase}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-2 text-sm font-medium text-amber-700 transition-all hover:from-amber-200 hover:to-orange-200 hover:shadow-sm hover:shadow-amber-200/50 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 dark:hover:from-amber-800/40 dark:hover:to-orange-800/40"
        >
          <Icon icon="lucide:star" className="h-4 w-4" />
          使用热门精选数据源
        </button>
        {isUsingCustomData && (
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:from-gray-200 hover:to-slate-200 hover:shadow-sm hover:shadow-gray-200/50 dark:from-gray-800/30 dark:to-slate-800/30 dark:text-gray-300 dark:hover:from-gray-700/40 dark:hover:to-slate-700/40"
          >
            <Icon icon="lucide:rotate-ccw" className="h-4 w-4" />
            重置为默认
          </button>
        )}
      </div>

      {/* Interactive JSON Editor */}
      <div className="overflow-hidden rounded-xl border-2 border-border bg-background shadow-lg">
        <div className="border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/30 p-1 shadow-sm">
                <Icon icon="lucide:edit-3" className="h-3 w-3 text-primary drop-shadow-sm" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">在线编辑数据源</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">点击值可直接编辑</span>
            </div>
          </div>
        </div>
        <div className="p-4 dark:bg-[#151515]">
          <ReactJson
            src={currentDataSource}
            theme={theme === 'dark' ? 'summerfruit' : 'summerfruit:inverted'}
            onEdit={(e) => {
              // Handle the edit event and update the data source
              if (e.updated_src && Array.isArray(e.updated_src)) {
                handleDataChange(e.updated_src);
              }
            }}
            onAdd={(e) => {
              // Handle adding new items
              if (e.updated_src && Array.isArray(e.updated_src)) {
                handleDataChange(e.updated_src);
              }
            }}
            onDelete={(e) => {
              // Handle deleting items
              if (e.updated_src && Array.isArray(e.updated_src)) {
                handleDataChange(e.updated_src);
              }
            }}
            style={{
              fontSize: '13px',
              lineHeight: '1.4',
            }}
          />
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 shadow-sm dark:border-blue-800/30 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 p-1.5 shadow-sm dark:bg-blue-900/50">
              <Icon icon="lucide:info" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-base/7 font-semibold text-blue-800 dark:text-blue-200">使用说明</h4>
          </div>
          <ul className="list-inside list-disc space-y-1.5 pl-3 text-xs text-blue-700 dark:text-blue-300">
            <li>
              <span className="font-medium">数据格式：</span>JSON 数组，每个对象包含 name（作品名称）和 date（播出日期）字段
            </li>
            <li>
              <span className="font-medium">在线编辑：</span>点击 JSON 视图中的值可以直接编辑，支持添加、删除和修改数据
            </li>
            <li>
              <span className="font-medium">导入导出：</span>支持从本地文件导入 JSON 数据，也可以导出当前数据
            </li>
            <li>
              <span className="font-medium">热门精选基础：</span>
              点击&ldquo;使用热门精选数据源&rdquo;可以基于热门精选作品作为基础进行编辑
            </li>
            <li>
              <span className="font-medium">自动保存：</span>编辑的数据会自动保存到浏览器本地存储，刷新页面不会丢失
            </li>
            <li>
              <span className="font-medium">实时验证：</span>编辑时会自动验证数据格式，确保数据结构正确
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
