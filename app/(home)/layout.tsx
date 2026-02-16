import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
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
    { text: 'Docs', url: '/docs' },
    { text: 'Quickstart', url: '/docs/getting-started/quickstart' },
    { text: 'API', url: '/docs/api-reference/rest-api' },
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
  return <HomeLayout {...navConfig}>{children}</HomeLayout>;
}
