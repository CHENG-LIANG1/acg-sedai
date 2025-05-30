import { cn } from '@/lib/utils';
import MarkdownComp from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Markdown({ content, className }: { content?: string; className?: string }) {
  return (
    <div className={cn('prose dark:prose-invert', className)}>
      <MarkdownComp remarkPlugins={[remarkGfm]}>{content}</MarkdownComp>
    </div>
  );
}
