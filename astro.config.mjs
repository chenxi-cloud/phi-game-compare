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
const MONEY_LINK = 'https://www.jiliphil.vip/register?affiliateCode=seo005';

function rehypeAffiliateRel() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        let href = node.properties?.href;
        // Soft-launch: in-article links to the hidden comparison reports would
        // 404. Redirect them to the JiliPhil money link (the anchor text already
        // promotes JiliPhil), keeping the CTA useful and conversion-focused.
        if (!REPORTS_PUBLIC && typeof href === 'string' && href.startsWith('/reports/')) {
          href = MONEY_LINK;
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
  site: 'https://phi-game-compare.vercel.app',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => {
        // Cloaked redirects never belong in a sitemap.
        if (page.includes('/out/')) return false;
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
