import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

const SITE_URL = 'https://docs.usemacaw.io';

const navConfig: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <img src="/img/logo-64.png" alt="Macaw" width={28} height={28} />
        <span className="font-bold">Macaw OpenVoice</span>
      </div>
    ),
  },
  links: [
    {
      text: 'llms.txt',
      url: `${SITE_URL}/llms.txt`,
      external: true,
    },
    {
      text: 'GitHub',
      url: 'https://github.com/usemacaw/macaw-openvoice',
      external: true,
    },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...navConfig}
      sidebar={{ defaultOpenLevel: 0, collapsible: true }}
    >
      {children}
    </DocsLayout>
  );
}
