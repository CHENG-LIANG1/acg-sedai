import Markdown from '@/components/ui/markdown';
import { seoConfig } from '@/constants/site-config';
import { tools } from '@/tools';
import { createElement } from 'react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return tools.map((tool) => ({
    path: tool.path,
  }));
}

export async function generateMetadata({ params }: { params: { path: string } }): Promise<Metadata> {
  const { path } = params;
  const tool = tools.find((tool) => tool.path === `/${path}`);

  if (!tool) {
    return {
      title: `页面未找到 - ${seoConfig.title}`,
      description: seoConfig.description,
    };
  }

  return {
    title: `${tool.name} - ${seoConfig.title}`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} - ${seoConfig.title}`,
      description: tool.description,
      siteName: seoConfig.title,
      locale: 'zh_CN',
      type: 'website',
      url: `${seoConfig.url}${tool.path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - ${seoConfig.title}`,
      description: tool.description,
    },
  };
}

export default function ToolPage({ params }: { params: { path: string } }) {
  const { path } = params;
  const tool = tools.find((tool) => tool.path === `/${path}`);
  if (!tool) return null;
  const { name, description, component } = tool;
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="h-px w-full bg-foreground" />
      <Markdown content={description} className="whitespace-pre-wrap text-base text-muted-foreground" />
      {createElement(component)}
    </div>
  );
}
