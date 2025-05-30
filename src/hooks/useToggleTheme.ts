import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { useIsMounted } from './common/useIsMounted';
import { useThrottle } from './common/useThrottle';

/**
 * 它返回一个在明暗之间切换的函数。
 * @returns 切换主题的函数
 */
export const useToggleTheme = () => {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    console.log('toggleTheme', theme);
    if (!isMounted) return;
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [isMounted, setTheme, theme]);

  return useThrottle(toggleTheme);
};
