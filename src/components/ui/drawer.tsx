import { fontVariants } from '@/constants/theme/font';
import { cn } from '@/lib/utils';
import {
  FloatingFocusManager,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'motion/react';
import React, { PropsWithChildren, cloneElement, useEffect, useState } from 'react';
import { MenuIcon } from '../ui/icon/MenuIcon';

export type Position = 'top' | 'bottom' | 'left' | 'right';

type DrawerProps = {
  open?: boolean;
  title?: React.ReactNode;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onExitComplete?: () => void;
  render: (props: { close: () => void }) => React.ReactNode;
  children?: JSX.Element;
  className?: string;
  scroll?: boolean;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  position?: Position;
};
const posClass: { [key in Position]: string } = {
  top: '',
  bottom: '',
  left: 'inset-y-0 left-0 rounded-tr-xl rounded-br-xl',
  right: '',
};
function Drawer({
  render,
  open: passedOpen = false,
  title,
  children,
  onOpenChange,
  onExitComplete,
  onClose: prevOnClose,
  className,
  renderHeader,
  renderFooter,
  scroll = true,
  position = 'left',
}: PropsWithChildren<DrawerProps>) {
  const [open, setOpen] = useState(false);

  const nodeId = useFloatingNodeId();

  const onClose = (value: boolean) => {
    setOpen(value);
    prevOnClose?.();
    onOpenChange?.(value);
  };

  const {
    refs: { setFloating, setReference },
    context,
  } = useFloating({
    open,
    nodeId,
    onOpenChange: onClose,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useRole(context), useDismiss(context)]);

  useEffect(() => {
    if (passedOpen === undefined) return;
    setOpen(passedOpen);
  }, [passedOpen]);

  return (
    <FloatingNode id={nodeId}>
      {children && cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
      <FloatingPortal>
        <AnimatePresence onExitComplete={onExitComplete}>
          {open && (
            <FloatingOverlay lockScroll className={'relative z-50 h-screen bg-black/30'}>
              <FloatingFocusManager context={context}>
                <motion.div
                  className={cn(
                    'absolute z-50 flex min-w-[10rem] flex-col bg-background p-0 md:min-w-[6rem]',
                    posClass[position || 'left'],
                    fontVariants,
                    className,
                  )}
                  initial={{ width: 20, x: -100 }}
                  animate={{ width: 'auto', x: 0 }}
                  exit={{ width: 20, x: -100 }}
                  transition={{ type: 'spring', damping: 18 }}
                  {...getFloatingProps({ ref: setFloating })}
                >
                  {title || renderHeader ? (
                    <header className="flex items-center justify-between px-4 pt-4">
                      <div className="flex-1">
                        {title && <div className="relative h-auto text-xl font-medium leading-[22px]">{title}</div>}
                        {renderHeader?.()}
                      </div>
                      {/* Close button for mobile */}
                      <motion.div
                        whileTap={{ scale: 1.3 }}
                        className="relative size-8 cursor-pointer md:block"
                        onClick={() => onClose(false)}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <MenuIcon className="size-8" initVariant="animate" />
                      </motion.div>
                    </header>
                  ) : (
                    /* Show close button even when no title/header */
                    <header className="flex items-center justify-end px-4 pt-4 md:block">
                      <motion.div
                        whileTap={{ scale: 1.3 }}
                        className="relative size-8 cursor-pointer"
                        onClick={() => onClose(false)}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <MenuIcon className="size-8" initVariant="animate" />
                      </motion.div>
                    </header>
                  )}
                  <main
                    className={cn('h-full', {
                      'overflow-auto': scroll,
                    })}
                  >
                    {render({ close: () => onClose(false) })}
                  </main>
                  {renderFooter && (
                    <footer className="absolute bottom-0 left-0 right-0 rounded-b-[10px] px-6 py-6 backdrop-blur-xl">
                      {renderFooter?.()}
                    </footer>
                  )}
                </motion.div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </FloatingNode>
  );
}

export default React.memo(Drawer);
