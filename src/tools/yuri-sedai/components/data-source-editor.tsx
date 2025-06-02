'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { popularAnimeSubset, yuriTable } from '../data';
import { yuriDataSourceAtom } from '../store';
import type { YuriDataItem } from '../types';

// Dynamic import of ReactJson to avoid SSR issues
const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8 text-gray-500">加载编辑器中...</div>,
});

interface DataSourceEditorProps {
  className?: string;
}

export function DataSourceEditor({ className }: DataSourceEditorProps) {
  const [customDataSource, setCustomDataSource] = useAtom(yuriDataSourceAtom);
  const { theme } = useTheme();
  const [isTextMode, setIsTextMode] = useState(false);
  const [textValue, setTextValue] = useState('');

  // Use custom data source if available, otherwise use default
  const currentDataSource = useMemo(() => {
    return customDataSource || yuriTable;
  }, [customDataSource]);

  const isUsingCustomData = Boolean(customDataSource);

  // Update text value when switching to text mode or when data changes
  const formattedJsonText = useMemo(() => {
    return JSON.stringify(currentDataSource, null, 2);
  }, [currentDataSource]);

  // Handle switching between JSON and text modes
  const handleModeSwitch = useCallback(
    (toTextMode: boolean) => {
      if (toTextMode) {
        // Switching to text mode - populate text area with current data
        setTextValue(formattedJsonText);
      }
      setIsTextMode(toTextMode);
    },
    [formattedJsonText],
  );

  // Handle text mode changes
  const handleTextChange = useCallback((value: string) => {
    setTextValue(value);
  }, []);

  // Save text mode changes
  const handleTextSave = useCallback(() => {
    try {
      const parsedData = JSON.parse(textValue);

      if (!Array.isArray(parsedData)) {
        throw new Error('数据必须是数组格式');
      }

      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];
        if (!item.name || !item.date || typeof item.name !== 'string' || typeof item.date !== 'string') {
          throw new Error(`第 ${i + 1} 项数据格式不正确：需要包含 name 和 date 字段，且均为字符串类型`);
        }
      }

      setCustomDataSource(parsedData);
      toast.success('文本编辑已保存！');
    } catch (error) {
      toast.error(`保存失败：${error instanceof Error ? error.message : '无效的 JSON 格式'}`);
    }
  }, [textValue, setCustomDataSource]);

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
    // Check if we're in a client environment
    if (typeof document === 'undefined') return;

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
    // Check if we're in a client environment
    if (typeof document === 'undefined') return;

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
      <div className="flex items-start gap-4 md:flex-col">
        {/* Interactive JSON Editor */}
        <div className="h-[27.5rem] min-h-[27.5rem] basis-2/3 overflow-auto rounded-xl border-2 border-border bg-background shadow-lg dark:bg-[#151515] md:w-full md:basis-1">
          <div className="border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/30 p-1 shadow-sm">
                  <Icon
                    icon={isTextMode ? 'lucide:file-text' : 'lucide:edit-3'}
                    className="h-3 w-3 text-primary drop-shadow-sm"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {isTextMode ? '纯文本编辑模式' : '可视化编辑数据源'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isTextMode && (
                  <button
                    onClick={handleTextSave}
                    className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 transition-all hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/40"
                  >
                    <Icon icon="lucide:save" className="h-3 w-3" />
                    保存
                  </button>
                )}
                <div className="flex rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                  <button
                    onClick={() => handleModeSwitch(false)}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all',
                      !isTextMode
                        ? 'text-primary-foreground bg-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                    )}
                  >
                    <Icon icon="lucide:layout" className="h-3 w-3" />
                    可视化
                  </button>
                  <button
                    onClick={() => handleModeSwitch(true)}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all',
                      isTextMode
                        ? 'text-primary-foreground bg-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                    )}
                  >
                    <Icon icon="lucide:file-text" className="h-3 w-3" />
                    文本
                  </button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isTextMode ? '编辑后点击保存' : '点击值可直接编辑'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            {isTextMode ? (
              <textarea
                value={textValue}
                onChange={(e) => handleTextChange(e.target.value)}
                className="h-[21.75rem] w-full resize rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-primary/20"
                placeholder="在此处编辑 JSON 数据..."
                spellCheck={false}
              />
            ) : (
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
            )}
          </div>
        </div>
        {/* Usage Instructions */}
        <div className="basis-1/3 rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 shadow-sm dark:border-blue-800/30 dark:from-blue-950/30 dark:to-indigo-950/30 md:basis-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-1.5 shadow-sm dark:bg-blue-900/50">
                <Icon icon="lucide:info" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-base/7 font-semibold text-blue-800 dark:text-blue-200">使用说明</h4>
            </div>
            <ul className="list-inside list-disc space-y-1.5 pl-3 text-xs text-blue-700 dark:text-blue-300">
              <li>
                <span className="font-medium">数据格式：</span>JSON 数组，每个对象包含 name（作品名称）和
                date（播出日期）字段，日期格式为 YYYY/MM/DD
              </li>
              <li>
                <span className="font-medium">可视化编辑：</span>点击 JSON 视图中的值可以直接增删查改
              </li>
              <li>
                <span className="font-medium">纯文本编辑：</span>切换到文本模式可以直接编辑 JSON 文本，编辑后需点击保存按钮
              </li>
              <li>
                <span className="font-medium">导入导出：</span>支持从本地文件导入 JSON 数据，也可以导出当前数据
              </li>
              <li>
                <span className="font-medium">热门精选：</span>
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
    </div>
  );
}
