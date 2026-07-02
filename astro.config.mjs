import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';

/**
 * Rehype plugin: force affiliate/outbound isolation on every external link that
 * Markdown produces (review articles). Prevents link-equity leaks and referrer
 * exposure. Our own money link (jiliphil.vip) keeps referrer for tracking but
 * still gets `sponsored`; all other external hosts get the full lockdown.
 */
function rehypeAffiliateRel() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
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
  integrations: [sitemap()],
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
