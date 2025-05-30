import Root from '@/components/layout/root';
import { seoConfig } from '@/constants/site-config';
import { fontVariants } from '@/constants/theme/font';
import { cn } from '@/lib/utils';
import Providers from './providers';
import Head from 'next/head';

import '@/styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  metadataBase: seoConfig.url,

  title: seoConfig.title,
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  openGraph: {
    title: {
      default: seoConfig.title,
    },
    description: seoConfig.description,
    siteName: `${seoConfig.title}`,
    locale: 'zh_CN',
    type: 'website',
    url: seoConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.title,
    description: seoConfig.description,
  },
};

export default async function RootLayout(props: Props) {
  const { children } = props;
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NODE_ENV === 'production' && (
          <Script defer src="https://stats.cosine.ren/script.js" data-website-id="7ad2461d-d49f-4b11-b33f-c09747231b13" />
        )}
      </Head>
      <body className={cn('vertical-scrollbar m-0 h-full overscroll-none p-0', ...fontVariants)}>
        <Providers>
          <Root>{children}</Root>
        </Providers>
      </body>
    </html>
  );
}
