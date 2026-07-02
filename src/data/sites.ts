import type { Site } from '@/types';

export const sites: Site[] = [
  {
    id: '0',
    name: 'PlayTime',
    slug: 'playtime',
    logo: '/logos/playtime.svg',
    tagline: 'Philippines #1 search volume platform with full game portfolio',
    rating: 4.8,
    license: 'PAGCOR',
    highlights: ['Top Search Volume', 'Fast Withdrawal', 'Multi-Category Games'],
  },
  {
    id: '1',
    name: 'Bet88',
    slug: 'bet88',
    logo: '/logos/bet88.svg',
    tagline: 'Popular PAGCOR-licensed platform with local payment support',
    rating: 4.5,
    license: 'PAGCOR',
    highlights: ['GCash & Maya', 'Live Casino', 'Sports Betting'],
  },
  {
    id: '2',
    name: 'OKBet',
    slug: 'okbet',
    logo: '/logos/okbet.svg',
    tagline: 'Strong sportsbook with competitive odds for local leagues',
    rating: 4.3,
    license: 'PAGCOR',
    highlights: ['PBA & UAAP', 'Fast Withdrawals', 'Mobile App'],
  },
  {
    id: '3',
    name: 'Nustar',
    slug: 'nustar',
    logo: '/logos/nustar.svg',
    tagline: 'Integrated resort-casino experience with online gaming',
    rating: 4.1,
    license: 'PAGCOR',
    highlights: ['VIP Program', 'Slot Variety', '24/7 Support'],
  },
  {
    id: '4',
    name: 'BingoPlus',
    slug: 'bingoplus',
    logo: '/logos/bingoplus.svg',
    tagline: 'Leading bingo and casual games platform in the Philippines',
    rating: 4.0,
    license: 'PAGCOR',
    highlights: ['Live Bingo', 'Community Games', 'Daily Promos'],
  },
];

export function getSiteBySlug(slug: string): Site | undefined {
  return sites.find((s) => s.slug === slug);
}

export function getSitesBySlugs(slugs: string[]): Site[] {
  return slugs
    .map((slug) => getSiteBySlug(slug))
    .filter((s): s is Site => s !== undefined);
}
