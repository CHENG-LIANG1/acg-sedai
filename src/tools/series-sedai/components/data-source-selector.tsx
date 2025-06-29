'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useAtomValue } from 'jotai';
import { yuriDataSourceAtom } from '../store';

export type DataSourceType = 'full' | 'popular';

interface DataSourceSelectorProps {
  currentSource: DataSourceType;
  onSourceChange: (source: DataSourceType) => void;
  fullCount: number;
  popularCount: number;
  className?: string;
}

const sourceOptions = [
  {
    value: 'popular' as const,
    label: '热门精选',
    icon: 'lucide:star',
    getDescription: (count: number) => `精选 ${count} 部热门动画`,
  },
  {
    value: 'full' as const,
    label: '完整列表',
    icon: 'lucide:database',
    getDescription: (count: number) => `包含全部 ${count} 部动画，完整列表`,
  },
];

export function DataSourceSelector({
  currentSource,
  onSourceChange,
  fullCount,
  popularCount,
  className,
}: DataSourceSelectorProps) {
  const customDataSource = useAtomValue(yuriDataSourceAtom);
  const hasCustomData = Boolean(customDataSource);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <Icon icon="lucide:filter" className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">数据源</span>
        {hasCustomData && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800/20 dark:text-amber-200">
            自定义数据优先
          </span>
        )}
      </div>

      {hasCustomData && (
        <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:info" className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              当前使用自定义数据源（{customDataSource?.length || 0}{' '}
              部作品），下方选择器仅在没有自定义数据时生效，点击重置为默认可删除自定义数据源
            </p>
          </div>
        </div>
      )}

      <div
        className={cn(
          'relative flex items-center rounded-lg border border-border bg-background p-1',
          hasCustomData && 'opacity-50',
        )}
      >
        {sourceOptions.map((option) => {
          const isActive = currentSource === option.value;
          const count = option.value === 'full' ? fullCount : popularCount;

          return (
            <button
              key={option.value}
              onClick={() => onSourceChange(option.value)}
              disabled={hasCustomData}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                hasCustomData && 'cursor-not-allowed',
                isActive ? 'text-white' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
              )}
            >
              {isActive && !hasCustomData && (
                <motion.div
                  layoutId="activeDataSourceTab"
                  className="absolute inset-0 rounded-md bg-primary shadow-sm"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2">
                <Icon
                  icon={option.icon}
                  className={cn(
                    'h-3.5 w-3.5 transition-colors',
                    isActive && !hasCustomData ? 'text-primary-foreground' : 'text-current',
                  )}
                />
                <span className="hidden sm:inline">{option.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 font-mono text-xs',
                    isActive && !hasCustomData
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground">
        {hasCustomData
          ? `当前优先使用自定义数据源，共 ${customDataSource?.length || 0} 部作品`
          : sourceOptions
              .find((opt) => opt.value === currentSource)
              ?.getDescription(currentSource === 'full' ? fullCount : popularCount)}
      </p>
    </div>
  );
}
