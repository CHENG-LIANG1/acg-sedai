'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface MenuIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MenuIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  initVariant?: 'normal' | 'animate';
}

const lineVariants: Variants = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1,
  },
  animate: (custom: number) => ({
    rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
    y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
    opacity: custom === 2 ? 0 : 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  }),
};

const MenuIcon = forwardRef<MenuIconHandle, MenuIconProps>(
  ({ onMouseEnter, onMouseLeave, className, initVariant = 'normal', size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);
    const [currentState, setCurrentState] = useState<'normal' | 'animate'>(initVariant);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          controls.start('animate');
          setCurrentState('animate');
        },
        stopAnimation: () => {
          controls.start('normal');
          setCurrentState('normal');
        },
      };
    });

    useEffect(() => {
      // Set initial state
      controls.set(initVariant);
    }, [initVariant, controls]);

    const handleClick = useCallback(() => {
      if (!isControlledRef.current) {
        const newState = currentState === 'normal' ? 'animate' : 'normal';
        setCurrentState(newState);
        controls.start(newState);
      }
    }, [currentState, controls]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          const hoverState = currentState === 'normal' ? 'animate' : 'normal';
          controls.start(hoverState);
        }
        onMouseEnter?.(e);
      },
      [controls, currentState, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start(currentState);
        }
        onMouseLeave?.(e);
      },
      [controls, currentState, onMouseLeave]
    );

    return (
      <div
        className={cn('cursor-pointer', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.line
            x1="4"
            y1="6"
            x2="20"
            y2="6"
            variants={lineVariants}
            animate={controls}
            custom={1}
          />
          <motion.line
            x1="4"
            y1="12"
            x2="20"
            y2="12"
            variants={lineVariants}
            animate={controls}
            custom={2}
          />
          <motion.line
            x1="4"
            y1="18"
            x2="20"
            y2="18"
            variants={lineVariants}
            animate={controls}
            custom={3}
          />
        </svg>
      </div>
    );
  }
);

MenuIcon.displayName = 'MenuIcon';

export { MenuIcon };
