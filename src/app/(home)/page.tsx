'use client';

import { ClientOnly } from '@/components/common/ClientOnly';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { microReboundPreset } from '@/constants/anim';
import { STORAGE_KEY } from '@/constants/storage';
import { tools, toolsByCategory } from '@/tools';
import { Tool } from '@/tools/tools.types';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import React, { Fragment } from 'react';
import { useLocalStorage } from 'react-use';

export default function Home() {
  const router = useRouter();
  const [favoriteTools, setFavoriteTools] = useLocalStorage<string[]>(STORAGE_KEY.FAVORITE_TOOLS, []);

  return (
    <div className="flex flex-col gap-2">
      <ClientOnly>
        <AnimatePresence>
          {favoriteTools?.length ? (
            <>
              <h1 className="flex items-center gap-1 text-xl font-bold tracking-wide">
                <Icon icon="flat-color-icons:like" />
                我的收藏
              </h1>
              <div className="mb-2 grid grid-cols-4 gap-3 md:grid-cols-3 xs:grid-cols-2">
                {favoriteTools.map((path) => {
                  const toolIdx = tools.findIndex((t) => t.path === path);
                  if (toolIdx === -1) return null;
                  const tool = tools[toolIdx];
                  return (
                    <motion.div
                      className="cursor-pointer select-none"
                      whileHover={{ y: -5 }}
                      layoutId={tool.path}
                      key={tool.path}
                      onClick={() => router.push(tool.path)}
                    >
                      <Card className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Icon icon={tool.icon} className="fill-muted-foreground text-4xl" />
                          <motion.div
                            whileHover={{ scale: 1.3 }}
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                              e?.preventDefault();
                              e?.stopPropagation();
                              setFavoriteTools(favoriteTools?.length ? favoriteTools.filter((t) => t !== tool.path) : []);
                            }}
                            transition={microReboundPreset}
                          >
                          </motion.div>
                        </div>
                        <CardTitle>{tool.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : null}
          {toolsByCategory.map(({ name, components }, categoryIndex) => (
            <Fragment key={categoryIndex}>
              <h1 className="text-xl font-bold tracking-wide">{name}</h1>
              <div className="mb-2 grid grid-cols-4 gap-3 md:grid-cols-3 xs:grid-cols-2">
                {components.map((tool) => {
                  if (favoriteTools?.length && favoriteTools?.includes(tool.path)) return null;
                  return <HomeItem tool={tool} key={tool.path} />;
                })}
              </div>
            </Fragment>
          ))}
        </AnimatePresence>
      </ClientOnly>
    </div>
  );
}

const HomeItem = React.memo(({ tool }: { tool: Tool }) => {
  const router = useRouter();
  const [favoriteTools, setFavoriteTools] = useLocalStorage<string[]>(STORAGE_KEY.FAVORITE_TOOLS, []);

  return (
    <motion.div
      className="cursor-pointer select-none"
      whileHover={{ y: -5 }}
      layoutId={tool.path}
      onClick={() => router.push(tool.path)}
    >
      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Icon icon={tool.icon} className="fill-muted-foreground text-4xl" />
          <motion.div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e?.preventDefault();
              e?.stopPropagation();
              setFavoriteTools(favoriteTools?.concat(tool.path) ?? [tool.path]);
            }}
            whileHover={{ scale: 1.3 }}
            transition={microReboundPreset}
          >
          </motion.div>
        </div>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
      </Card>
    </motion.div>
  );
});
HomeItem.displayName = 'HomeItem';
