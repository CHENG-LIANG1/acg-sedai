'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

export type ViewType = 'compact' | 'traditional';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

const viewOptions = [
  {
    value: 'traditional' as const,
    label: '传统表格',
    icon: 'lucide:table-2',
    description: '经典的表格形式展示',
  },
  {
    value: 'compact' as const,
    label: '紧凑视图',
    icon: 'lucide:layout-grid',
    description: '按年份分组的紧凑展示',
  },
];

export function ViewSelector({ currentView, onViewChange, className }: ViewSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <Icon icon="lucide:layout" className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">视图模式</span>
      </div>

      <div className="relative flex items-center rounded-lg border border-border bg-background p-1">
        {viewOptions.map((option) => {
          const isActive = currentView === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onViewChange(option.value)}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeViewTab"
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
                  className={cn('h-3.5 w-3.5 transition-colors', isActive ? 'text-primary-foreground' : 'text-current')}
                />
                <span className="hidden sm:inline">{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground">{viewOptions.find((opt) => opt.value === currentView)?.description}</p>
    </div>
  );
}
