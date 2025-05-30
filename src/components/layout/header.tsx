import { childDelayOpenAnimVariants } from '@/constants/anim';
import { microDampingPreset } from '@/constants/anim/spring';
import { siteConfig } from '@/constants/site-config';
import { useScrollHide } from '@/hooks/common/useScrollHide';
import { useNavItems } from '@/hooks/router';
import { cn } from '@/lib/utils';
import { oneLevelTabSelectPathAtom, siderExpandAtom } from '@/store/app';
import { useAtom, useSetAtom } from 'jotai';
import { motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MenuIcon } from '../ui/icon/MenuIcon';
import NavItem from './navigator/NavItem';

export function Header() {
  const router = useRouter();
  const { alternate, title } = siteConfig;
  const isVisible = useScrollHide();
  const setSelectPath = useSetAtom(oneLevelTabSelectPathAtom);
  const [siderExpand, setSiderExpand] = useAtom(siderExpandAtom);
  const { buttons } = useNavItems();
  const path = usePathname();

  /** Set SelectIdx When Change Route */
  useEffect(() => {
    setSelectPath(path);
  }, [path, setSelectPath]);

  return (
    <motion.header
      className={cn(
        'sticky inset-x-0 top-0 z-10 flex h-14 select-none items-center gap-4 border-b border-border bg-background px-4 py-1 text-black dark:text-white',
      )}
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={microDampingPreset}
    >
      <>
        <motion.nav initial={false} animate={siderExpand ? 'open' : 'closed'} className="flex justify-end">
          <motion.div
            whileTap={{ scale: 1.3 }}
            className="relative size-8"
            onClick={() => setSiderExpand(!siderExpand)}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            <MenuIcon className="size-8" initVariant={siderExpand ? 'animate' : 'normal'} />
          </motion.div>
        </motion.nav>
      </>
      <motion.div
        initial={{ rotate: -180, scale: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.1 }}
        className="flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap text-4xl font-bold"
        onClick={() => router.push('/')}
      >
        <p className="font-cherry capitalize tracking-widest text-primary">{alternate ?? title}</p>
      </motion.div>
      <motion.div
        initial="closed"
        animate="open"
        variants={childDelayOpenAnimVariants}
        className="ml-4 flex h-full w-full flex-grow gap-4"
      >
        <div className="ml-auto flex items-center gap-1">
          {buttons.map(({ key, icon, onClick }) => (
            <NavItem className="px-1 py-1" key={key} onClick={onClick} icon={icon} />
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}
