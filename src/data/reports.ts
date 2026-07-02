import type { ComparisonReport } from '@/types';

export const reports: ComparisonReport[] = [
  {
    slug: 'playtime-vs-bingoplus',
    title: 'PlayTime vs BingoPlus',
    sites: ['playtime', 'bingoplus'],
    summary:
      'A head-to-head between two of the Philippines\' most popular gaming brands — PlayTime leads in brand heat while BingoPlus offers slightly faster page loads.',
    updatedAt: '2026-07-01',
    sections: [],
  },
  {
    slug: 'bet88-vs-okbet',
    title: 'Bet88 vs OKBet',
    sites: ['bet88', 'okbet'],
    summary:
      'Both platforms hold PAGCOR licenses and cater to Filipino players. Bet88 excels in payment convenience and live casino, while OKBet leads in sports betting depth and mobile experience.',
    updatedAt: '2026-06-01',
    sections: [
      {
        title: 'Licensing & Trust',
        winner: 'bet88',
        content:
          'Both sites operate under PAGCOR oversight. Bet88 has a longer track record with transparent payout policies and responsive dispute resolution.',
      },
      {
        title: 'Payment Methods',
        winner: 'bet88',
        content:
          'Bet88 supports GCash, Maya, bank transfer, and over-the-counter options with lower minimum deposits. OKBet matches most methods but has slightly higher withdrawal minimums.',
      },
      {
        title: 'Sports Betting',
        winner: 'okbet',
        content:
          'OKBet offers deeper markets for PBA, UAAP, and local boxing events. Bet88 covers major international leagues but with fewer niche local markets.',
      },
      {
        title: 'Bonuses & Promotions',
        content:
          'Bet88 offers a more generous welcome package for casino players. OKBet focuses on sports reload bonuses and accumulator boosts.',
      },
    ],
  },
  {
    slug: 'bet88-vs-nustar-vs-bingoplus',
    title: 'Bet88 vs Nustar vs BingoPlus',
    sites: ['bet88', 'nustar', 'bingoplus'],
    summary:
      'A three-way comparison for players choosing between a full-service casino, resort-backed platform, and bingo-focused site.',
    updatedAt: '2026-06-01',
    sections: [
      {
        title: 'Game Variety',
        winner: 'bet88',
        content:
          'Bet88 offers the broadest mix of slots, live tables, and sports. Nustar focuses on premium slots and VIP tables. BingoPlus dominates in bingo and casual games.',
      },
      {
        title: 'Best For',
        content:
          'Choose Bet88 for an all-in-one experience, Nustar for high-roller slot play, and BingoPlus for social bingo sessions.',
      },
    ],
  },
  {
    slug: 'okbet-vs-bingoplus',
    title: 'OKBet vs BingoPlus',
    sites: ['okbet', 'bingoplus'],
    summary:
      'Sports bettors versus bingo enthusiasts — two different player profiles with distinct strengths.',
    updatedAt: '2026-06-01',
    sections: [
      {
        title: 'Target Audience',
        content:
          'OKBet is built for sports and esports bettors. BingoPlus targets casual players who enjoy community-driven bingo rooms.',
      },
      {
        title: 'Mobile Experience',
        winner: 'okbet',
        content:
          'OKBet\'s native app offers smoother in-play betting. BingoPlus mobile web works well for bingo but lacks a dedicated sports interface.',
      },
    ],
  },
];

export function getReportBySlug(slug: string): ComparisonReport | undefined {
  return reports.find((r) => r.slug === slug);
}

export function findReportForSites(siteSlugs: string[]): ComparisonReport | undefined {
  const sorted = [...siteSlugs].sort().join(',');
  return reports.find((r) => [...r.sites].sort().join(',') === sorted);
}

export function buildComparisonSlug(siteSlugs: string[]): string {
  return [...siteSlugs].sort().join('-vs-');
}
