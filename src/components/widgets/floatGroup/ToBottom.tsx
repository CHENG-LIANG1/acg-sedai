import { springScrollTo } from '@/lib/scroller';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

const ToBottom = ({ className }: { className?: string }) => {
  const handleToBottom = () => {
    springScrollTo('bottom');
  };

  return (
    <div onClick={handleToBottom} className={cn('cursor-pointer px-2.5 py-1.5 group-hover:text-primary md:px-4', className)}>
      <Icon icon="fa:arrow-down" />
    </div>
  );
};

export default ToBottom;
