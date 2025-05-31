'use client';

import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import React from 'react';

interface FilterInfoProps {
  filterText: string;
}

export const FilterInfo = React.memo(function FilterInfo({ filterText }: FilterInfoProps) {
  if (!filterText) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary"
    >
      <Icon icon="lucide:filter" className="h-3 w-3" />
      <span>
        正在搜索: &ldquo;<span className="font-medium">{filterText}</span>&rdquo;
      </span>
    </motion.div>
  );
});

FilterInfo.displayName = 'FilterInfo';
