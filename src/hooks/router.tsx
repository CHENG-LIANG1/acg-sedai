import { routers } from '@/constants/router';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useToggleTheme } from './useToggleTheme';

export const useNavItems = () => {
  const toggleTheme = useToggleTheme();
  const buttons = useMemo(
    () => [
      {
        key: 'Github',
        icon: <Icon icon="ant-design:github-filled" className="size-8 cursor-pointer" />,
        onClick: () => window?.open('https://github.com/yusixian/acg-sedai', '_blank'),
      },
      {
        key: 'CgDarkMode',
        icon: <Icon icon="gg:dark-mode" className="size-8 cursor-pointer" />,
        onClick: toggleTheme,
      },
    ],
    [toggleTheme],
  );
  return { routers, buttons };
};
