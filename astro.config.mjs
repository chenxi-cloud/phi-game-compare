import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import { REPORTS_PUBLIC } from './src/config/features.mjs';

/**
 * Rehype plugin: force affiliate/outbound isolation on every external link that
 * Markdown produces (review articles). Prevents link-equity leaks and referrer
 * exposure. Our own money link (jiliphil.vip) keeps referrer for tracking but
 * still gets `sponsored`; all other external hosts get the full lockdown.
 */
const COMING_SOON = '/reports-coming-soon/';

function rehypeAffiliateRel() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        let href = node.properties?.href;
        // Soft-launch: in-article links to the hidden comparison reports would
        // 404. Point every /reports/* link at a single "under construction"
        // placeholder page instead (the .md files stay untouched).
        if (!REPORTS_PUBLIC && typeof href === 'string' && href.startsWith('/reports/')) {
          href = COMING_SOON;
          node.properties.href = href;
        }
        if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
          const isMoneyLink = /(^|\.)jiliphil\.vip/i.test(new URL(href).hostname);
          node.properties.target = '_blank';
          node.properties.rel = isMoneyLink
            ? 'sponsored noopener'
            : 'nofollow sponsored noopener noreferrer';
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://www.pagsuribonus.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => {
        // Cloaked redirects and the placeholder page never belong in a sitemap.
        if (page.includes('/out/') || page.includes('/reports-coming-soon')) return false;
        // Keep the hidden comparison layer out of the sitemap during soft-launch.
        if (!REPORTS_PUBLIC && (page.includes('/reports/') || page.includes('/all-comparisons'))) {
          return false;
        }
        return true;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeAffiliateRel],
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
