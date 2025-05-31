'use client';

import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

interface ResetConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmDialog = React.memo(function ResetConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
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
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                确认重置
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ResetConfirmDialog.displayName = 'ResetConfirmDialog';
