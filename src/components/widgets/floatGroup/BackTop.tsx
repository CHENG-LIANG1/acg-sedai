import { springScrollTo } from '@/lib/scroller';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

const BackTop = ({ className }: { className?: string }) => {
  const handleBackTop = () => {
    springScrollTo(0);
  };

  return (
    <div onClick={handleBackTop} className={cn('cursor-pointer px-2.5 py-1.5 group-hover:text-primary md:px-4', className)}>
      <Icon icon="fa:arrow-up" />
    </div>
  );
};

export default BackTop;
